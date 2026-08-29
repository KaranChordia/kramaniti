// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "Kosh",
    platforms: [
        .macOS(.v14)
    ],
    products: [
        .executable(name: "Kosh", targets: ["Kosh"])
    ],
    targets: [
        .executableTarget(
            name: "Kosh",
            path: "Sources/Kosh",
            resources: [
                .process("Resources")
            ]
        )
    ]
)
