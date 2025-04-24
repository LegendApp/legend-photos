#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(FileSystem, NSObject)

RCT_EXTERN_METHOD(unzipFile:(NSString *)zipPath
                 destPath:(NSString *)destPath
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(makeExecutable:(NSString *)filePath
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)

@end