import Foundation
import AppKit
import React

@objc(ColorPicker)
class ColorPicker: NSObject {

  @objc func showColorPicker(_ initialColor: NSString, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let colorPanel = NSColorPanel.shared

      // Parse initial color from hex
      if let hexColor = initialColor as String? {
        // Convert hex to NSColor
        let color = self.colorFromHexString(hexColor)
        colorPanel.color = color
      }

      colorPanel.setTarget(self)
      colorPanel.setAction(#selector(self.colorChanged(_:)))

      // Store resolver and rejecter for later use
      self.currentResolver = resolver
      self.currentRejecter = rejecter

      // Show the color panel
      colorPanel.orderFront(nil)
      NSApp.activate(ignoringOtherApps: true)

      // Setup window close notification
      NotificationCenter.default.addObserver(
        self,
        selector: #selector(self.colorPanelClosed(_:)),
        name: NSWindow.willCloseNotification,
        object: colorPanel
      )
    }
  }

  private var currentResolver: RCTPromiseResolveBlock?
  private var currentRejecter: RCTPromiseRejectBlock?
  private var lastSelectedColor: String?

  @objc func colorChanged(_ sender: NSColorPanel) {
    let color = sender.color
    lastSelectedColor = hexStringFromColor(color)
  }

  @objc func colorPanelClosed(_ notification: Notification) {
    // Remove observer to prevent memory leaks
    NotificationCenter.default.removeObserver(
      self,
      name: NSWindow.willCloseNotification,
      object: NSColorPanel.shared
    )

    // Resolve with the last selected color or reject if no color was selected
    if let hexColor = lastSelectedColor, let resolver = currentResolver {
      resolver(hexColor)
    } else if let rejecter = currentRejecter {
      rejecter("COLOR_PICKER_CANCELLED", "Color picker was cancelled", nil)
    }

    // Clear references
    currentResolver = nil
    currentRejecter = nil
    lastSelectedColor = nil
  }

  // Helper: Convert hex string to NSColor
  private func colorFromHexString(_ hexString: String) -> NSColor {
    var hexSanitized = hexString.trimmingCharacters(in: .whitespacesAndNewlines)
    hexSanitized = hexSanitized.replacingOccurrences(of: "#", with: "")

    var rgb: UInt64 = 0

    Scanner(string: hexSanitized).scanHexInt64(&rgb)

    let r = CGFloat((rgb & 0xFF0000) >> 16) / 255.0
    let g = CGFloat((rgb & 0x00FF00) >> 8) / 255.0
    let b = CGFloat(rgb & 0x0000FF) / 255.0

    return NSColor(calibratedRed: r, green: g, blue: b, alpha: 1.0)
  }

  // Helper: Convert NSColor to hex string
  private func hexStringFromColor(_ color: NSColor) -> String {
    let colorSpace = NSColorSpace.sRGB
    let convertedColor = color.usingColorSpace(colorSpace) ?? color

    let r = Int(convertedColor.redComponent * 255.0)
    let g = Int(convertedColor.greenComponent * 255.0)
    let b = Int(convertedColor.blueComponent * 255.0)

    return String(format: "#%02X%02X%02X", r, g, b)
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
}