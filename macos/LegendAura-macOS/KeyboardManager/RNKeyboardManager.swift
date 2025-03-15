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

    // Register for global keyboard events
    @objc func registerForGlobalKeyboardEvents(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        KeyboardManager.shared.registerForGlobalEvents { [weak self] keyCode, modifiers in
            guard let self = self, self.hasListeners else { return }

            // Send global key event to JavaScript
            self.sendEvent(withName: "onGlobalKeyPress", body: [
                "keyCode": keyCode,
                "modifiers": modifiers
            ])
        }

        resolve(true)
    }

    // Register a specific global shortcut
    @objc func registerGlobalShortcut(_ keyCode: NSInteger, modifiers: NSInteger, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        let success = KeyboardManager.shared.registerGlobalShortcut(keyCode: Int(keyCode), modifiers: Int(modifiers))

        if success {
            resolve(true)
        } else {
            reject("registration_failed", "Failed to register global keyboard shortcut", nil)
        }
    }

    // Unregister a specific global shortcut
    @objc func unregisterGlobalShortcut(_ keyCode: NSInteger, modifiers: NSInteger, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        KeyboardManager.shared.unregisterGlobalShortcut(keyCode: Int(keyCode), modifiers: Int(modifiers))
        resolve(true)
    }

    // Unregister all global shortcuts
    @objc func unregisterAllGlobalShortcuts(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        KeyboardManager.shared.unregisterAllGlobalShortcuts()
        resolve(true)
    }

    // Required for RCTBridgeModule
    @objc override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}

