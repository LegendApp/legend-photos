import Foundation
import React

@objc(RNKeyboardManager)
class RNKeyboardManager: RCTEventEmitter {

    private var hasListeners = false
    private var eventHandlers: [String: Bool] = [:]
    private let eventQueue = DispatchQueue(label: "com.legendapp.keyboardevents", attributes: .concurrent)

    override init() {
        super.init()
    }

    // Required for RCTEventEmitter
    @objc override func supportedEvents() -> [String] {
        return [
            "onKeyDown",
            "onKeyUp",
            "keyboardEventResponse"
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

    // Method for JavaScript to respond to key events
    @objc func respondToKeyEvent(_ eventId: String, handled: Bool) {
        // Store the response in a thread-safe way
        eventQueue.async(flags: .barrier) { [weak self] in
            self?.eventHandlers[eventId] = handled
        }
    }

    // Start monitoring local keyboard events
    @objc func startMonitoringKeyboard(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        KeyboardManager.shared.startMonitoring(
            keyDownCallback: { [weak self] keyCode, modifiers in
                guard let self = self, self.hasListeners else { return false }

                // Generate a unique event ID
                let eventId = UUID().uuidString

                // Send keyDown event to JavaScript with the event ID
                self.sendEvent(withName: "onKeyDown", body: [
                    "keyCode": keyCode,
                    "modifiers": modifiers,
                    "eventId": eventId
                ])

                // Wait a short time for JavaScript to respond
                // In a real implementation, this might be more sophisticated
                Thread.sleep(forTimeInterval: 0.01)

                // Check if JavaScript handled the event
                var handled = false
                self.eventQueue.sync {
                    handled = self.eventHandlers[eventId] ?? false
                    // Clean up
                    self.eventHandlers.removeValue(forKey: eventId)
                }

                return handled
            },
            keyUpCallback: { [weak self] keyCode, modifiers in
                guard let self = self, self.hasListeners else { return false }

                // Generate a unique event ID
                let eventId = UUID().uuidString

                // Send keyUp event to JavaScript with the event ID
                self.sendEvent(withName: "onKeyUp", body: [
                    "keyCode": keyCode,
                    "modifiers": modifiers,
                    "eventId": eventId
                ])

                // Wait a short time for JavaScript to respond
                // In a real implementation, this might be more sophisticated
                Thread.sleep(forTimeInterval: 0.01)

                // Check if JavaScript handled the event
                var handled = false
                self.eventQueue.sync {
                    handled = self.eventHandlers[eventId] ?? false
                    // Clean up
                    self.eventHandlers.removeValue(forKey: eventId)
                }

                return handled
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

