import AppKit

@MainActor
enum KoshPalette {
    static let canvas = NSColor(calibratedRed: 0.055, green: 0.055, blue: 0.065, alpha: 1)
    static let surface = NSColor(calibratedRed: 0.085, green: 0.085, blue: 0.098, alpha: 1)
    static let ink = NSColor(calibratedRed: 0.94, green: 0.925, blue: 0.88, alpha: 1)
    static let muted = NSColor(calibratedRed: 0.57, green: 0.56, blue: 0.54, alpha: 1)
    static let gold = NSColor(calibratedRed: 0.79, green: 0.66, blue: 0.32, alpha: 1)
    static let success = NSColor(calibratedRed: 0.47, green: 0.72, blue: 0.56, alpha: 1)
    static let line = NSColor.white.withAlphaComponent(0.12)
}

enum KoshSection: String {
    case library = "Library"
    case saved = "Saved"
}

@MainActor
final class KoshRootView: NSView {
    private let store = KoshStore()
    private var section: KoshSection = .library
    private var query = ""
    private var selectedKind: ResourceKind?
    private var selectedResourceID = KoshCatalog.resources.first?.id ?? ""
    private var selectedDraftID: UUID?

    private let header = NSView()
    private let contentHost = NSView()
    private let libraryButton = KoshTextButton(title: "Library")
    private let savedButton = KoshTextButton(title: "Saved")
    private let searchField = NSSearchField()

    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        build()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        build()
    }

    private func build() {
        wantsLayer = true
        layer?.backgroundColor = KoshPalette.canvas.cgColor
        header.translatesAutoresizingMaskIntoConstraints = false
        contentHost.translatesAutoresizingMaskIntoConstraints = false
        header.wantsLayer = true
        header.layer?.backgroundColor = KoshPalette.canvas.withAlphaComponent(0.98).cgColor
        addSubview(header)
        addSubview(contentHost)

        NSLayoutConstraint.activate([
            header.topAnchor.constraint(equalTo: topAnchor),
            header.leadingAnchor.constraint(equalTo: leadingAnchor),
            header.trailingAnchor.constraint(equalTo: trailingAnchor),
            header.heightAnchor.constraint(equalToConstant: 70),
            contentHost.topAnchor.constraint(equalTo: header.bottomAnchor),
            contentHost.leadingAnchor.constraint(equalTo: leadingAnchor),
            contentHost.trailingAnchor.constraint(equalTo: trailingAnchor),
            contentHost.bottomAnchor.constraint(equalTo: bottomAnchor)
        ])

        buildHeader()
        renderLibrary()
    }

    private func buildHeader() {
        let stack = NSStackView()
        stack.orientation = .horizontal
        stack.alignment = .centerY
        stack.spacing = 16
        stack.translatesAutoresizingMaskIntoConstraints = false
        header.addSubview(stack)
        NSLayoutConstraint.activate([
            stack.leadingAnchor.constraint(equalTo: header.leadingAnchor, constant: 26),
            stack.trailingAnchor.constraint(equalTo: header.trailingAnchor, constant: -26),
            stack.topAnchor.constraint(equalTo: header.topAnchor, constant: 14),
            stack.bottomAnchor.constraint(equalTo: header.bottomAnchor, constant: -14)
        ])

        let mark = NSView()
        mark.wantsLayer = true
        mark.layer?.backgroundColor = KoshPalette.gold.cgColor
        mark.translatesAutoresizingMaskIntoConstraints = false
        let markLabel = makeLabel("K", font: NSFont(name: "Georgia-Bold", size: 17) ?? .boldSystemFont(ofSize: 17), color: KoshPalette.canvas)
        mark.addSubview(markLabel)
        NSLayoutConstraint.activate([
            mark.widthAnchor.constraint(equalToConstant: 32),
            mark.heightAnchor.constraint(equalToConstant: 32),
            markLabel.centerXAnchor.constraint(equalTo: mark.centerXAnchor),
            markLabel.centerYAnchor.constraint(equalTo: mark.centerYAnchor, constant: -1)
        ])

        let brandText = NSStackView(views: [
            makeLabel("KRAMANITI", font: NSFont.monospacedSystemFont(ofSize: 10, weight: .semibold), color: KoshPalette.muted, tracking: 2.1),
            makeLabel("Kosh", font: NSFont(name: "Georgia", size: 18) ?? .systemFont(ofSize: 18), color: KoshPalette.ink)
        ])
        brandText.orientation = .vertical
        brandText.alignment = .leading
        brandText.spacing = 1
        let brand = NSStackView(views: [mark, brandText])
        brand.orientation = .horizontal
        brand.alignment = .centerY
        brand.spacing = 11
        stack.addArrangedSubview(brand)

        let divider = separator(vertical: true)
        stack.addArrangedSubview(divider)
        divider.widthAnchor.constraint(equalToConstant: 1).isActive = true
        divider.heightAnchor.constraint(equalToConstant: 28).isActive = true

        libraryButton.actionHandler = { [weak self] in self?.showLibrary() }
        savedButton.actionHandler = { [weak self] in self?.showSaved() }
        stack.addArrangedSubview(libraryButton)
        stack.addArrangedSubview(savedButton)

        stack.addArrangedSubview(makeSpacer())

        let local = NSStackView(views: [
            dot(color: KoshPalette.success),
            makeLabel("LOCAL COLLECTION", font: NSFont.monospacedSystemFont(ofSize: 9, weight: .semibold), color: KoshPalette.muted, tracking: 1.2)
        ])
        local.orientation = .horizontal
        local.alignment = .centerY
        local.spacing = 8
        stack.addArrangedSubview(local)

        searchField.placeholderString = "Search Kosh"
        searchField.font = NSFont.systemFont(ofSize: 12)
        searchField.textColor = KoshPalette.ink
        searchField.appearance = NSAppearance(named: .darkAqua)
        searchField.sendsSearchStringImmediately = true
        searchField.target = self
        searchField.action = #selector(searchChanged)
        searchField.translatesAutoresizingMaskIntoConstraints = false
        stack.addArrangedSubview(searchField)
        searchField.widthAnchor.constraint(equalToConstant: 210).isActive = true
        searchField.heightAnchor.constraint(equalToConstant: 34).isActive = true
        updateHeaderState()
    }

    private func showLibrary() {
        section = .library
        renderLibrary()
        updateHeaderState()
    }

    private func showSaved() {
        section = .saved
        if selectedDraftID == nil { selectedDraftID = store.localResources.first?.id }
        renderSaved()
        updateHeaderState()
    }

    @objc private func searchChanged() {
        query = searchField.stringValue
        if section == .library { renderLibrary() }
    }

    private func updateHeaderState() {
        libraryButton.isActive = section == .library
        savedButton.isActive = section == .saved
        savedButton.title = store.localResources.isEmpty ? "Saved" : "Saved · \(store.localResources.count)"
    }

    private var visibleResources: [KoshResource] {
        let normalized = query.trimmingCharacters(in: .whitespacesAndNewlines)
        return KoshCatalog.resources.filter { resource in
            let kindMatches = selectedKind == nil || selectedKind == resource.kind
            guard !normalized.isEmpty else { return kindMatches }
            let textMatches = resource.title.localizedCaseInsensitiveContains(normalized)
                || resource.summary.localizedCaseInsensitiveContains(normalized)
                || resource.useWhen.localizedCaseInsensitiveContains(normalized)
            return kindMatches && textMatches
        }
    }

    private func renderLibrary() {
        clearContent()
        let split = KoshSplitView()
        let resources = visibleResources
        if !resources.contains(where: { $0.id == selectedResourceID }), let first = resources.first {
            selectedResourceID = first.id
        }
        let index = KoshResourceIndexView(
            resources: resources,
            selectedResourceID: selectedResourceID,
            selectedKind: selectedKind,
            onSelectResource: { [weak self] id in
                self?.selectedResourceID = id
                self?.renderLibrary()
            },
            onSelectKind: { [weak self] kind in
                self?.selectedKind = kind
                self?.renderLibrary()
            }
        )
        let dossier = KoshResourceDossierView(
            resource: resources.first(where: { $0.id == selectedResourceID }),
            store: store,
            onMakeVersion: { [weak self] local in
                self?.selectedDraftID = local.id
                self?.showSaved()
            }
        )
        split.addArrangedSubview(index)
        split.addArrangedSubview(dossier)
        index.widthAnchor.constraint(equalTo: split.widthAnchor, multiplier: 0.34).isActive = true
        contentHost.addSubview(split)
        split.pinToEdges(of: contentHost)
    }

    private func renderSaved() {
        clearContent()
        let split = KoshSplitView()
        let list = KoshSavedIndexView(
            resources: store.localResources,
            selectedDraftID: selectedDraftID,
            onSelect: { [weak self] id in
                self?.selectedDraftID = id
                self?.renderSaved()
            }
        )
        let editor = KoshDraftEditorView(
            draft: store.localResources.first(where: { $0.id == selectedDraftID }),
            store: store,
            onSave: { [weak self] draft in
                self?.store.update(draft)
                self?.selectedDraftID = draft.id
                self?.renderSaved()
            },
            onDelete: { [weak self] draft in
                self?.store.delete(draft)
                self?.selectedDraftID = self?.store.localResources.first?.id
                self?.renderSaved()
                self?.updateHeaderState()
            }
        )
        split.addArrangedSubview(list)
        split.addArrangedSubview(editor)
        list.widthAnchor.constraint(equalTo: split.widthAnchor, multiplier: 0.34).isActive = true
        contentHost.addSubview(split)
        split.pinToEdges(of: contentHost)
    }

    private func clearContent() {
        contentHost.subviews.forEach { $0.removeFromSuperview() }
    }
}

@MainActor
final class KoshSplitView: NSSplitView {
    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        isVertical = true
        dividerStyle = .thin
        wantsLayer = true
        layer?.backgroundColor = KoshPalette.canvas.cgColor
        translatesAutoresizingMaskIntoConstraints = false
    }

    required init?(coder: NSCoder) { super.init(coder: coder) }
}

@MainActor
final class KoshResourceIndexView: NSView {
    private let resources: [KoshResource]
    private let selectedResourceID: String
    private let selectedKind: ResourceKind?
    private let onSelectResource: (String) -> Void
    private let onSelectKind: (ResourceKind?) -> Void

    init(resources: [KoshResource], selectedResourceID: String, selectedKind: ResourceKind?, onSelectResource: @escaping (String) -> Void, onSelectKind: @escaping (ResourceKind?) -> Void) {
        self.resources = resources
        self.selectedResourceID = selectedResourceID
        self.selectedKind = selectedKind
        self.onSelectResource = onSelectResource
        self.onSelectKind = onSelectKind
        super.init(frame: .zero)
        build()
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    private func build() {
        wantsLayer = true
        layer?.backgroundColor = KoshPalette.surface.withAlphaComponent(0.45).cgColor
        let outer = NSStackView()
        outer.orientation = .vertical
        outer.alignment = .leading
        outer.spacing = 0
        outer.translatesAutoresizingMaskIntoConstraints = false
        addSubview(outer)
        outer.pinToEdges(of: self)

        let intro = NSStackView(views: [
            makeLabel("KOSH / LIBRARY", font: NSFont.monospacedSystemFont(ofSize: 10, weight: .semibold), color: KoshPalette.gold, tracking: 1.5),
            makeSpacer(),
            makeLabel(String(format: "%02d RESOURCES", resources.count), font: NSFont.monospacedSystemFont(ofSize: 9, weight: .medium), color: KoshPalette.muted)
        ])
        intro.orientation = .horizontal
        intro.alignment = .firstBaseline
        intro.spacing = 8
        let introWrap = paddedView(intro, horizontal: 22, top: 24, bottom: 15)
        introWrap.widthAnchor.constraint(equalTo: outer.widthAnchor).isActive = true
        outer.addArrangedSubview(introWrap)

        let categories = NSStackView()
        categories.orientation = .horizontal
        categories.spacing = 6
        categories.translatesAutoresizingMaskIntoConstraints = false
        categories.addArrangedSubview(categoryButton(label: "All", kind: nil))
        ResourceKind.allCases.forEach { categories.addArrangedSubview(categoryButton(label: $0.rawValue, kind: $0)) }
        let categoryScroll = NSScrollView()
        categoryScroll.drawsBackground = false
        categoryScroll.hasHorizontalScroller = false
        categoryScroll.hasVerticalScroller = false
        categoryScroll.documentView = categories
        categoryScroll.translatesAutoresizingMaskIntoConstraints = false
        let categoryWrap = paddedView(categoryScroll, horizontal: 22, bottom: 15)
        categoryWrap.widthAnchor.constraint(equalTo: outer.widthAnchor).isActive = true
        categoryWrap.heightAnchor.constraint(equalToConstant: 43).isActive = true
        categories.heightAnchor.constraint(equalTo: categoryScroll.contentView.heightAnchor).isActive = true
        outer.addArrangedSubview(categoryWrap)

        let rule = paddedView(separator(), horizontal: 22)
        rule.widthAnchor.constraint(equalTo: outer.widthAnchor).isActive = true
        rule.heightAnchor.constraint(equalToConstant: 1).isActive = true
        outer.addArrangedSubview(rule)

        if resources.isEmpty {
            let empty = NSStackView(views: [
                makeLabel("Nothing here yet", font: NSFont(name: "Georgia", size: 19) ?? .systemFont(ofSize: 19), color: KoshPalette.ink),
                makeLabel("Try another search or category.", font: NSFont.systemFont(ofSize: 12), color: KoshPalette.muted)
            ])
            empty.orientation = .vertical
            empty.alignment = .leading
            empty.spacing = 8
            let emptyWrap = paddedView(empty, horizontal: 24, top: 24)
            emptyWrap.widthAnchor.constraint(equalTo: outer.widthAnchor).isActive = true
            outer.addArrangedSubview(emptyWrap)
        } else {
            let rows = NSStackView()
            rows.orientation = .vertical
            rows.alignment = .leading
            rows.spacing = 0
            rows.translatesAutoresizingMaskIntoConstraints = false
            resources.enumerated().forEach { index, resource in
                let row = resourceRow(resource, index: index, selected: resource.id == selectedResourceID)
                row.widthAnchor.constraint(equalTo: rows.widthAnchor).isActive = true
                row.heightAnchor.constraint(equalToConstant: 104).isActive = true
                rows.addArrangedSubview(row)
            }
            let scroll = KoshScrollView(document: rows)
            outer.addArrangedSubview(scroll)
            scroll.widthAnchor.constraint(equalTo: outer.widthAnchor).isActive = true
        }
    }

    private func categoryButton(label: String, kind: ResourceKind?) -> KoshTextButton {
        let button = KoshTextButton(title: label)
        button.isActive = selectedKind == kind
        button.actionHandler = { [onSelectKind] in onSelectKind(kind) }
        button.heightAnchor.constraint(equalToConstant: 28).isActive = true
        return button
    }

    private func resourceRow(_ resource: KoshResource, index: Int, selected: Bool) -> KoshResourceRowButton {
        let row = KoshResourceRowButton(resource: resource, index: index, selected: selected)
        row.actionHandler = { [onSelectResource] in onSelectResource(resource.id) }
        return row
    }
}

@MainActor
final class KoshResourceDossierView: NSView {
    private let resource: KoshResource?
    private let store: KoshStore
    private let onMakeVersion: (LocalKoshResource) -> Void
    private var sourceVisible = false
    private var sourceScroll: NSScrollView?

    init(resource: KoshResource?, store: KoshStore, onMakeVersion: @escaping (LocalKoshResource) -> Void) {
        self.resource = resource
        self.store = store
        self.onMakeVersion = onMakeVersion
        super.init(frame: .zero)
        build()
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    private func build() {
        wantsLayer = true
        layer?.backgroundColor = KoshPalette.canvas.cgColor
        guard let resource else {
            let empty = NSStackView(views: [
                makeLabel("Select a Kosh resource", font: NSFont(name: "Georgia", size: 22) ?? .systemFont(ofSize: 22), color: KoshPalette.ink),
                makeLabel("Choose a capability from the library to inspect its purpose, boundaries, and source.", font: NSFont.systemFont(ofSize: 13), color: KoshPalette.muted)
            ])
            empty.orientation = .vertical
            empty.alignment = .centerX
            empty.spacing = 12
            addSubview(empty)
            empty.translatesAutoresizingMaskIntoConstraints = false
            NSLayoutConstraint.activate([
                empty.centerXAnchor.constraint(equalTo: centerXAnchor),
                empty.centerYAnchor.constraint(equalTo: centerYAnchor),
                empty.widthAnchor.constraint(lessThanOrEqualToConstant: 330)
            ])
            return
        }

        let content = NSStackView()
        content.orientation = .vertical
        content.alignment = .leading
        content.spacing = 0
        content.translatesAutoresizingMaskIntoConstraints = false
        let scroll = KoshScrollView(document: content)
        addSubview(scroll)
        scroll.pinToEdges(of: self)
        content.leadingAnchor.constraint(equalTo: scroll.contentView.leadingAnchor, constant: 46).isActive = true
        content.trailingAnchor.constraint(equalTo: scroll.contentView.trailingAnchor, constant: -46).isActive = true
        content.widthAnchor.constraint(equalTo: scroll.contentView.widthAnchor, constant: -92).isActive = true

        let topLine = NSStackView(views: [
            makeLabel(resource.kind.rawValue.uppercased(), font: NSFont.monospacedSystemFont(ofSize: 10, weight: .semibold), color: KoshPalette.gold, tracking: 1.5),
            makeLabel("/ \(resource.kind.descriptor.uppercased())", font: NSFont.monospacedSystemFont(ofSize: 10, weight: .medium), color: KoshPalette.muted, tracking: 1.2),
            makeSpacer(),
            makeLabel(resource.status.uppercased(), font: NSFont.monospacedSystemFont(ofSize: 9, weight: .semibold), color: KoshPalette.muted, tracking: 1.2)
        ])
        topLine.orientation = .horizontal
        topLine.alignment = .firstBaseline
        topLine.spacing = 8
        content.addArrangedSubview(paddedView(topLine, top: 34))

        let title = makeLabel(resource.title, font: NSFont(name: "Georgia", size: 43) ?? .systemFont(ofSize: 43), color: KoshPalette.ink)
        title.maximumNumberOfLines = 3
        title.lineBreakMode = .byWordWrapping
        content.addArrangedSubview(paddedView(title, top: 28))

        let summary = makeLabel(resource.summary, font: NSFont(name: "Georgia", size: 17) ?? .systemFont(ofSize: 17), color: KoshPalette.muted)
        summary.maximumNumberOfLines = 0
        summary.lineBreakMode = .byWordWrapping
        content.addArrangedSubview(paddedView(summary, top: 15))

        let metadata = NSStackView(views: [badge("\(resource.format) source"), badge(resource.version), badge("Human-led")])
        metadata.orientation = .horizontal
        metadata.spacing = 8
        content.addArrangedSubview(paddedView(metadata, top: 20))
        content.addArrangedSubview(paddedView(separator(), top: 30, bottom: 30))

        let twoColumn = NSStackView(views: [
            detailBlock("USE WHEN", text: resource.useWhen),
            detailBlock("WHAT IT INCLUDES", items: resource.includes)
        ])
        twoColumn.orientation = .horizontal
        twoColumn.alignment = .top
        twoColumn.spacing = 48
        content.addArrangedSubview(twoColumn)
        content.addArrangedSubview(paddedView(separator(), top: 30, bottom: 30))

        let sourceInfo = NSStackView(views: [
            makeLabel("SOURCE / BOUNDARY", font: NSFont.monospacedSystemFont(ofSize: 10, weight: .semibold), color: KoshPalette.gold, tracking: 1.4),
            makeLabel("Read, inspect, adapt, and carry this resource. Kosh does not run it or connect anything on your behalf.", font: NSFont.systemFont(ofSize: 13), color: KoshPalette.ink),
            makeLabel(resource.sourcePath, font: NSFont.monospacedSystemFont(ofSize: 11, weight: .regular), color: KoshPalette.muted)
        ])
        sourceInfo.orientation = .vertical
        sourceInfo.alignment = .leading
        sourceInfo.spacing = 11
        content.addArrangedSubview(sourceInfo)

        let inspect = KoshTextButton(title: "Inspect source")
        inspect.actionHandler = { [weak self] in self?.toggleSource(resource.body, button: inspect) }
        content.addArrangedSubview(paddedView(inspect, top: 24))

        let actions = NSStackView()
        actions.orientation = .horizontal
        actions.spacing = 12
        let makeVersion = KoshPrimaryButton(title: "＋  Make a local version")
        makeVersion.actionHandler = { [store, onMakeVersion] in onMakeVersion(store.makeLocalVersion(from: resource)) }
        let copy = KoshTextButton(title: "Copy source")
        copy.actionHandler = {
            NSPasteboard.general.clearContents()
            NSPasteboard.general.setString(resource.body, forType: .string)
        }
        actions.addArrangedSubview(makeVersion)
        actions.addArrangedSubview(copy)
        content.addArrangedSubview(paddedView(actions, top: 28, bottom: 42))
    }

    private func toggleSource(_ body: String, button: KoshTextButton) {
        sourceVisible.toggle()
        button.title = sourceVisible ? "Hide source" : "Inspect source"
        if sourceVisible {
            let text = NSTextView()
            text.isEditable = false
            text.isSelectable = true
            text.string = body
            text.font = NSFont.monospacedSystemFont(ofSize: 12, weight: .regular)
            text.textColor = KoshPalette.ink
            text.backgroundColor = KoshPalette.surface
            let scroll = KoshScrollView(document: text)
            scroll.heightAnchor.constraint(equalToConstant: 190).isActive = true
            addSubview(scroll)
            scroll.translatesAutoresizingMaskIntoConstraints = false
            NSLayoutConstraint.activate([
                scroll.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 46),
                scroll.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -46),
                scroll.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -12)
            ])
            sourceScroll = scroll
        } else {
            sourceScroll?.removeFromSuperview()
            sourceScroll = nil
        }
    }
}

@MainActor
final class KoshSavedIndexView: NSView {
    private let resources: [LocalKoshResource]
    private let selectedDraftID: UUID?
    private let onSelect: (UUID) -> Void

    init(resources: [LocalKoshResource], selectedDraftID: UUID?, onSelect: @escaping (UUID) -> Void) {
        self.resources = resources
        self.selectedDraftID = selectedDraftID
        self.onSelect = onSelect
        super.init(frame: .zero)
        build()
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    private func build() {
        wantsLayer = true
        layer?.backgroundColor = KoshPalette.surface.withAlphaComponent(0.45).cgColor
        let outer = NSStackView()
        outer.orientation = .vertical
        outer.alignment = .leading
        outer.spacing = 0
        outer.translatesAutoresizingMaskIntoConstraints = false
        addSubview(outer)
        outer.pinToEdges(of: self)

        let heading = NSStackView(views: [
            makeLabel("LOCAL / YOUR VERSIONS", font: NSFont.monospacedSystemFont(ofSize: 10, weight: .semibold), color: KoshPalette.gold, tracking: 1.5),
            makeSpacer(),
            makeLabel(String(format: "%02d", resources.count), font: NSFont.monospacedSystemFont(ofSize: 9, weight: .medium), color: KoshPalette.muted)
        ])
        heading.orientation = .horizontal
        heading.alignment = .firstBaseline
        heading.spacing = 8
        let headingWrap = paddedView(heading, horizontal: 22, top: 24, bottom: 15)
        headingWrap.widthAnchor.constraint(equalTo: outer.widthAnchor).isActive = true
        outer.addArrangedSubview(headingWrap)
        let rule = paddedView(separator(), horizontal: 22)
        rule.widthAnchor.constraint(equalTo: outer.widthAnchor).isActive = true
        rule.heightAnchor.constraint(equalToConstant: 1).isActive = true
        outer.addArrangedSubview(rule)

        if resources.isEmpty {
            let empty = NSStackView(views: [
                makeLabel("Your shelf is empty", font: NSFont(name: "Georgia", size: 20) ?? .systemFont(ofSize: 20), color: KoshPalette.ink),
                makeLabel("Open a resource in Library and make a local version when you are ready to align it to your work.", font: NSFont.systemFont(ofSize: 12), color: KoshPalette.muted)
            ])
            empty.orientation = .vertical
            empty.alignment = .leading
            empty.spacing = 8
            let wrap = paddedView(empty, horizontal: 24, top: 24)
            wrap.widthAnchor.constraint(equalTo: outer.widthAnchor).isActive = true
            outer.addArrangedSubview(wrap)
        } else {
            let rows = NSStackView()
            rows.orientation = .vertical
            rows.alignment = .leading
            rows.spacing = 0
            rows.translatesAutoresizingMaskIntoConstraints = false
            resources.forEach { draft in
                let row = KoshDraftRowButton(draft: draft, selected: draft.id == selectedDraftID)
                row.actionHandler = { [onSelect] in onSelect(draft.id) }
                row.widthAnchor.constraint(equalTo: rows.widthAnchor).isActive = true
                row.heightAnchor.constraint(equalToConstant: 78).isActive = true
                rows.addArrangedSubview(row)
            }
            let scroll = KoshScrollView(document: rows)
            outer.addArrangedSubview(scroll)
            scroll.widthAnchor.constraint(equalTo: outer.widthAnchor).isActive = true
        }
    }
}

@MainActor
final class KoshDraftEditorView: NSView {
    private var draft: LocalKoshResource?
    private let store: KoshStore
    private let onSave: (LocalKoshResource) -> Void
    private let onDelete: (LocalKoshResource) -> Void
    private let titleField = NSTextField()
    private let contextField = NSTextField()
    private let editor = NSTextView()
    private let statusLabel = NSTextField(labelWithString: "NOT EXECUTED BY KOSH")

    init(draft: LocalKoshResource?, store: KoshStore, onSave: @escaping (LocalKoshResource) -> Void, onDelete: @escaping (LocalKoshResource) -> Void) {
        self.draft = draft
        self.store = store
        self.onSave = onSave
        self.onDelete = onDelete
        super.init(frame: .zero)
        build()
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    private func build() {
        wantsLayer = true
        layer?.backgroundColor = KoshPalette.canvas.cgColor
        guard let draft else {
            let empty = NSStackView(views: [
                makeLabel("Your local Kosh shelf", font: NSFont(name: "Georgia", size: 22) ?? .systemFont(ofSize: 22), color: KoshPalette.ink),
                makeLabel("Make a local version of a resource to start adapting it here.", font: NSFont.systemFont(ofSize: 13), color: KoshPalette.muted)
            ])
            empty.orientation = .vertical
            empty.alignment = .centerX
            empty.spacing = 12
            addSubview(empty)
            empty.translatesAutoresizingMaskIntoConstraints = false
            NSLayoutConstraint.activate([
                empty.centerXAnchor.constraint(equalTo: centerXAnchor),
                empty.centerYAnchor.constraint(equalTo: centerYAnchor)
            ])
            return
        }

        let content = NSStackView()
        content.orientation = .vertical
        content.alignment = .leading
        content.spacing = 0
        content.translatesAutoresizingMaskIntoConstraints = false
        let scroll = KoshScrollView(document: content)
        addSubview(scroll)
        scroll.pinToEdges(of: self)
        content.leadingAnchor.constraint(equalTo: scroll.contentView.leadingAnchor, constant: 46).isActive = true
        content.trailingAnchor.constraint(equalTo: scroll.contentView.trailingAnchor, constant: -46).isActive = true
        content.widthAnchor.constraint(equalTo: scroll.contentView.widthAnchor, constant: -92).isActive = true

        let topline = NSStackView(views: [
            makeLabel("LOCAL VERSION / EDITOR", font: NSFont.monospacedSystemFont(ofSize: 10, weight: .semibold), color: KoshPalette.gold, tracking: 1.5),
            makeSpacer(),
            statusLabel
        ])
        topline.orientation = .horizontal
        topline.alignment = .firstBaseline
        statusLabel.font = NSFont.monospacedSystemFont(ofSize: 9, weight: .semibold)
        statusLabel.textColor = KoshPalette.muted
        content.addArrangedSubview(paddedView(topline, top: 34))

        titleField.stringValue = draft.title
        titleField.font = NSFont(name: "Georgia", size: 37) ?? .systemFont(ofSize: 37)
        titleField.textColor = KoshPalette.ink
        titleField.isBordered = false
        titleField.drawsBackground = false
        titleField.focusRingType = .none
        content.addArrangedSubview(paddedView(titleField, top: 27))

        let contextLabel = makeLabel("WHAT ARE YOU ALIGNING IT FOR?", font: NSFont.monospacedSystemFont(ofSize: 10, weight: .semibold), color: KoshPalette.gold, tracking: 1.3)
        contextField.placeholderString = "A team, workflow, audience, or decision…"
        contextField.stringValue = draft.context
        contextField.font = NSFont.systemFont(ofSize: 14)
        contextField.textColor = KoshPalette.ink
        contextField.backgroundColor = KoshPalette.surface
        contextField.isBordered = false
        contextField.focusRingType = .none
        let contextStack = NSStackView(views: [contextLabel, contextField])
        contextStack.orientation = .vertical
        contextStack.alignment = .leading
        contextStack.spacing = 8
        contextField.widthAnchor.constraint(equalTo: content.widthAnchor).isActive = true
        contextField.heightAnchor.constraint(equalToConstant: 42).isActive = true
        content.addArrangedSubview(paddedView(contextStack, top: 26))
        content.addArrangedSubview(paddedView(separator(), top: 26, bottom: 26))

        let sourceHeader = NSStackView(views: [
            makeLabel("SOURCE / YOUR ADAPTATION", font: NSFont.monospacedSystemFont(ofSize: 10, weight: .semibold), color: KoshPalette.gold, tracking: 1.3),
            makeSpacer(),
            makeLabel("Markdown", font: NSFont.monospacedSystemFont(ofSize: 10, weight: .regular), color: KoshPalette.muted)
        ])
        sourceHeader.orientation = .horizontal
        sourceHeader.alignment = .firstBaseline
        content.addArrangedSubview(sourceHeader)

        editor.string = draft.body
        editor.font = NSFont.monospacedSystemFont(ofSize: 13, weight: .regular)
        editor.textColor = KoshPalette.ink
        editor.backgroundColor = KoshPalette.surface
        editor.isRichText = false
        editor.isVerticallyResizable = true
        editor.isHorizontallyResizable = false
        editor.autoresizingMask = [.width]
        let editorScroll = KoshScrollView(document: editor)
        editorScroll.heightAnchor.constraint(equalToConstant: 370).isActive = true
        editorScroll.widthAnchor.constraint(equalTo: content.widthAnchor).isActive = true
        content.addArrangedSubview(paddedView(editorScroll, top: 12))

        let actions = NSStackView()
        actions.orientation = .horizontal
        actions.spacing = 12
        let save = KoshPrimaryButton(title: "Save changes")
        save.actionHandler = { [weak self] in self?.saveDraft() }
        let export = KoshTextButton(title: "Export Markdown")
        export.actionHandler = { [weak self] in
            guard let self, let current = self.currentDraft() else { return }
            self.store.export(current)
        }
        let delete = KoshTextButton(title: "Delete local version")
        delete.contentTintColor = KoshPalette.muted
        delete.actionHandler = { [weak self] in
            guard let self, let current = self.currentDraft() else { return }
            self.onDelete(current)
        }
        actions.addArrangedSubview(save)
        actions.addArrangedSubview(export)
        actions.addArrangedSubview(makeSpacer())
        actions.addArrangedSubview(delete)
        content.addArrangedSubview(paddedView(actions, top: 18, bottom: 38))
    }

    private func currentDraft() -> LocalKoshResource? {
        guard var draft else { return nil }
        draft.title = titleField.stringValue
        draft.context = contextField.stringValue
        draft.body = editor.string
        return draft
    }

    private func saveDraft() {
        guard let current = currentDraft() else { return }
        onSave(current)
    }
}

@MainActor
class KoshTextButton: NSButton {
    var actionHandler: (() -> Void)?
    var isActive = false { didSet { updateStyle() } }

    init(title: String) {
        super.init(frame: .zero)
        self.title = title
        target = self
        action = #selector(pressed)
        isBordered = false
        wantsLayer = true
        font = NSFont.monospacedSystemFont(ofSize: 11, weight: .semibold)
        translatesAutoresizingMaskIntoConstraints = false
        updateStyle()
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }

    @objc private func pressed() { actionHandler?() }

    private func updateStyle() {
        contentTintColor = isActive ? KoshPalette.canvas : KoshPalette.muted
        layer?.backgroundColor = (isActive ? KoshPalette.gold : NSColor.clear).cgColor
    }
}

@MainActor
final class KoshPrimaryButton: KoshTextButton {
    override init(title: String) {
        super.init(title: title)
        font = NSFont.systemFont(ofSize: 12, weight: .semibold)
        isActive = true
        layer?.backgroundColor = KoshPalette.gold.cgColor
        contentTintColor = KoshPalette.canvas
        heightAnchor.constraint(equalToConstant: 42).isActive = true
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }
}

@MainActor
final class KoshResourceRowButton: NSButton {
    var actionHandler: (() -> Void)?

    init(resource: KoshResource, index: Int, selected: Bool) {
        super.init(frame: .zero)
        let text = NSMutableAttributedString()
        text.append(NSAttributedString(string: String(format: "%02d  %@\n", index + 1, resource.kind.rawValue.uppercased()), attributes: [
            .font: NSFont.monospacedSystemFont(ofSize: 9, weight: .semibold),
            .foregroundColor: selected ? KoshPalette.gold : KoshPalette.muted
        ]))
        text.append(NSAttributedString(string: "\(resource.title)\n", attributes: [
            .font: NSFont(name: "Georgia", size: 15) ?? NSFont.systemFont(ofSize: 15),
            .foregroundColor: KoshPalette.ink
        ]))
        text.append(NSAttributedString(string: resource.summary, attributes: [
            .font: NSFont.systemFont(ofSize: 11),
            .foregroundColor: KoshPalette.muted
        ]))
        attributedTitle = text
        alignment = .left
        isBordered = false
        wantsLayer = true
        layer?.backgroundColor = (selected ? KoshPalette.gold.withAlphaComponent(0.11) : NSColor.clear).cgColor
        target = self
        action = #selector(pressed)
        translatesAutoresizingMaskIntoConstraints = false
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }
    @objc private func pressed() { actionHandler?() }
}

@MainActor
final class KoshDraftRowButton: NSButton {
    var actionHandler: (() -> Void)?

    init(draft: LocalKoshResource, selected: Bool) {
        super.init(frame: .zero)
        let text = NSMutableAttributedString()
        text.append(NSAttributedString(string: "\(draft.kind.rawValue.uppercased())  ·  \(draft.updatedAt.formatted(date: .abbreviated, time: .omitted))\n", attributes: [
            .font: NSFont.monospacedSystemFont(ofSize: 9, weight: .semibold),
            .foregroundColor: selected ? KoshPalette.gold : KoshPalette.muted
        ]))
        text.append(NSAttributedString(string: draft.title, attributes: [
            .font: NSFont(name: "Georgia", size: 15) ?? NSFont.systemFont(ofSize: 15),
            .foregroundColor: KoshPalette.ink
        ]))
        attributedTitle = text
        alignment = .left
        isBordered = false
        wantsLayer = true
        layer?.backgroundColor = (selected ? KoshPalette.gold.withAlphaComponent(0.11) : NSColor.clear).cgColor
        target = self
        action = #selector(pressed)
        translatesAutoresizingMaskIntoConstraints = false
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }
    @objc private func pressed() { actionHandler?() }
}

@MainActor
final class KoshScrollView: NSScrollView {
    init(document: NSView) {
        super.init(frame: .zero)
        drawsBackground = false
        hasVerticalScroller = true
        hasHorizontalScroller = false
        autohidesScrollers = true
        documentView = document
        translatesAutoresizingMaskIntoConstraints = false
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) has not been implemented") }
}

@MainActor
private func makeLabel(_ text: String, font: NSFont, color: NSColor, tracking: CGFloat = 0) -> NSTextField {
    let label = NSTextField(labelWithString: text)
    label.font = font
    label.textColor = color
    label.maximumNumberOfLines = 0
    label.lineBreakMode = .byWordWrapping
    label.translatesAutoresizingMaskIntoConstraints = false
    if tracking != 0 {
        label.attributedStringValue = NSAttributedString(string: text, attributes: [
            .font: font,
            .foregroundColor: color,
            .kern: tracking
        ])
    }
    return label
}

@MainActor
private func makeSpacer() -> NSView {
    let spacer = NSView()
    spacer.setContentHuggingPriority(.defaultLow, for: .horizontal)
    return spacer
}

@MainActor
private func separator(vertical: Bool = false) -> NSBox {
    let rule = NSBox()
    rule.boxType = vertical ? .custom : .separator
    if vertical { rule.fillColor = KoshPalette.line }
    rule.translatesAutoresizingMaskIntoConstraints = false
    return rule
}

@MainActor
private func dot(color: NSColor) -> NSView {
    let view = NSView()
    view.wantsLayer = true
    view.layer?.backgroundColor = color.cgColor
    view.layer?.cornerRadius = 3
    view.translatesAutoresizingMaskIntoConstraints = false
    view.widthAnchor.constraint(equalToConstant: 6).isActive = true
    view.heightAnchor.constraint(equalToConstant: 6).isActive = true
    return view
}

@MainActor
private func badge(_ text: String) -> NSTextField {
    let label = makeLabel(text.uppercased(), font: NSFont.monospacedSystemFont(ofSize: 9, weight: .semibold), color: KoshPalette.muted, tracking: 0.9)
    label.wantsLayer = true
    label.layer?.backgroundColor = KoshPalette.surface.cgColor
    label.layer?.borderColor = KoshPalette.line.cgColor
    label.layer?.borderWidth = 1
    label.drawsBackground = true
    label.backgroundColor = KoshPalette.surface
    return label
}

@MainActor
private func detailBlock(_ title: String, text: String) -> NSView {
    let stack = NSStackView(views: [
        makeLabel(title, font: NSFont.monospacedSystemFont(ofSize: 10, weight: .semibold), color: KoshPalette.gold, tracking: 1.3),
        makeLabel(text, font: NSFont.systemFont(ofSize: 13), color: KoshPalette.ink)
    ])
    stack.orientation = .vertical
    stack.alignment = .leading
    stack.spacing = 10
    stack.setContentHuggingPriority(.defaultLow, for: .horizontal)
    return stack
}

@MainActor
private func detailBlock(_ title: String, items: [String]) -> NSView {
    let stack = NSStackView()
    stack.orientation = .vertical
    stack.alignment = .leading
    stack.spacing = 8
    stack.addArrangedSubview(makeLabel(title, font: NSFont.monospacedSystemFont(ofSize: 10, weight: .semibold), color: KoshPalette.gold, tracking: 1.3))
    items.forEach { item in
        stack.addArrangedSubview(makeLabel("＋  \(item)", font: NSFont.systemFont(ofSize: 13), color: KoshPalette.ink))
    }
    stack.setContentHuggingPriority(.defaultLow, for: .horizontal)
    return stack
}

@MainActor
private func paddedView(_ view: NSView, horizontal: CGFloat = 0, top: CGFloat = 0, bottom: CGFloat = 0) -> NSView {
    let wrapper = NSView()
    wrapper.translatesAutoresizingMaskIntoConstraints = false
    view.translatesAutoresizingMaskIntoConstraints = false
    wrapper.addSubview(view)
    NSLayoutConstraint.activate([
        view.leadingAnchor.constraint(equalTo: wrapper.leadingAnchor, constant: horizontal),
        view.trailingAnchor.constraint(equalTo: wrapper.trailingAnchor, constant: -horizontal),
        view.topAnchor.constraint(equalTo: wrapper.topAnchor, constant: top),
        view.bottomAnchor.constraint(equalTo: wrapper.bottomAnchor, constant: -bottom)
    ])
    return wrapper
}

private extension NSView {
    func pinToEdges(of view: NSView) {
        translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            leadingAnchor.constraint(equalTo: view.leadingAnchor),
            trailingAnchor.constraint(equalTo: view.trailingAnchor),
            topAnchor.constraint(equalTo: view.topAnchor),
            bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
}
