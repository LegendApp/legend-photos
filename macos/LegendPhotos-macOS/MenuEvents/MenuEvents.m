#import "MenuEvents.h"

@implementation MenuEvents {
  BOOL hasListeners;
}

RCT_EXPORT_MODULE();

- (instancetype)init {
  self = [super init];
  if (self) {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(handleShowPreferences:)
                                                 name:@"ShowPreferencesMenuClicked"
                                               object:nil];
  }
  return self;
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

// Handle notification from AppDelegate
- (void)handleShowPreferences:(NSNotification *)notification {
  if (hasListeners) {
    [self sendEventWithName:@"onShowPreferences" body:@{}];
  }
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onShowPreferences"];
}

+ (BOOL)requiresMainQueueSetup {
  return YES; // Change to YES because we need to access UI elements
}

// Will be called when this module's first listener is added.
- (void)startObserving {
  hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
- (void)stopObserving {
  hasListeners = NO;
}

// Add a method that can be called from JavaScript to check if the module is available
RCT_EXPORT_METHOD(isAvailable:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  resolve(@YES);
}

@end