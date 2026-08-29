import AppKit
import Foundation
import UniformTypeIdentifiers

struct LocalKoshResource: Codable, Identifiable, Equatable {
    let id: UUID
    let sourceID: String
    let kind: ResourceKind
    var title: String
    var context: String
    var body: String
    let createdAt: Date
    var updatedAt: Date
}

@MainActor
final class KoshStore {
    private(set) var localResources: [LocalKoshResource] = []
    var errorMessage: String?

    private let fileManager = FileManager.default

    init() {
        load()
    }

    func makeLocalVersion(from resource: KoshResource) -> LocalKoshResource {
        let now = Date()
        let local = LocalKoshResource(
            id: UUID(),
            sourceID: resource.id,
            kind: resource.kind,
            title: "My version of \(resource.title)",
            context: "",
            body: resource.body,
            createdAt: now,
            updatedAt: now
        )
        localResources.insert(local, at: 0)
        persist()
        return local
    }

    func update(_ resource: LocalKoshResource) {
        guard let index = localResources.firstIndex(where: { $0.id == resource.id }) else { return }
        var updated = resource
        updated.updatedAt = Date()
        localResources[index] = updated
        persist()
    }

    func delete(_ resource: LocalKoshResource) {
        localResources.removeAll { $0.id == resource.id }
        persist()
    }

    func export(_ resource: LocalKoshResource) {
        let panel = NSSavePanel()
        panel.allowedContentTypes = [.plainText]
        panel.canCreateDirectories = true
        panel.nameFieldStringValue = safeFilename(resource.title) + ".md"

        guard panel.runModal() == .OK, let url = panel.url else { return }

        var output = "# \(resource.title)\n\n"
        if !resource.context.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            output += "> Adapted in Kosh for: \(resource.context)\n\n"
        }
        output += "---\n\n\(resource.body)\n"

        do {
            try output.write(to: url, atomically: true, encoding: .utf8)
        } catch {
            errorMessage = "Kosh could not export this version: \(error.localizedDescription)"
        }
    }

    private var storeURL: URL {
        let applicationSupport = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        return applicationSupport
            .appendingPathComponent("Kosh", isDirectory: true)
            .appendingPathComponent("local-library.json")
    }

    private func load() {
        guard fileManager.fileExists(atPath: storeURL.path) else { return }

        do {
            let data = try Data(contentsOf: storeURL)
            localResources = try JSONDecoder.kosh.decode([LocalKoshResource].self, from: data)
        } catch {
            errorMessage = "Kosh found local versions but could not read them. They were left untouched."
        }
    }

    private func persist() {
        do {
            try fileManager.createDirectory(at: storeURL.deletingLastPathComponent(), withIntermediateDirectories: true)
            let data = try JSONEncoder.kosh.encode(localResources)
            try data.write(to: storeURL, options: .atomic)
        } catch {
            errorMessage = "Kosh could not save your local library: \(error.localizedDescription)"
        }
    }

    private func safeFilename(_ value: String) -> String {
        let invalid = CharacterSet(charactersIn: "/\\:*?\"<>|")
        let cleaned = value.components(separatedBy: invalid).joined(separator: "-")
        return cleaned.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? "kosh-resource" : cleaned
    }
}

private extension JSONEncoder {
    static var kosh: JSONEncoder {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        return encoder
    }
}

private extension JSONDecoder {
    static var kosh: JSONDecoder {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }
}
