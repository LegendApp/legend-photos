#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(RNKeyboardManager, RCTEventEmitter)

// Start monitoring local keyboard events
RCT_EXTERN_METHOD(startMonitoringKeyboard:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Stop monitoring local keyboard events
RCT_EXTERN_METHOD(stopMonitoringKeyboard:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Required for RCTEventEmitter
RCT_EXTERN_METHOD(supportedEvents)

@end