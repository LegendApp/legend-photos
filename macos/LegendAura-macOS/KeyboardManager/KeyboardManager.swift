import Foundation
import AppKit
import Carbon

// Enum to define keyboard shortcut names
@objc(KeyboardShortcutName)
enum KeyboardShortcutName: Int, CaseIterable {
    case nextPhoto
    case previousPhoto
    case deletePhoto
    case toggleFullscreen

    var identifier: String {
        switch self {
        case .nextPhoto: return "nextPhoto"
        case .previousPhoto: return "previousPhoto"
        case .deletePhoto: return "deletePhoto"
        case .toggleFullscreen: return "toggleFullscreen"
        }
    }
}

// Class to manage keyboard shortcuts
@objc(KeyboardManager)
class KeyboardManager: NSObject {

    // Callback type for keyboard events
    typealias KeyboardEventCallback = (_ keyCode: Int, _ modifiers: Int) -> Void

    // Singleton instance
    @objc static let shared = KeyboardManager()

    // Event monitor for local keyboard events
    private var localEventMonitor: Any?

    // Event handler for global keyboard shortcuts
    private var eventHandlerRef: EventHandlerRef?
    private var eventHandlerInstalled = false

    // Registered global shortcuts
    private var registeredShortcuts: [UInt32: EventHotKeyRef] = [:]

    // Callbacks
    private var localKeyDownCallback: KeyboardEventCallback?
    private var localKeyUpCallback: KeyboardEventCallback?
    private var globalKeyCallback: KeyboardEventCallback?

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
        unregisterAllGlobalShortcuts()
        NotificationCenter.default.removeObserver(self)
    }

    @objc func applicationWillTerminate() {
        stopMonitoring()
        unregisterAllGlobalShortcuts()
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

            // Call the appropriate callback based on event type
            if event.type == .keyDown {
                self.localKeyDownCallback?(keyCode, modifiers)
            } else if event.type == .keyUp {
                self.localKeyUpCallback?(keyCode, modifiers)
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

    // MARK: - Global Keyboard Shortcuts

    // Register for global keyboard events
    @objc func registerForGlobalEvents(callback: @escaping KeyboardEventCallback) {
        self.globalKeyCallback = callback
        installEventHandler()
    }

    // Register a specific global shortcut
    @objc func registerGlobalShortcut(keyCode: Int, modifiers: Int) -> Bool {
        let shortcutID = generateShortcutID(keyCode: UInt32(keyCode), modifiers: UInt32(modifiers))

        // Check if already registered
        if registeredShortcuts[shortcutID] != nil {
            return true
        }

        var eventHotKey: EventHotKeyRef?

        // Create a unique ID for this shortcut
        let hotKeyID = EventHotKeyID(
            signature: OSType(bitPattern: 0x4C414B4D), // 'LAKM'
            id: shortcutID
        )

        // Register the hot key with the system
        let status = RegisterEventHotKey(
            UInt32(keyCode),
            UInt32(modifiers),
            hotKeyID,
            GetEventDispatcherTarget(),
            0,
            &eventHotKey
        )

        guard status == noErr, let eventHotKey = eventHotKey else {
            print("Failed to register global keyboard shortcut: \(keyCode), \(modifiers)")
            return false
        }

        // Store the event hot key
        registeredShortcuts[shortcutID] = eventHotKey

        // Install the event handler if not already installed
        installEventHandler()

        return true
    }

    // Unregister a specific global shortcut
    @objc func unregisterGlobalShortcut(keyCode: Int, modifiers: Int) {
        let shortcutID = generateShortcutID(keyCode: UInt32(keyCode), modifiers: UInt32(modifiers))

        if let hotKeyRef = registeredShortcuts[shortcutID] {
            UnregisterEventHotKey(hotKeyRef)
            registeredShortcuts.removeValue(forKey: shortcutID)
        }
    }

    // Unregister all global shortcuts
    @objc func unregisterAllGlobalShortcuts() {
        for (_, hotKeyRef) in registeredShortcuts {
            UnregisterEventHotKey(hotKeyRef)
        }
        registeredShortcuts.removeAll()
    }

    // MARK: - Private Methods

    private func generateShortcutID(keyCode: UInt32, modifiers: UInt32) -> UInt32 {
        // Create a unique ID by combining keyCode and modifiers
        return (keyCode << 16) | (modifiers & 0xFFFF)
    }

    private func installEventHandler() {
        if eventHandlerInstalled { return }

        // Define the event type we want to listen for
        var eventType = EventTypeSpec(
            eventClass: OSType(kEventClassKeyboard),
            eventKind: OSType(kEventHotKeyPressed)
        )

        // Install the event handler
        let status = InstallEventHandler(
            GetEventDispatcherTarget(),
            { (_, event, userData) -> OSStatus in
                guard let userData = userData else { return OSStatus(eventNotHandledErr) }
                let manager = Unmanaged<KeyboardManager>.fromOpaque(userData).takeUnretainedValue()
                return manager.handleHotKeyEvent(event)
            },
            1,
            &eventType,
            Unmanaged.passUnretained(self).toOpaque(),
            &eventHandlerRef
        )

        if status == noErr {
            eventHandlerInstalled = true
        } else {
            print("Failed to install event handler")
        }
    }

    private func handleHotKeyEvent(_ event: EventRef?) -> OSStatus {
        guard let event = event else { return OSStatus(eventNotHandledErr) }

        var hotKeyID = EventHotKeyID()
        let status = GetEventParameter(
            event,
            EventParamName(kEventParamDirectObject),
            EventParamType(typeEventHotKeyID),
            nil,
            MemoryLayout<EventHotKeyID>.size,
            nil,
            &hotKeyID
        )

        guard status == noErr else { return status }

        // Extract keyCode and modifiers from the shortcut ID
        let shortcutID = hotKeyID.id
        let keyCode = Int(shortcutID >> 16)
        let modifiers = Int(shortcutID & 0xFFFF)

        // Execute the handler on the main thread
        if let callback = globalKeyCallback {
            DispatchQueue.main.async {
                callback(keyCode, modifiers)
            }
            return noErr
        }

        return OSStatus(eventNotHandledErr)
    }
}

// Helper class to store shortcut information
class KeyboardShortcut {
    let keyCode: Int
    let modifiers: Int
    var eventHotKey: EventHotKeyRef?

    init(key: Int, modifiers: Int) {
        self.keyCode = key
        self.modifiers = modifiers
    }
}