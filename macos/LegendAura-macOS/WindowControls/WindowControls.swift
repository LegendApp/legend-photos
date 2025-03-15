import Foundation
import AppKit

@objc(WindowControls)
class WindowControls: NSObject {

    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc func hideWindowControls() {
        DispatchQueue.main.async {
            if let window = NSApplication.shared.mainWindow {
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
            if let window = NSApplication.shared.mainWindow {
                // Show the close button
                window.standardWindowButton(.closeButton)?.isHidden = false
                // Show the minimize button
                window.standardWindowButton(.miniaturizeButton)?.isHidden = false
                // Show the zoom button
                window.standardWindowButton(.zoomButton)?.isHidden = false
            }
        }
    }
}