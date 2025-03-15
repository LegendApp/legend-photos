#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// This file is needed to register the native modules with React Native
// It ensures that the modules are properly linked and available to JavaScript

// Register RNKeyboardManager
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