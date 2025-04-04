#import "AutoUpdater.h"
#import <Sparkle/Sparkle.h>

@implementation AutoUpdater {
  SPUStandardUpdaterController *_updateController;
}

RCT_EXPORT_MODULE();

- (instancetype)init {
  self = [super init];
  if (self) {
    _updateController = [[SPUStandardUpdaterController alloc] initWithStartingUpdater:NO updaterDelegate:nil userDriverDelegate:nil];
  }
  return self;
}

RCT_EXPORT_METHOD(checkForUpdates:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    if (self->_updateController.updater.sessionInProgress) {
      reject(@"UPDATE_IN_PROGRESS", @"An update check is already in progress", nil);
      return;
    }
    [self->_updateController startUpdater];
    [self->_updateController.updater checkForUpdates];
    resolve(@(YES));
  });
}

RCT_EXPORT_METHOD(getAutomaticallyChecksForUpdates:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    BOOL checksAutomatically = self->_updateController.updater.automaticallyChecksForUpdates;
    resolve(@(checksAutomatically));
  });
}

RCT_EXPORT_METHOD(setAutomaticallyChecksForUpdates:(BOOL)value resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    if (value) {
        [self->_updateController startUpdater];
    }
    self->_updateController.updater.automaticallyChecksForUpdates = value;
    resolve(@(YES));
  });
}

RCT_EXPORT_METHOD(getUpdateCheckInterval:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSTimeInterval interval = self->_updateController.updater.updateCheckInterval;
    resolve(@(interval));
  });
}

RCT_EXPORT_METHOD(setUpdateCheckInterval:(double)interval resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    self->_updateController.updater.updateCheckInterval = interval;
    resolve(@(YES));
  });
}

RCT_EXPORT_METHOD(checkForUpdatesInBackground:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
  dispatch_async(dispatch_get_main_queue(), ^{
    if (self->_updateController.updater.sessionInProgress) {
      reject(@"UPDATE_IN_PROGRESS", @"An update check is already in progress", nil);
      return;
    }
    [self->_updateController startUpdater];
    [self->_updateController.updater checkForUpdatesInBackground];
    resolve(@(YES));
  });
}

@end
