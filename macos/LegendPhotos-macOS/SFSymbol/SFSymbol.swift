import Foundation
import AppKit
import React

@objc(RNSFSymbol)
class RNSFSymbol: RCTViewManager {
    override func view() -> NSView! {
        return SFSymbolView()
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}

class SFSymbolView: NSView {
    private let imageView = NSImageView()

    @objc var name: String = "" {
        didSet {
            updateSymbol()
        }
    }

    @objc var color: NSColor? = nil {
        didSet {
            updateSymbol()
        }
    }

    @objc var scale: String = "medium" {
        didSet {
            updateSymbol()
        }
    }

    @objc var size: NSNumber? = nil {
        didSet {
            updateSymbol()
        }
    }

    override init(frame: NSRect) {
        super.init(frame: frame)
        setupView()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupView()
    }

    private func setupView() {
        imageView.translatesAutoresizingMaskIntoConstraints = false
        imageView.imageScaling = .scaleProportionallyUpOrDown

        addSubview(imageView)

        NSLayoutConstraint.activate([
            imageView.topAnchor.constraint(equalTo: topAnchor),
            imageView.leadingAnchor.constraint(equalTo: leadingAnchor),
            imageView.trailingAnchor.constraint(equalTo: trailingAnchor),
            imageView.bottomAnchor.constraint(equalTo: bottomAnchor)
        ])
    }

    private func updateSymbol() {
        guard !name.isEmpty else {
            imageView.image = nil
            return
        }

        // Get the symbol scale
        let symbolScale: NSImage.SymbolScale
        switch scale {
        case "small":
            symbolScale = .small
        case "large":
            symbolScale = .large
        default:
            symbolScale = .medium
        }

        // Create the configuration with just the scale
        let configuration = NSImage.SymbolConfiguration(scale: symbolScale)

        // Try to create the symbol image
        if let symbolImage = NSImage(systemSymbolName: name, accessibilityDescription: nil) {
            // Apply the configuration
            let configuredImage = symbolImage.withSymbolConfiguration(configuration)

            // Apply color if provided
            if let color = color {
                imageView.contentTintColor = color
            }

            imageView.image = configuredImage

            // Set the size if provided
            if let size = size?.doubleValue, size > 0 {
                // For scale to work properly, we need to adjust the image size based on the scale
                var scaleFactor: CGFloat = 1.0
                switch scale {
                case "small":
                    scaleFactor = 0.75
                case "large":
                    scaleFactor = 1.5
                default:
                    scaleFactor = 1.0
                }

                let adjustedSize = CGFloat(size) * scaleFactor
                imageView.frame.size = NSSize(width: adjustedSize, height: adjustedSize)
            }
        } else {
            // Symbol not found - try to log this for debugging
            print("SF Symbol not found: \(name)")
            imageView.image = nil
        }
    }

    override func layout() {
        super.layout()
        updateSymbol()
    }
}