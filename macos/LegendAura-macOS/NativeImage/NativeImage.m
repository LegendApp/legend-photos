#import "NativeImage.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <AppKit/AppKit.h>
#import <objc/runtime.h>

@implementation NativeImageView

- (instancetype)init {
    self = [super init];
    if (self) {
        _imageView = [[NSImageView alloc] init];
        _imageView.imageScaling = NSImageScaleProportionallyUpOrDown;
        _imageView.autoresizingMask = NSViewWidthSizable | NSViewHeightSizable;
        _imageView.wantsLayer = YES;

        [self addSubview:_imageView];
    }
    return self;
}

- (void)layout {
    [super layout];
    _imageView.frame = self.bounds;

    if (_borderRadius > 0) {
        _imageView.layer.cornerRadius = _borderRadius;
        _imageView.layer.masksToBounds = YES;
    } else {
        _imageView.layer.cornerRadius = 0;
    }
}

- (void)setImagePath:(NSString *)imagePath {
    if (_imagePath != imagePath) {
        _imagePath = [imagePath copy];
        [self loadImage];
    }
}

- (void)setBorderRadius:(CGFloat)borderRadius {
    if (_borderRadius != borderRadius) {
        _borderRadius = borderRadius;
        _imageView.layer.cornerRadius = borderRadius;
        _imageView.layer.masksToBounds = YES;
    }
}

- (void)loadImage {
    if (!_imagePath || _imagePath.length == 0) {
        return;
    }

    // Create cached NSImage based on file path
    static NSCache *imageCache;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        imageCache = [[NSCache alloc] init];
        imageCache.countLimit = 100; // Adjust as needed
    });

    NSString *resolvedPath = [_imagePath stringByExpandingTildeInPath];
    NSImage *cachedImage = [imageCache objectForKey:resolvedPath];

    if (cachedImage) {
        // Use cached image
        dispatch_async(dispatch_get_main_queue(), ^{
            self->_imageView.image = cachedImage;
            if (self->_onLoad) {
                NSSize size = cachedImage.size;
                self->_onLoad(@{
                    @"source": @{
                        @"width": @(size.width),
                        @"height": @(size.height),
                        @"path": self->_imagePath
                    }
                });
            }
        });
    } else {
        // Load image from file
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            NSImage *newImage = [[NSImage alloc] initWithContentsOfFile:resolvedPath];

            if (newImage) {
                [imageCache setObject:newImage forKey:resolvedPath];

                dispatch_async(dispatch_get_main_queue(), ^{
                    self->_imageView.image = newImage;
                    if (self->_onLoad) {
                        NSSize size = newImage.size;
                        self->_onLoad(@{
                            @"source": @{
                                @"width": @(size.width),
                                @"height": @(size.height),
                                @"path": self->_imagePath
                            }
                        });
                    }
                });
            } else {
                dispatch_async(dispatch_get_main_queue(), ^{
                    if (self->_onError) {
                        self->_onError(@{
                            @"error": @{
                                @"message": @"Failed to load image",
                                @"path": self->_imagePath
                            }
                        });
                    }
                });
            }
        });
    }
}

@end

@implementation NativeImageManager

RCT_EXPORT_MODULE(NativeImage)

- (NSView *)view {
    return [[NativeImageView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(imagePath, NSString)
RCT_EXPORT_VIEW_PROPERTY(onLoad, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onError, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(borderRadius, CGFloat)

@end