# Issues #54/#61/#63/#53 Fix 1-Pager

## Background

HOP is a Tauri 2 desktop app that wraps the upstream `rhwp` editor and owns OS integration in `apps/desktop`.
The target issues are platform integration bugs or installer behavior, not upstream document parsing work:

- #54: Linux `.deb`/Arch-converted install flickers while zooming or typing.
- #61: Fedora 44 KDE Wayland NVIDIA crashes immediately in `WebKitWebProcess`.
- #63: macOS Finder Recents does not record opened HWP/HWPX files.
- #53: Windows updater recreates a desktop shortcut after the user removed it.

## Problem

The current Linux WebKit graphics fallback is limited to AppImage runtime on Arch-like systems, so Fedora/RPM and converted `.deb` installs do not receive the DMABUF/compositing workaround that fixes the observed flicker/crash class.
HOP has its own internal recent document store, but it does not notify macOS `NSDocumentController`, so Finder Recents remains unaware.
The default Tauri MSI WiX template sets `REINSTALLMODE=amus`, whose `s` flag reinstalls shortcuts during updates and can recreate a deleted desktop shortcut.

## Goal

Fix all four issues with scoped platform changes:

1. Apply Linux WebKit graphics fallback before WebKit starts on known affected distro/session combinations.
2. Keep AppImage IME handling unchanged and still AppImage-specific.
3. Notify macOS Finder Recents when HOP records a supported document as recently opened.
4. Prevent MSI updates from reinstalling shortcuts while keeping normal first-install shortcuts.

## Non-goals

- Do not change upstream `third_party/rhwp`.
- Do not change app version, release tags, updater endpoints, or signing.
- Do not remove Windows first-install shortcut creation.
- Do not add Quick Look support.

## Constraints

- Preserve macOS, Windows, and Linux behavior.
- Use structured platform APIs where available.
- Avoid logging private document contents.
- Keep user overrides for Linux WebKit environment variables.

## Implementation outline

1. Rename the Linux startup hook to cover general Linux runtime fixes.
2. Make WebKit graphics fallback apply to Arch-like systems and Fedora/RHEL-like Wayland sessions, preserving explicit user env values.
3. Add focused tests for Fedora detection and non-AppImage fallback application.
4. Add a macOS-only helper that calls `NSDocumentController.noteNewRecentDocumentURL`.
5. Call the macOS helper after the internal recent-document store records a supported document; keep Finder Recents registration best-effort.
6. Add target-specific Objective-C framework crates only for macOS.
7. Add a HOP-owned MSI WiX template copied from Tauri 2.9.1 and change `REINSTALLMODE` from `amus` to `amu`.
8. Point `tauri.conf.json` at that template.

## Verification plan

- `cargo test linux_runtime`
- `cargo test recent_documents`
- `cargo check`
- `pnpm run test:desktop`
- Check the WiX template contains `REINSTALLMODE` without the `s` shortcut reinstall flag.

## Rollback notes

Revert the Linux runtime hook rename and fallback detection changes, remove the macOS recent-document helper/dependencies, and remove the custom WiX template/config entry. The app will return to the prior AppImage-only fallback, internal-only recent docs, and default Tauri MSI shortcut reinstall behavior.
