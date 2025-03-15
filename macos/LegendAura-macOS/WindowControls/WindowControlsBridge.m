#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WindowControls, NSObject)

// Method to hide window controls (stoplight buttons)
RCT_EXTERN_METHOD(hideWindowControls)

// Method to show window controls (stoplight buttons)
RCT_EXTERN_METHOD(showWindowControls)

@end