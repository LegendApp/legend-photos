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
  outputFilePath = [outputFilePath stringByAppendingString:@".jpg"];

  // Create a temporary file path for the intermediate image
  NSString *tempFilePath = [NSTemporaryDirectory() stringByAppendingPathComponent:
                            [NSString stringWithFormat:@"%@_temp.jpg", [[NSUUID UUID] UUIDString]]];

  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    @try {
      // First, extract the preview image from RAW to a temporary file
      NSTask *extractTask = [[NSTask alloc] init];
      [extractTask setLaunchPath:_exifToolPath];
      [extractTask setArguments:@[@"-b", @"-PreviewImage", rawFilePath]];

      NSPipe *extractPipe = [NSPipe pipe];
      [extractTask setStandardOutput:extractPipe];
      NSPipe *extractErrorPipe = [NSPipe pipe];
      [extractTask setStandardError:extractErrorPipe];

      // Read the output from exiftool and write it to the temp file
      NSFileHandle *extractHandle = [extractPipe fileHandleForReading];

      NSLog(@"ExifTool extracting preview: %@ -b -PreviewImage %@", _exifToolPath, rawFilePath);

      [extractTask launch];
      NSData *imageData = [extractHandle readDataToEndOfFile];
      [extractTask waitUntilExit];

      int extractStatus = [extractTask terminationStatus];

      if (extractStatus != 0 || imageData.length == 0) {
        // Handle error from exiftool
        NSFileHandle *errorHandle = [extractErrorPipe fileHandleForReading];
        NSData *errorData = [errorHandle readDataToEndOfFile];
        NSString *errorOutput = [[NSString alloc] initWithData:errorData encoding:NSUTF8StringEncoding];

        dispatch_async(dispatch_get_main_queue(), ^{
          reject(@"EXTRACT_FAILED", [NSString stringWithFormat:@"Failed to extract preview: %@", errorOutput], nil);
        });
        return;
      }

      // Write the image data to the temporary file
      NSError *writeError = nil;
      BOOL writeSuccess = [imageData writeToFile:tempFilePath options:NSDataWritingAtomic error:&writeError];

      if (!writeSuccess) {
        dispatch_async(dispatch_get_main_queue(), ^{
          reject(@"WRITE_FAILED", [NSString stringWithFormat:@"Failed to write temp file: %@", writeError.localizedDescription], nil);
        });
        return;
      }

      // Now resize the temporary image directly to the final output
      [self resizeImage:tempFilePath toPath:outputFilePath withMaxSize:maxSize completion:^(BOOL success, NSString *errorMessage) {
        // Delete the temporary file
        NSError *removeError = nil;
        [[NSFileManager defaultManager] removeItemAtPath:tempFilePath error:&removeError];

        if (removeError) {
          NSLog(@"Warning: Failed to remove temporary file: %@", removeError.localizedDescription);
        }

        // Return the result
        dispatch_async(dispatch_get_main_queue(), ^{
          if (success) {
            resolve(outputFilePath);
          } else {
            reject(@"RESIZE_FAILED", errorMessage, nil);
          }
        });
      }];
    } @catch (NSException *exception) {
      NSString *errorMessage = [NSString stringWithFormat:@"Exception: %@", exception.reason];
      dispatch_async(dispatch_get_main_queue(), ^{
        reject(@"EXCEPTION", errorMessage, nil);
      });

      // Try to delete the temporary file if it exists
      if ([[NSFileManager defaultManager] fileExistsAtPath:tempFilePath]) {
        [[NSFileManager defaultManager] removeItemAtPath:tempFilePath error:nil];
      }
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
