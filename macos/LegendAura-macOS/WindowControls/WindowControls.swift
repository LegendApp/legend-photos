import Foundation
import AppKit
import React

@objc(WindowControls)
class WindowControls: RCTEventEmitter {
    private var hasListeners = false

    override init() {
        super.init()
    }

    @objc override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc override func supportedEvents() -> [String]? {
        return ["fullscreenChange"]
    }

    @objc override func startObserving() {
        hasListeners = true
        // Check and emit initial fullscreen status
        checkAndEmitFullscreenStatus()

        // Set up notifications for fullscreen changes
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(windowDidResize),
            name: NSWindow.didResizeNotification,
            object: nil
        )

        NotificationCenter.default.addObserver(
            self,
            selector: #selector(windowDidEnterFullScreen),
            name: NSWindow.didEnterFullScreenNotification,
            object: nil
        )

        NotificationCenter.default.addObserver(
            self,
            selector: #selector(windowWillExitFullScreen),
            name: NSWindow.willExitFullScreenNotification,
            object: nil
        )
    }

    @objc override func stopObserving() {
        hasListeners = false
        NotificationCenter.default.removeObserver(self)
    }

    @objc func windowDidResize(_ notification: Notification) {
        checkAndEmitFullscreenStatus()
    }

    @objc func windowDidEnterFullScreen(_ notification: Notification) {
        // Directly emit true for fullscreen since we know it entered fullscreen
        if hasListeners {
            self.sendEvent(withName: "fullscreenChange", body: ["isFullscreen": true])
        }
    }

    @objc func windowWillExitFullScreen(_ notification: Notification) {
        // Directly emit false for fullscreen since we know it exited fullscreen
        if hasListeners {
            self.sendEvent(withName: "fullscreenChange", body: ["isFullscreen": false])
        }
    }

    func checkAndEmitFullscreenStatus() {
        if !hasListeners {
            return
        }

        DispatchQueue.main.async {
            if let window = NSApplication.shared.keyWindow {
                let isFullScreen = window.styleMask.contains(.fullScreen)
                self.sendEvent(withName: "fullscreenChange", body: ["isFullscreen": isFullScreen])
            }
        }
    }

    @objc func hideWindowControls() {
        DispatchQueue.main.async {
            if let window = NSApplication.shared.keyWindow {
                // Hide the close button
                window.standardWindowButton(.closeButton)?.isHidden = true
                // Hide the minimize button
                window.standardWindowButton(.miniaturizeButton)?.isHidden = true
                // Hide the zoom button
                window.standardWindowButton(.zoomButton)?.isHidden = true
            }
        }
    }

    @objc func showWindowControls() {
        DispatchQueue.main.async {
            if let window = NSApplication.shared.keyWindow {
                // Show the close button
                window.standardWindowButton(.closeButton)?.isHidden = false
                // Show the minimize button
                window.standardWindowButton(.miniaturizeButton)?.isHidden = false
                // Show the zoom button
                window.standardWindowButton(.zoomButton)?.isHidden = false
            }
        }
    }

    @objc func isWindowFullScreen(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            if let window = NSApplication.shared.keyWindow {
                let isFullScreen = window.styleMask.contains(.fullScreen)
                resolve(isFullScreen)
            } else {
                resolve(false)
            }
        }
    }
}
