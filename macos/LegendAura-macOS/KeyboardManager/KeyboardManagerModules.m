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

// Register for global keyboard events
RCT_EXTERN_METHOD(registerForGlobalKeyboardEvents:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Register a specific global shortcut
RCT_EXTERN_METHOD(registerGlobalShortcut:(NSInteger)keyCode
                  modifiers:(NSInteger)modifiers
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Unregister a specific global shortcut
RCT_EXTERN_METHOD(unregisterGlobalShortcut:(NSInteger)keyCode
                  modifiers:(NSInteger)modifiers
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Unregister all global shortcuts
RCT_EXTERN_METHOD(unregisterAllGlobalShortcuts:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Required for RCTEventEmitter
RCT_EXTERN_METHOD(supportedEvents)

@end