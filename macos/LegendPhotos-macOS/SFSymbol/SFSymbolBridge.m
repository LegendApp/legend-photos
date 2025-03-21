#import <React/RCTViewManager.h>
#import <React/RCTConvert.h>
#import <AppKit/AppKit.h>

// Forward declare the SFSymbolView class
@interface SFSymbolView : NSView
@property (nonatomic, strong) NSColor *color;
@end

@interface RCT_EXTERN_MODULE(RNSFSymbol, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(name, NSString)
RCT_EXPORT_VIEW_PROPERTY(scale, NSString)
RCT_EXPORT_VIEW_PROPERTY(size, NSNumber)

// Custom property for color handling
RCT_CUSTOM_VIEW_PROPERTY(color, NSColor, SFSymbolView)
{
    if (json) {
        // For macOS, we need to handle color conversion manually
        NSString *hexString = nil;

        // Check if it's a string (hex color)
        if ([json isKindOfClass:[NSString class]]) {
            hexString = json;

            // Parse hex color
            hexString = [hexString stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
            unsigned int colorCode = 0;

            // Handle different hex formats (#RGB, #RRGGBB)
            if ([hexString hasPrefix:@"#"]) {
                NSString *colorStr = [hexString substringFromIndex:1];

                // Scan the hex value
                NSScanner *scanner = [NSScanner scannerWithString:colorStr];
                [scanner scanHexInt:&colorCode];

                // Convert to RGB components
                CGFloat red, green, blue;

                if (colorStr.length == 3) {
                    // #RGB format
                    red = ((colorCode >> 8) & 0xF) / 15.0;
                    green = ((colorCode >> 4) & 0xF) / 15.0;
                    blue = (colorCode & 0xF) / 15.0;
                } else {
                    // #RRGGBB format
                    red = ((colorCode >> 16) & 0xFF) / 255.0;
                    green = ((colorCode >> 8) & 0xFF) / 255.0;
                    blue = (colorCode & 0xFF) / 255.0;
                }

                view.color = [NSColor colorWithSRGBRed:red green:green blue:blue alpha:1.0];
            }
        } else if ([json isKindOfClass:[NSDictionary class]]) {
            // Handle dictionary format (e.g., {r: 255, g: 0, b: 0})
            NSDictionary *colorDict = (NSDictionary *)json;
            NSNumber *r = colorDict[@"r"] ?: @0;
            NSNumber *g = colorDict[@"g"] ?: @0;
            NSNumber *b = colorDict[@"b"] ?: @0;
            NSNumber *a = colorDict[@"a"] ?: @1;

            CGFloat red = [r floatValue] / 255.0;
            CGFloat green = [g floatValue] / 255.0;
            CGFloat blue = [b floatValue] / 255.0;
            CGFloat alpha = [a floatValue];

            view.color = [NSColor colorWithSRGBRed:red green:green blue:blue alpha:alpha];
        }
    } else {
        view.color = nil;
    }
}

@end