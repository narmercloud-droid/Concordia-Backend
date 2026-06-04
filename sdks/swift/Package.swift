// swift-tools-version:5.6
import PackageDescription

let package = Package(
    name: "ConcordiaSDK",
    platforms: [.macOS(.v12)],
    products: [
        .library(name: "ConcordiaSDK", targets: ["ConcordiaSDK"]),
    ],
    targets: [
        .target(name: "ConcordiaSDK", path: "Sources/ConcordiaSDK"),
        .testTarget(name: "ConcordiaSDKTests", dependencies: ["ConcordiaSDK"]) 
    ]
)
