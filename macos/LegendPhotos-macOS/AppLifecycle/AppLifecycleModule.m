#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <AppKit/AppKit.h>

@interface AppLifecycle : RCTEventEmitter <RCTBridgeModule>
@property (nonatomic, assign) BOOL hasListeners;
@property (nonatomic, strong) NSMutableDictionary *eventResponses;
@end

@implementation AppLifecycle

RCT_EXPORT_MODULE();

- (instancetype)init
{
  self = [super init];
  if (self) {
    self.eventResponses = [NSMutableDictionary dictionary];
    self.hasListeners = NO;

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(applicationWillTerminate:)
                                                 name:NSApplicationWillTerminateNotification
                                               object:nil];
  }
  return self;
}

- (void)applicationWillTerminate:(NSNotification *)notification
{
  NSLog(@"App is terminating");

  // Only proceed if we have JS listeners
  if (!self.hasListeners) {
    NSLog(@"No JS listeners for termination event");
    return;
  }

  // Hide the main window to make the app appear to close faster
  NSWindow *mainWindow = [NSApplication sharedApplication].mainWindow;
  [mainWindow orderOut:nil];

  // Generate a unique ID for this termination event
  NSString *eventId = [[NSUUID UUID] UUIDString];

  // Send the event to JS with the ID
  [self sendEventWithName:@"willTerminate" body:@{@"eventId": eventId}];

  // Wait for a limited time for JavaScript to process the event
  NSDate *timeoutDate = [NSDate dateWithTimeIntervalSinceNow:2]; // 2s timeout

  while ([timeoutDate timeIntervalSinceNow] > 0) {
    // Check if we received a response from JS
    if (self.eventResponses[eventId] != nil) {
      NSLog(@"Received ack from JS for termination event");
      [self.eventResponses removeObjectForKey:eventId];
      break;
    }

    // Process events for a short period
    [[NSRunLoop currentRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:0.01]];
  }

  NSLog(@"Termination handling complete");
}

// Method for JavaScript to acknowledge event processing
RCT_EXPORT_METHOD(acknowledgeTermination:(NSString *)eventId) {
  NSLog(@"JS acknowledged termination: %@", eventId);
  self.eventResponses[eventId] = @YES;
}

// Required for RCTEventEmitter
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"willTerminate"];
}

// Called when this module's first listener is added
-(void)startObserving {
  self.hasListeners = YES;
}

// Called when this module's last listener is removed
-(void)stopObserving {
  self.hasListeners = NO;
}

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
