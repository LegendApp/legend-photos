import Foundation
import AppKit
import React

@objc(RNNativeButton)
class RNNativeButton: RCTViewManager {
    override func view() -> NSView! {
        return NativeButtonView()
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}

class NativeButtonView: NSView {
    let button = NSButton(title: "", target: nil, action: nil)

    @objc var title: String = "" {
        didSet {
            button.title = title
        }
    }

    @objc var bezelStyle: String = "rounded" {
        didSet {
            updateBezelStyle()
        }
    }

    @objc var controlSize: String = "regular" {
        didSet {
            updateControlSize()
        }
    }

    @objc var onPress: RCTBubblingEventBlock?

    override init(frame: NSRect) {
        super.init(frame: frame)
        setupButton()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupButton()
    }

    private func setupButton() {
        button.setButtonType(.momentaryPushIn)
        button.bezelStyle = .rounded
        button.target = self
        button.action = #selector(buttonPressed)

        // Add the button to the view
        addSubview(button)

        // Set initial styles
        updateBezelStyle()
        updateControlSize()
    }

    override func layout() {
        super.layout()
        // Make the button fill the view
        button.frame = bounds
    }

    private func updateBezelStyle() {
        switch bezelStyle {
        case "rounded":
            button.bezelStyle = .rounded
        case "regular":
            button.bezelStyle = .regularSquare
        case "textured":
            button.bezelStyle = .texturedRounded
        case "disclosure":
            button.bezelStyle = .disclosure
        default:
            button.bezelStyle = .rounded
        }
    }

    private func updateControlSize() {
        switch controlSize {
        case "mini":
            button.controlSize = .mini
        case "small":
            button.controlSize = .small
        case "large":
            button.controlSize = .large
        default:
            button.controlSize = .regular
        }
    }

    @objc private func buttonPressed() {
        if let onPress = onPress {
            onPress([:])
        }
    }
}