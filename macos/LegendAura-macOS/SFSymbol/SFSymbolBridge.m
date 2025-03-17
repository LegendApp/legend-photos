#import <React/RCTViewManager.h>
#import <React/RCTConvert.h>
#import <AppKit/AppKit.h>

@interface SFSymbolView : NSView
@property (nonatomic, strong) NSColor *color;
@end

@interface RCT_EXTERN_MODULE(RNSFSymbol, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(name, NSString)
RCT_EXPORT_VIEW_PROPERTY(weight, NSString)
RCT_EXPORT_VIEW_PROPERTY(scale, NSString)
RCT_EXPORT_VIEW_PROPERTY(size, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(multicolor, BOOL)
RCT_CUSTOM_VIEW_PROPERTY(color, NSColor, SFSymbolView)
{
    if (json) {
        // Convert the color from React Native format to NSColor
        NSColor *color = nil;

        // Check if it's a string (hex color)
        if ([json isKindOfClass:[NSString class]]) {
            // Parse hex color
            NSString *hexString = [json stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
            unsigned int colorCode = 0;
            if (hexString.length > 0 && [[NSScanner scannerWithString:[hexString substringFromIndex:1]] scanHexInt:&colorCode]) {
                float red = ((colorCode >> 16) & 0xFF) / 255.0;
                float green = ((colorCode >> 8) & 0xFF) / 255.0;
                float blue = (colorCode & 0xFF) / 255.0;
                color = [NSColor colorWithSRGBRed:red green:green blue:blue alpha:1.0];
            }
        }

        if (color) {
            view.color = color;
        }
    } else {
        view.color = nil;
    }
}

@end