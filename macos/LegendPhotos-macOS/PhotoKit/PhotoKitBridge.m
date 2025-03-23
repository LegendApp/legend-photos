#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PhotoKit, NSObject)

RCT_EXTERN_METHOD(requestPermissions:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getPermissionStatus:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getAlbums:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getPhotosInAlbum:(NSString *)albumIdentifier
                  limit:(NSInteger)limit
                  offset:(NSInteger)offset
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getPhotoAtIndex:(NSString *)albumIdentifier
                  index:(NSInteger)index
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Export the requiresMainQueueSetup method to ensure proper initialization
RCT_EXTERN_METHOD(requiresMainQueueSetup)

@end