import Foundation
import React

@objc(RNKeyboardManager)
class RNKeyboardManager: RCTEventEmitter {

    private var hasListeners = false

    override init() {
        super.init()
    }

    // Required for RCTEventEmitter
    @objc override func supportedEvents() -> [String] {
        return [
            "onKeyDown",
            "onKeyUp",
            "onGlobalKeyPress"
        ]
    }

    // Called when this module's first listener is added
    @objc override func startObserving() {
        hasListeners = true
    }

    // Called when this module's last listener is removed
    @objc override func stopObserving() {
        hasListeners = false

        // Stop monitoring when no listeners
        KeyboardManager.shared.stopMonitoring()
    }

    // Start monitoring local keyboard events
    @objc func startMonitoringKeyboard(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        KeyboardManager.shared.startMonitoring(
            keyDownCallback: { [weak self] keyCode, modifiers in
                guard let self = self, self.hasListeners else { return }

                // Send keyDown event to JavaScript
                self.sendEvent(withName: "onKeyDown", body: [
                    "keyCode": keyCode,
                    "modifiers": modifiers
                ])
            },
            keyUpCallback: { [weak self] keyCode, modifiers in
                guard let self = self, self.hasListeners else { return }

                // Send keyUp event to JavaScript
                self.sendEvent(withName: "onKeyUp", body: [
                    "keyCode": keyCode,
                    "modifiers": modifiers
                ])
            }
        )

        resolve(true)
    }

    // Stop monitoring local keyboard events
    @objc func stopMonitoringKeyboard(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        KeyboardManager.shared.stopMonitoring()
        resolve(true)
    }

    // Required for RCTBridgeModule
    @objc override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}

