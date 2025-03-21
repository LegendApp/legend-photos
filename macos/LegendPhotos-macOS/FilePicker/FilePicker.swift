import Foundation
import UniformTypeIdentifiers
import React

@objc(FilePicker)
class FilePicker: NSObject {

  @objc func pickFileWithFilenameExtension(_ filenameExtensions: [String], prompt: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      NSApp.activate(ignoringOtherApps: true)
      let panel = NSOpenPanel()

      if !prompt.isEmpty {
        panel.prompt = prompt
      }

      panel.allowsMultipleSelection = false
      panel.canChooseDirectories = true
      panel.canCreateDirectories = true

      if #available(macOS 11.0, *) {
        var allowedTypes = [UTType]()

        for extensionString in filenameExtensions {
          let utTypesFromTag = UTType.types(tag: extensionString, tagClass: .filenameExtension, conformingTo: nil)
          if !utTypesFromTag.isEmpty {
            allowedTypes += utTypesFromTag
          }

          if let utTypeFromFilenameExtension = UTType(filenameExtension: extensionString), !allowedTypes.contains(utTypeFromFilenameExtension) {
            allowedTypes.append(utTypeFromFilenameExtension)
          }
        }

        panel.allowedContentTypes = allowedTypes
      }

      if panel.runModal() == NSApplication.ModalResponse.OK {
        if let url = panel.url {
          resolver(url.path)
        } else {
          resolver(nil)
        }
      } else {
        rejecter("FILE_PICKER_ERROR", "NSModalResponseCancel", nil)
      }
    }
  }

  @objc func pickFolder(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let panel = NSOpenPanel()
      panel.allowsMultipleSelection = false
      panel.canChooseFiles = false
      panel.canChooseDirectories = true
      panel.canCreateDirectories = true

      if panel.runModal() == NSApplication.ModalResponse.OK {
        if let url = panel.url {
          resolver(url.path)
        } else {
          resolver(nil)
        }
      } else {
        rejecter("FILE_PICKER_ERROR", "NSModalResponseCancel", nil)
      }
    }
  }

  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
}