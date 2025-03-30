#import "MenuEvents.h"

@implementation MenuEvents {
  BOOL hasListeners;
}

RCT_EXPORT_MODULE();

- (instancetype)init {
  self = [super init];
  if (self) {
    // Add generic menu handler
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(handleMenuCommand:)
                                                 name:@"MenuCommandTriggered"
                                               object:nil];
  }
  return self;
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

// Handle generic menu commands
- (void)handleMenuCommand:(NSNotification *)notification {
  if (hasListeners) {
    NSString *commandId = notification.userInfo[@"commandId"];
    if (commandId) {
      [self sendEventWithName:@"onMenuCommand" body:@{@"commandId": commandId}];
    }
  }
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onMenuCommand"];
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