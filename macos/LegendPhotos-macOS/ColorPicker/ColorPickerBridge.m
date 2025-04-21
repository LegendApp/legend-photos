#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ColorPicker, NSObject)

RCT_EXTERN_METHOD(showColorPicker:(NSString *)initialColor
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end