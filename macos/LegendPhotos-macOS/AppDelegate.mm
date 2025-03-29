#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTBridge.h>
#import <React/RCTLinkingManager.h>
#import <React/RCTCxxBridgeDelegate.h>

// Forward declaration for notification
@interface NSNotificationCenter (MenuEvents)
- (void)postNotificationName:(NSString *)name object:(id)object userInfo:(NSDictionary *)userInfo;
@end

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)notification
{
  self.moduleName = @"LegendPhotos";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  // Force the app to use dark appearance
  [NSApp setAppearance:[NSAppearance appearanceNamed:NSAppearanceNameDarkAqua]];

  /**
   *  Use a notification observer to modify the window properties once the window has been created.
   */
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(windowDidBecomeKey:)
                                               name:NSWindowDidBecomeKeyNotification
                                             object:nil];

  // Setup menu item connections after application has finished launching
  [self performSelector:@selector(setupMenuConnections) withObject:nil afterDelay:0.5];

  return [super applicationDidFinishLaunching:notification];
}

// Setup menu item connections
- (void)setupMenuConnections {
  // Safely connect preferences menu item
  NSMenu *mainMenu = [NSApp mainMenu];
  if (mainMenu && [mainMenu numberOfItems] > 0) {
    NSMenuItem *appMenuItem = [mainMenu itemAtIndex:0];
    if (appMenuItem) {
      NSMenu *appMenu = [appMenuItem submenu];
      if (appMenu) {
        NSMenuItem *preferencesMenuItem = [appMenu itemWithTitle:@"Preferences…"];
        if (preferencesMenuItem) {
          [preferencesMenuItem setTarget:self];
          [preferencesMenuItem setAction:@selector(showPreferences:)];
        }
      }
    }
  }
}

// Add a method to handle the Preferences menu item
- (void)showPreferences:(id)sender {
  // Post a notification that our MenuEvents module can listen for
  [[NSNotificationCenter defaultCenter] postNotificationName:@"ShowPreferencesMenuClicked"
                                                      object:nil
                                                    userInfo:nil];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
#ifdef RN_FABRIC_ENABLED
  return true;
#else
  return false;
#endif
}

- (BOOL)newArchEnabled {
    return false;
}

/**
 * Ensures that the window is fully initialized and has become the key window before you attempt to modify its properties
 */
- (void)windowDidBecomeKey:(NSNotification *)notification
{
  NSWindow *window = notification.object;

  // Set initial window size
  [window setContentSize:NSMakeSize(800, 600)]; // Width: 800, Height: 600

  [window setTitleVisibility:NSWindowTitleHidden];
  [window setTitlebarAppearsTransparent:YES];
  [window setStyleMask:[window styleMask] | NSWindowStyleMaskFullSizeContentView];

  // Set the window delegate to handle close events
  [window setDelegate:self];

  // Hide the close button
//   [[window standardWindowButton:NSWindowCloseButton] setHidden:YES];
  // Hide the minimize button
//   [[window standardWindowButton:NSWindowMiniaturizeButton] setHidden:YES];
  // Hide the maximize button
//   [[window standardWindowButton:NSWindowZoomButton] setHidden:YES];

  // Remove the observer
  [[NSNotificationCenter defaultCenter] removeObserver:self
                                                  name:NSWindowDidBecomeKeyNotification
                                                object:nil];
}

/**
 * This method is called when the dock icon is clicked or when the application is reactivated.
 * It ensures the window is made visible and brought to the front.
 */
- (BOOL)applicationShouldHandleReopen:(NSApplication *)sender hasVisibleWindows:(BOOL)flag
{
  if (!flag) {
    // No visible windows - reactivate the main window
    for (NSWindow *window in [NSApplication sharedApplication].windows) {
      [window makeKeyAndOrderFront:self];
    }
  }
  return YES;
}

/**
 * This method is called when the user attempts to close the window.
 * Instead of closing it completely, we'll just hide it so it can be reopened.
 */
- (BOOL)windowShouldClose:(NSWindow *)sender
{
  // Hide the window instead of closing it
  [sender orderOut:self];
  return NO;
}

@end
