import AppKit

@main
@MainActor
enum KoshApp {
    static func main() {
        let application = NSApplication.shared
        let delegate = KoshApplicationDelegate()
        application.delegate = delegate
        application.setActivationPolicy(.regular)
        application.run()
    }
}

@MainActor
final class KoshApplicationDelegate: NSObject, NSApplicationDelegate {
    private var windowController: KoshWindowController?

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.appearance = NSAppearance(named: .darkAqua)
        windowController = KoshWindowController()
        windowController?.showWindow(nil)
        NSApp.activate(ignoringOtherApps: true)
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        true
    }
}

@MainActor
final class KoshWindowController: NSWindowController {
    convenience init() {
        let window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 1_220, height: 800),
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )
        window.title = "Kosh"
        window.titleVisibility = .hidden
        window.titlebarAppearsTransparent = true
        window.isMovableByWindowBackground = true
        window.minSize = NSSize(width: 960, height: 620)
        window.center()
        window.backgroundColor = KoshPalette.canvas
        window.appearance = NSAppearance(named: .darkAqua)
        self.init(window: window)
        window.contentView = KoshRootView()
    }
}
