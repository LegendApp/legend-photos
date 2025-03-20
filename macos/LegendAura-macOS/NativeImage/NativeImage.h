#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTViewManager.h>
#import <AppKit/AppKit.h>

@interface NativeImageManager : RCTViewManager
@end

@interface NativeImageView : NSView
@property (nonatomic, copy) NSString *imagePath;
@property (nonatomic, strong) NSImageView *imageView;
@property (nonatomic, copy) RCTDirectEventBlock onLoad;
@property (nonatomic, copy) RCTDirectEventBlock onError;
@property (nonatomic, assign) BOOL resizeMode;
@property (nonatomic, assign) CGFloat borderRadius;
@end