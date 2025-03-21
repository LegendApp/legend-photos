#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNSegmentedControl, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(segments, NSArray)
RCT_EXPORT_VIEW_PROPERTY(selectedSegmentIndex, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(size, NSString)

@end