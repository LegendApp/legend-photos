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

RCT_EXPORT_METHOD(rawToJpg:(NSString *)rawFilePath
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
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
            resolve(outputFilePath);
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

@end
