#import "FileSystem.h"
#import <React/RCTUtils.h>

@implementation FileSystem

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(unzipFile:(nonnull NSString *)zipPath
                  destPath:(nonnull NSString *)destPath
                  resolve:(nonnull RCTPromiseResolveBlock)resolve
                  reject:(nonnull RCTPromiseRejectBlock)reject) {

    if (zipPath.length == 0 || destPath.length == 0) {
        reject(@"INVALID_ARGS", @"Zip path and destination path are required", nil);
        return;
    }

    // Ensure the destination directory exists
    NSFileManager *fileManager = [NSFileManager defaultManager];
    if (![fileManager fileExistsAtPath:destPath]) {
        NSError *error = nil;
        if (![fileManager createDirectoryAtPath:destPath withIntermediateDirectories:YES attributes:nil error:&error]) {
            reject(@"DIR_CREATE_FAILED", [NSString stringWithFormat:@"Failed to create destination directory: %@", error.localizedDescription], error);
            return;
        }
    }

    // Use a background thread for unzipping
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        @try {
            // Use unzip command line tool
            NSTask *task = [[NSTask alloc] init];
            [task setLaunchPath:@"/usr/bin/unzip"];
            [task setArguments:@[
                @"-o",     // Overwrite files without prompting
                zipPath,   // Source zip file
                @"-d",     // Destination flag
                destPath   // Destination directory
            ]];

            NSPipe *outputPipe = [NSPipe pipe];
            [task setStandardOutput:outputPipe];
            NSPipe *errorPipe = [NSPipe pipe];
            [task setStandardError:errorPipe];

            NSLog(@"Unzipping %@ to %@", zipPath, destPath);
            [task launch];
            [task waitUntilExit];

            int status = [task terminationStatus];

            if (status != 0) {
                // Get error output
                NSFileHandle *errorHandle = [errorPipe fileHandleForReading];
                NSData *errorData = [errorHandle readDataToEndOfFile];
                NSString *errorOutput = [[NSString alloc] initWithData:errorData encoding:NSUTF8StringEncoding];

                dispatch_async(dispatch_get_main_queue(), ^{
                    reject(@"UNZIP_FAILED", [NSString stringWithFormat:@"Failed to unzip file: %@", errorOutput], nil);
                });
                return;
            }

            // Success
            dispatch_async(dispatch_get_main_queue(), ^{
                resolve(@YES);
            });
        } @catch (NSException *exception) {
            NSString *errorMessage = [NSString stringWithFormat:@"Exception during unzip: %@", exception.reason];
            dispatch_async(dispatch_get_main_queue(), ^{
                reject(@"UNZIP_EXCEPTION", errorMessage, nil);
            });
        }
    });
}

RCT_EXPORT_METHOD(makeExecutable:(nonnull NSString *)filePath
                  resolve:(nonnull RCTPromiseResolveBlock)resolve
                  reject:(nonnull RCTPromiseRejectBlock)reject) {

    if (filePath.length == 0) {
        reject(@"INVALID_ARGS", @"File path is required", nil);
        return;
    }

    // Check if file exists
    NSFileManager *fileManager = [NSFileManager defaultManager];
    if (![fileManager fileExistsAtPath:filePath]) {
        reject(@"FILE_NOT_FOUND", [NSString stringWithFormat:@"File not found: %@", filePath], nil);
        return;
    }

    // Use a background thread for chmod
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        @try {
            // Use chmod command to make the file executable
            NSTask *task = [[NSTask alloc] init];
            [task setLaunchPath:@"/bin/chmod"];
            [task setArguments:@[
                @"+x",     // Add executable permission
                filePath   // Target file
            ]];

            NSPipe *errorPipe = [NSPipe pipe];
            [task setStandardError:errorPipe];

            NSLog(@"Making file executable: %@", filePath);
            [task launch];
            [task waitUntilExit];

            int status = [task terminationStatus];

            if (status != 0) {
                // Get error output
                NSFileHandle *errorHandle = [errorPipe fileHandleForReading];
                NSData *errorData = [errorHandle readDataToEndOfFile];
                NSString *errorOutput = [[NSString alloc] initWithData:errorData encoding:NSUTF8StringEncoding];

                dispatch_async(dispatch_get_main_queue(), ^{
                    reject(@"CHMOD_FAILED", [NSString stringWithFormat:@"Failed to set executable permission: %@", errorOutput], nil);
                });
                return;
            }

            // Success
            dispatch_async(dispatch_get_main_queue(), ^{
                resolve(@YES);
            });
        } @catch (NSException *exception) {
            NSString *errorMessage = [NSString stringWithFormat:@"Exception during chmod: %@", exception.reason];
            dispatch_async(dispatch_get_main_queue(), ^{
                reject(@"CHMOD_EXCEPTION", errorMessage, nil);
            });
        }
    });
}

@end