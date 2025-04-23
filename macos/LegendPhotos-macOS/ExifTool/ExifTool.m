#import "ExifTool.h"
#import <React/RCTUtils.h>

@implementation ExifTool {
  NSString *_exifToolPath;
}

RCT_EXPORT_MODULE();

- (instancetype)init {
  self = [super init];
  if (self) {
    // Use the system exiftool binary
    _exifToolPath = @"/usr/local/bin/exiftool";

    // Check if the binary exists and is executable
    NSFileManager *fileManager = [NSFileManager defaultManager];
    if (![fileManager fileExistsAtPath:_exifToolPath]) {
      NSLog(@"exiftool binary not found at %@", _exifToolPath);
      _exifToolPath = nil;
    } else if (![fileManager isExecutableFileAtPath:_exifToolPath]) {
      NSLog(@"exiftool binary at %@ is not executable", _exifToolPath);
      _exifToolPath = nil;
    }
  }
  return self;
}

RCT_EXPORT_METHOD(rawToJpg:(nonnull NSString *)rawFilePath
                  maxSize:(nonnull NSNumber *)maxSize
                  resolve:(nonnull RCTPromiseResolveBlock)resolve
                  reject:(nonnull RCTPromiseRejectBlock)reject) {
  // Validate input
  if (rawFilePath.length == 0) {
    reject(@"INVALID_INPUT", @"Raw file path is required", nil);
    return;
  }

  // Check if exiftool is available
  if (_exifToolPath == nil) {
    reject(@"NOT_AVAILABLE", @"exiftool binary not found", nil);
    return;
  }

  // Create output path by replacing the extension with jpg
  NSString *outputFilePath = [rawFilePath stringByDeletingPathExtension];
  outputFilePath = [outputFilePath stringByAppendingString:@"_thumb.jpg"];

  // Set resized output path if maxSize is provided
  NSString *resizedOutputFilePath = nil;
  if ([maxSize integerValue] > 0) {
    resizedOutputFilePath = [rawFilePath stringByDeletingPathExtension];
    resizedOutputFilePath = [resizedOutputFilePath stringByAppendingString:@".jpg"];
  }

  // Create task
  NSTask *task = [[NSTask alloc] init];
  [task setLaunchPath:_exifToolPath];

  // Set arguments for extracting preview - no output file specified in arguments
  [task setArguments:@[@"-b", @"-PreviewImage", rawFilePath]];

  NSPipe *pipe = [NSPipe pipe];
  [task setStandardOutput:pipe];
  [task setStandardError:[NSPipe pipe]]; // Separate pipe for stderr

  NSFileHandle *fileHandle = [pipe fileHandleForReading];

  // Log the command details for debugging
  NSLog(@"ExifTool executing command: %@ %@ > %@", _exifToolPath, [task.arguments componentsJoinedByString:@" "], outputFilePath);

  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    @try {
      [task launch];

      // Read the binary data from stdout
      NSData *outputData = [fileHandle readDataToEndOfFile];

      // Write the binary data to the output file
      NSError *writeError = nil;
      BOOL writeSuccess = [outputData writeToFile:outputFilePath options:NSDataWritingAtomic error:&writeError];

      [task waitUntilExit];
      int status = [task terminationStatus];

      dispatch_async(dispatch_get_main_queue(), ^{
        if (status == 0 && writeSuccess) {
          // Check if the output file exists and has content
          if ([[NSFileManager defaultManager] fileExistsAtPath:outputFilePath]) {
            // If maxSize is provided, resize the image
            if (resizedOutputFilePath != nil) {
              [self resizeImage:outputFilePath toPath:resizedOutputFilePath withMaxSize:maxSize completion:^(BOOL success, NSString *errorMessage) {
                if (success) {
                  resolve(resizedOutputFilePath);
                } else {
                  reject(@"RESIZE_FAILED", errorMessage, nil);
                }
              }];
            } else {
              resolve(outputFilePath);
            }
          } else {
            reject(@"FILE_NOT_CREATED", @"Failed to create output file", nil);
          }
        } else if (!writeSuccess) {
          reject(@"WRITE_FAILED", [NSString stringWithFormat:@"Failed to write output file: %@", writeError.localizedDescription], nil);
        } else {
          // Get stderr output for error message
          NSFileHandle *errorHandle = [((NSPipe *)[task standardError]) fileHandleForReading];
          NSData *errorData = [errorHandle readDataToEndOfFile];
          NSString *errorOutput = [[NSString alloc] initWithData:errorData encoding:NSUTF8StringEncoding];

          reject(@"COMMAND_FAILED", [NSString stringWithFormat:@"exiftool failed with status %d: %@", status, errorOutput], nil);
        }
      });
    } @catch (NSException *exception) {
      NSString *errorMessage = [NSString stringWithFormat:@"Exception: %@", exception.reason];
      dispatch_async(dispatch_get_main_queue(), ^{
        reject(@"EXCEPTION", errorMessage, nil);
      });
    }
  });
}

- (void)resizeImage:(NSString *)inputPath
            toPath:(NSString *)outputPath
        withMaxSize:(nonnull NSNumber *)maxSize
         completion:(void (^)(BOOL success, NSString *errorMessage))completion {

  // First, get the image dimensions
  NSTask *infoTask = [[NSTask alloc] init];
  [infoTask setLaunchPath:@"/usr/bin/sips"];
  [infoTask setArguments:@[@"-g", @"pixelHeight", @"-g", @"pixelWidth", inputPath]];

  NSPipe *infoPipe = [NSPipe pipe];
  [infoTask setStandardOutput:infoPipe];

  @try {
    [infoTask launch];
    [infoTask waitUntilExit];

    NSFileHandle *infoHandle = [infoPipe fileHandleForReading];
    NSData *infoData = [infoHandle readDataToEndOfFile];
    NSString *infoOutput = [[NSString alloc] initWithData:infoData encoding:NSUTF8StringEncoding];

    // Parse height and width from output
    NSInteger height = 0;
    NSInteger width = 0;

    for (NSString *line in [infoOutput componentsSeparatedByString:@"\n"]) {
      if ([line containsString:@"pixelHeight:"]) {
        NSArray *components = [line componentsSeparatedByString:@": "];
        if (components.count > 1) {
          height = [[components lastObject] integerValue];
        }
      }
      if ([line containsString:@"pixelWidth:"]) {
        NSArray *components = [line componentsSeparatedByString:@": "];
        if (components.count > 1) {
          width = [[components lastObject] integerValue];
        }
      }
    }

    if (height <= 0 || width <= 0) {
      completion(NO, @"Could not determine image dimensions");
      return;
    }

    // Create sips task for resizing
    NSTask *sipsTask = [[NSTask alloc] init];
    [sipsTask setLaunchPath:@"/usr/bin/sips"];

    // Determine which dimension to resize based on aspect ratio
    NSMutableArray *args = [NSMutableArray array];
    NSInteger maxSizeValue = [maxSize integerValue];

    if (width > height) {
      // Landscape orientation: constrain width
      [args addObjectsFromArray:@[@"--resampleWidth", [maxSize stringValue]]];
      NSLog(@"Resizing landscape image by width: %ld", (long)maxSizeValue);
    } else {
      // Portrait orientation: constrain height
      [args addObjectsFromArray:@[@"--resampleHeight", [maxSize stringValue]]];
      NSLog(@"Resizing portrait image by height: %ld", (long)maxSizeValue);
    }

    // Add remaining arguments
    [args addObjectsFromArray:@[
      @"--setProperty", @"formatOptions", @"90",
      @"--out", outputPath,
      inputPath
    ]];

    [sipsTask setArguments:args];

    NSPipe *errorPipe = [NSPipe pipe];
    [sipsTask setStandardError:errorPipe];

    NSLog(@"Executing sips: sips %@", [args componentsJoinedByString:@" "]);

    [sipsTask launch];
    [sipsTask waitUntilExit];

    int status = [sipsTask terminationStatus];

    if (status == 0) {
      if ([[NSFileManager defaultManager] fileExistsAtPath:outputPath]) {
        completion(YES, nil);
      } else {
        completion(NO, @"Resized file not created");
      }
    } else {
      NSFileHandle *errorHandle = [errorPipe fileHandleForReading];
      NSData *errorData = [errorHandle readDataToEndOfFile];
      NSString *errorOutput = [[NSString alloc] initWithData:errorData encoding:NSUTF8StringEncoding];

      completion(NO, [NSString stringWithFormat:@"sips failed with status %d: %@", status, errorOutput]);
    }
  } @catch (NSException *exception) {
    NSString *errorMessage = [NSString stringWithFormat:@"Exception during resize: %@", exception.reason];
    completion(NO, errorMessage);
  }
}

@end
