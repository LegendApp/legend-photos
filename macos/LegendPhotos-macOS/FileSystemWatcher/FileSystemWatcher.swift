import Foundation
import AppKit
import React

@objc(FileSystemWatcher)
class FileSystemWatcher: RCTEventEmitter {
    private var hasListeners = false
    private var watchedDirectories: [String] = []
    private var watcherDescriptors: [String: DispatchSourceFileSystemObject] = [:]
    private var allDirectoryPaths = Set<String>()
    private var directoryContents: [String: Set<String>] = [:] // Directory path -> set of files
    private var processingEvents = false
    private var eventsQueue = [(path: String, type: String, filePath: String?)]()

    override init() {
        super.init()
    }

    @objc override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc override func supportedEvents() -> [String]? {
        return ["onDirectoryChanged"]
    }

    @objc override func startObserving() {
        hasListeners = true
        // Start watching already set directories
        if !watchedDirectories.isEmpty {
            startWatching(directories: watchedDirectories)
        }
    }

    @objc override func stopObserving() {
        hasListeners = false
        // Clean up file descriptor watchers
        stopWatching()
    }

    @objc func setWatchedDirectories(_ directories: [String]) {
        // Stop watching the old directories
        stopWatching()

        // Update the list of directories to watch
        watchedDirectories = directories

        // Reset directory contents cache
        allDirectoryPaths.removeAll()
        directoryContents.removeAll()
        eventsQueue.removeAll()

        // If we have listeners, start watching the new directories
        if hasListeners {
            startWatching(directories: watchedDirectories)
        }
    }

    private func startWatching(directories: [String]) {
        let fileManager = FileManager.default

        // Function to recursively find all directories
        func findAllDirectories(in rootPath: String) -> [String] {
            var dirPaths = [rootPath]

            do {
                let contents = try fileManager.contentsOfDirectory(atPath: rootPath)
                for item in contents {
                    let itemPath = (rootPath as NSString).appendingPathComponent(item)

                    var isDir: ObjCBool = false
                    if fileManager.fileExists(atPath: itemPath, isDirectory: &isDir), isDir.boolValue {
                        // Add this directory and all its subdirectories
                        dirPaths.append(contentsOf: findAllDirectories(in: itemPath))
                    }
                }
            } catch {
                print("Error finding subdirectories in \(rootPath): \(error)")
            }

            return dirPaths
        }

        // For each root directory, set up watchers for all subdirectories
        for directory in directories {
            let allDirs = findAllDirectories(in: directory)
            for dir in allDirs {
                setupWatcherForSingleDirectory(dir)
                // Keep track of all directories being watched
                allDirectoryPaths.insert(dir)
                // Store initial directory contents
                indexDirectoryContents(dir)
            }
        }
    }

    private func indexDirectoryContents(_ directory: String) {
        let fileManager = FileManager.default
        var files = Set<String>()

        do {
            let contents = try fileManager.contentsOfDirectory(atPath: directory)
            for item in contents {
                let fullPath = (directory as NSString).appendingPathComponent(item)
                files.insert(fullPath)
            }
            directoryContents[directory] = files
        } catch {
            print("Error indexing directory \(directory): \(error)")
            directoryContents[directory] = Set<String>()
        }
    }

    private func setupWatcherForSingleDirectory(_ directory: String) {
        // Create a file descriptor for the directory
        let fileURL = URL(fileURLWithPath: directory)
        let fd = open(fileURL.path, O_EVTONLY)

        if fd < 0 {
            print("Error opening directory for watching: \(directory)")
            return
        }

        // Create a dispatch source to monitor the directory
        let source = DispatchSource.makeFileSystemObjectSource(
            fileDescriptor: fd,
            eventMask: [.write, .rename, .delete], // Files added, removed, or renamed
            queue: DispatchQueue.main
        )

        // Set up the event handler
        source.setEventHandler { [weak self] in
            self?.directoryDidChange(path: directory)
        }

        // Set up a cancellation handler to close the file descriptor
        source.setCancelHandler {
            close(fd)
        }

        // Start monitoring
        source.resume()

        // Store the watcher for later cleanup
        watcherDescriptors[directory] = source
    }

    private func stopWatching() {
        // Cancel all directory watchers
        for (_, source) in watcherDescriptors {
            source.cancel()
        }

        // Clear the dictionary
        watcherDescriptors.removeAll()
    }

    private func directoryDidChange(path: String) {
        if !hasListeners {
            return
        }

        let fileManager = FileManager.default

        // Check what has changed in this specific directory (not recursively)
        do {
            // Get the previous contents
            let previousContents = directoryContents[path] ?? Set<String>()

            // Get current contents
            let contents = try fileManager.contentsOfDirectory(atPath: path)
            var currentContents = Set<String>()

            for item in contents {
                let itemPath = (path as NSString).appendingPathComponent(item)
                currentContents.insert(itemPath)

                var isDir: ObjCBool = false
                if fileManager.fileExists(atPath: itemPath, isDirectory: &isDir), isDir.boolValue {
                    // If this is a new directory we haven't seen before, set up a watcher
                    if !allDirectoryPaths.contains(itemPath) {
                        setupWatcherForSingleDirectory(itemPath)
                        allDirectoryPaths.insert(itemPath)
                        // Index contents of the new directory
                        indexDirectoryContents(itemPath)
                    }
                }
            }

            // Detect which files were added or removed
            let addedFiles = currentContents.subtracting(previousContents)
            let removedFiles = previousContents.subtracting(currentContents)

            // Update the cached contents
            directoryContents[path] = currentContents

            // Queue events for each added file
            for addedFile in addedFiles {
                queueEvent(path: path, type: "add", filePath: addedFile)
            }

            // Queue events for each removed file
            for removedFile in removedFiles {
                queueEvent(path: path, type: "delete", filePath: removedFile)
            }

            // If no specific files were added/removed but the directory changed,
            // it might be a file modification
            if addedFiles.isEmpty && removedFiles.isEmpty {
                queueEvent(path: path, type: "change", filePath: nil)
            }

            // Process events with debouncing
            processQueuedEvents()

        } catch {
            // Directory might have been deleted
            if watcherDescriptors[path] != nil {
                watcherDescriptors[path]?.cancel()
                watcherDescriptors.removeValue(forKey: path)
                allDirectoryPaths.remove(path)
                directoryContents.removeValue(forKey: path)

                // Queue a deletion event for the directory
                queueEvent(path: path, type: "delete", filePath: nil)
                processQueuedEvents()
            }
        }
    }

    private func queueEvent(path: String, type: String, filePath: String?) {
        // Add event to queue
        eventsQueue.append((path: path, type: type, filePath: filePath))
    }

    private func processQueuedEvents() {
        // If already processing, just return
        if processingEvents {
            return
        }

        processingEvents = true

        // Process events with a slight delay for debouncing
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) { [weak self] in
            guard let self = self else { return }

            // Group by unique file paths to avoid duplicates
            var uniqueEvents = [String: (type: String, dirPath: String)]() // [filePath: (type, dirPath)]

            for event in self.eventsQueue {
                let eventKey = event.filePath ?? event.path // Use file path or directory path as key

                // For now we only preserve the last event for each path
                uniqueEvents[eventKey] = (type: event.type, dirPath: event.path)
            }

            // Emit each unique event
            for (filePath, details) in uniqueEvents {
                self.emitChange(path: details.dirPath, filePath: filePath, type: details.type)
            }

            // Clear the queue
            self.eventsQueue.removeAll()
            self.processingEvents = false
        }
    }

    private func emitChange(path: String, filePath: String, type: String) {
        if hasListeners {
            DispatchQueue.main.async {
                self.sendEvent(withName: "onDirectoryChanged", body: [
                    "path": path,
                    "filePath": filePath,
                    "type": type
                ])
            }
        }
    }

    @objc func isWatchingDirectory(_ directory: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(allDirectoryPaths.contains(directory))
    }
}