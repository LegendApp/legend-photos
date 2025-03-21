#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(FilePicker, NSObject)

RCT_EXTERN_METHOD(pickFileWithFilenameExtension:(NSArray *)filenameExtensions
                  prompt:(NSString *)prompt
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(pickFolder:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end