import Foundation
import AppKit
import React

@objc(RNSegmentedControl)
class RNSegmentedControl: RCTViewManager {

    override func view() -> NSView! {
        return SegmentedControlView()
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}

class SegmentedControlView: NSView {
    private let segmentedControl = NSSegmentedControl()

    @objc var segments: [String] = [] {
        didSet {
            updateSegments()
        }
    }

    @objc var selectedSegmentIndex: NSInteger = 0 {
        didSet {
            if segmentedControl.selectedSegment != selectedSegmentIndex {
                segmentedControl.selectedSegment = selectedSegmentIndex
            }
        }
    }

    @objc var onChange: RCTBubblingEventBlock?

    @objc var size: String = "regular" {
        didSet {
            updateControlSize()
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
        segmentedControl.target = self
        segmentedControl.action = #selector(segmentChanged(_:))
        segmentedControl.segmentStyle = .rounded
        segmentedControl.translatesAutoresizingMaskIntoConstraints = false

        // Set appearance to match system style
        if #available(macOS 10.14, *) {
            // Use the system's appearance settings
            segmentedControl.appearance = NSAppearance.current
            segmentedControl.selectedSegmentBezelColor = NSColor.controlAccentColor
        }

        addSubview(segmentedControl)

        NSLayoutConstraint.activate([
            segmentedControl.topAnchor.constraint(equalTo: topAnchor),
            segmentedControl.leadingAnchor.constraint(equalTo: leadingAnchor),
            segmentedControl.trailingAnchor.constraint(equalTo: trailingAnchor),
            segmentedControl.bottomAnchor.constraint(equalTo: bottomAnchor)
        ])

        updateControlSize()
    }

    private func updateSegments() {
        segmentedControl.segmentCount = segments.count

        for (index, label) in segments.enumerated() {
            segmentedControl.setLabel(label, forSegment: index)
            segmentedControl.setWidth(0, forSegment: index) // Auto width
        }

        // Update selected segment if needed
        if segmentedControl.selectedSegment != selectedSegmentIndex && segments.count > 0 {
            segmentedControl.selectedSegment = min(selectedSegmentIndex, segments.count - 1)
        }
    }

    private func updateControlSize() {
        switch size {
        case "mini":
            segmentedControl.controlSize = .mini
        case "small":
            segmentedControl.controlSize = .small
        case "large":
            segmentedControl.controlSize = .large
        default:
            segmentedControl.controlSize = .regular
        }
    }

    @objc private func segmentChanged(_ sender: NSSegmentedControl) {
        // Only trigger the onChange event if the selection actually changed
        if selectedSegmentIndex != sender.selectedSegment {
            selectedSegmentIndex = sender.selectedSegment
            if let onChange = onChange {
                onChange(["selectedSegmentIndex": selectedSegmentIndex])
            }
        }
    }
}