#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(WindowControls, RCTEventEmitter)

// Method to hide window controls (stoplight buttons)
RCT_EXTERN_METHOD(hideWindowControls)

// Method to show window controls (stoplight buttons)
RCT_EXTERN_METHOD(showWindowControls)

// Method to check if window is in fullscreen mode
RCT_EXTERN_METHOD(isWindowFullScreen: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end