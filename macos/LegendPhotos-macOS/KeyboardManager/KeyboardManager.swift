import Foundation
import AppKit
import Carbon

// Class to manage keyboard shortcuts
@objc(KeyboardManager)
class KeyboardManager: NSObject {

    // Callback type for keyboard events
    typealias KeyboardEventCallback = (_ keyCode: Int, _ modifiers: Int) -> Bool

    // Singleton instance
    @objc static let shared = KeyboardManager()

    // Event monitor for local keyboard events
    private var localEventMonitor: Any?

    // Callbacks
    private var localKeyDownCallback: KeyboardEventCallback?
    private var localKeyUpCallback: KeyboardEventCallback?

    private override init() {
        super.init()

        // Register for app termination to clean up
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(applicationWillTerminate),
            name: NSApplication.willTerminateNotification,
            object: nil
        )
    }

    deinit {
        stopMonitoring()
        NotificationCenter.default.removeObserver(self)
    }

    @objc func applicationWillTerminate() {
        stopMonitoring()
    }

    // MARK: - Local Keyboard Monitoring

    // Start monitoring local keyboard events (when app is in focus)
    @objc func startMonitoring(keyDownCallback: KeyboardEventCallback? = nil, keyUpCallback: KeyboardEventCallback? = nil) {
        // Store callbacks
        self.localKeyDownCallback = keyDownCallback
        self.localKeyUpCallback = keyUpCallback

        // Stop any existing monitors
        stopMonitoring()

        // Create a local event monitor for keyDown events
        localEventMonitor = NSEvent.addLocalMonitorForEvents(matching: [.keyDown, .keyUp]) { [weak self] event in
            guard let self = self else { return event }

            let keyCode = Int(event.keyCode)
            let modifiers = Int(event.modifierFlags.rawValue)

            // Call the appropriate callback based on event type and check if handled
            if event.type == .keyDown {
                if let handled = self.localKeyDownCallback?(keyCode, modifiers), handled {
                    // Return nil to indicate the event was handled and should not propagate
                    return nil
                }
            } else if event.type == .keyUp {
                if let handled = self.localKeyUpCallback?(keyCode, modifiers), handled {
                    // Return nil to indicate the event was handled and should not propagate
                    return nil
                }
            }

            // Return the event to continue its normal processing
            return event
        }
    }

    // Stop monitoring local keyboard events
    @objc func stopMonitoring() {
        if let monitor = localEventMonitor {
            NSEvent.removeMonitor(monitor)
            localEventMonitor = nil
        }
    }
}
