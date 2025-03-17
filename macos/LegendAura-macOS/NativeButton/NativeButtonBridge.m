#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNNativeButton, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(bezelStyle, NSString)
RCT_EXPORT_VIEW_PROPERTY(controlSize, NSString)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)

@end