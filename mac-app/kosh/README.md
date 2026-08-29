# Kosh for macOS

Kosh is Kramaniti's local library for reusable skills, agents, plugin guides, and human-review patterns.

This first native Mac slice is intentionally small:

- browse and search the bundled Kosh library;
- inspect a resource's purpose, source, contract, and boundaries;
- make a local version for your own context;
- edit and save that version on this Mac;
- export the adapted version as Markdown.

Kosh does not execute agents, connect plugins, request credentials, call providers, or take external actions in this slice. Profiles, sharing, sync, and community features remain future product decisions.

## Build locally

Requirements:

- macOS 14 or later;
- Swift 6 toolchain.

From this directory:

```sh
bash scripts/build-app.sh
open dist/Kosh.app
```

To create a local DMG:

```sh
bash scripts/build-dmg.sh
```

For a signed build, set `KOSH_CODESIGN_IDENTITY` to an approved signing identity before running the app build. Notarization, release identity, and the final public open-source license still require founder approval.

Local versions are stored in the user's Application Support directory under `Kosh/local-library.json`. The app never writes into the Kramaniti repository while running.
