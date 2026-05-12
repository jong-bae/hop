# rhwp v0.7.11 Upgrade 1-Pager

## Background

HOP currently pins upstream `rhwp` to `v0.7.9` and overlays selected `rhwp-studio` files for desktop behavior, local fonts, selection handling, printing, and file integration. Upstream released `v0.7.11` at `a9dcdee32b17a7f9a20c609a5ed547e62fb8ebae`.

## Problem

The update is not only a submodule and package version bump. Some HOP-owned overrides shadow upstream fixes added after `v0.7.9`, including delete command support, table resize undo snapshots, grid/page coordinate helpers, toolbar selection preservation, and document-specific font dropdown reset.

## Goal

Move HOP to the `v0.7.11` upstream baseline while preserving HOP desktop behavior and removing or porting override code that would otherwise hide upstream fixes.

## Non-goals

- Do not change HOP app versioning, release tags, or signing/release metadata.
- Do not edit files inside `third_party/rhwp` beyond the submodule pointer.
- Do not add a PDF export shortcut; keep export available through HOP commands/UI only.

## Constraints

- Keep `third_party/rhwp` read-only for product behavior.
- Use `pnpm` only for JavaScript dependency updates.
- Preserve macOS, Windows, and Linux behavior for paths, file dialogs, printing, and document lifecycle.

## Implementation outline

1. Pin `third_party/rhwp` to upstream `v0.7.11`.
2. Update `@rhwp/core`, `Cargo.lock`, baseline tests, and upstream documentation to the same version/commit.
3. Let upstream own `Ctrl+E` as `edit:delete`; remove HOP's PDF shortcut mapping.
4. Port upstream fixes into HOP overrides where the override shadows changed upstream files, focusing on `InputHandler`, mouse/table handlers, toolbar font initialization, and font loader metadata.
5. Keep HOP-specific desktop bridge, print/PDF, local font, cell selection, and text selection behavior.

## Verification plan

- Confirm external Node with `which node`.
- Run `pnpm run test:upstream`.
- Run `pnpm run test:studio`.
- Run `pnpm run build:studio`.
- Run `pnpm run test:desktop`.
- Run `pnpm run clippy:desktop`.
- Run `pnpm --filter hop-desktop tauri build --debug --bundles app` when time and platform dependencies allow.

## Rollback notes

Revert the submodule pointer to `0fb3e6758b8ad11d2f3c3849c83b914684e83863`, restore `@rhwp/core` and the native `rhwp` lockfile entry to `0.7.9`, and revert the HOP override compatibility edits.
