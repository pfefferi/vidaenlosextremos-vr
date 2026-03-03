# Lessons Learned

## [Architecture] Habitat Drift
**Problem**: Multiple HTML entry points (`whale_fall.html`, `clam_bed.html`) started to diverge, with some missing core UI structures (modals, systems) present in others.
**Solution**: Centralize shared UI components (like SVG icons) and use the primary habitat as a strict template for others.
**Rule**: Always verify structural parity across all habitat files when updating core systems.

## [Environment] PowerShell Execution Policy
**Problem**: Running local `.ps1` scripts can be blocked by the Windows default execution policy (`UnauthorizedAccess`).
**Solution**: Run scripts using `powershell -ExecutionPolicy Bypass -File [path]`.
**Rule**: Use the bypass flag for all automated build/sync scripts to ensure cross-agent reliability.
## [UX] Control Grid Flexibility
**Problem**: Stiff 3-column layouts for ROV controls were becoming cluttered and making it difficult to find specific status-reset actions.
**Solution**: Expand the grid to 4 columns, using the 4th column for auxiliary "system" actions (Reset, Lights) without a header label to reduce cognitive load.
**Rule**: Use sparse columns for secondary actions to maintain visual hierarchy.

## [UI] Dynamic Control Hints
**Problem**: The Controls Overlay footer hint was static (showing only Keyboard 'TAB'), which was confusing for Gamepad users.
**Solution**: Use a shared `id` (e.g., `switch-key`) and dynamic JavaScript logic to swap the element's content between a text label (TAB) and an SVG icon (Select button) when the input mode changes.
**Rule**: Always provide context-aware input hints in shared overlays.

## [UI] Grid Synchronization
**Problem**: Mixed use of `gap` and ad-hoc `margin` resulted in inconsistent and "waay too spaced" control layouts.
**Solution**: Establish a shared design token for gaps (10px) and apply it to both grid and flex-column utilities while purging inline overrides.
**Rule**: Always use the container `gap` property for spacing between interactive elements; avoid element-specific margins.

## [Logic] Initialization Race Conditions
**Problem**: UI elements using manual translation logic (`ROV.localization.t`) were failing when initialized before the fetch of locale files completed.
**Solution**: Use `async/await` for the localization initialization and prefer `data-i18n` attributes which can be re-triggered via `updateDOM()`.
**Rule**: Critical UI systems must await localization readiness before rendering strings.
