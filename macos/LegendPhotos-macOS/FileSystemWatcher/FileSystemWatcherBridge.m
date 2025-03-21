#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(FileSystemWatcher, RCTEventEmitter)

// Method to set the directories to watch
RCT_EXTERN_METHOD(setWatchedDirectories:(NSArray *)directories)

// Method to check if a directory is being watched
RCT_EXTERN_METHOD(isWatchingDirectory:(NSString *)directory
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)

@end