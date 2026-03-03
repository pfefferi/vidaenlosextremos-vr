# Changelog
2: 
3: ## [2026-03-03] HUD & UI Refinement (Post-Audit)
4: - **Fix**: Resolved HUD mission counter localization race condition by making `initSystem` async and awaiting localization.
5: - **UI**: Repositioned mission counter to the side of the hamburger button within the `.top-right-ctrls` flex container.
6: - **UX**: Standardized control grid spacing with a unified 10px horizontal/vertical gap.
7: - **Cleanup**: Removed legacy inline margins and redundant internal grids from the interaction UI.
8: 

## [2026-03-03] Waypoint Missions & Gamification
- **Visuals**: Implemented 3D beacons for distant waypoints, featuring semi-transparent vertical light beams and animated sonar pulse rings.
- **Mission System**: Added a persistent HUD counter tracking analyzed samples with a "MISSION COMPLETE" state.
- **Behavior**: Implemented proximity-based logic that transforms active beacons into rotating octahedrons within 2.0m.
- **Persistence**: Waypoints now permanently retain their "visited" state (green color and octahedron shape) after scanning.
- **User Preference**: Added a "Mission Mode" toggle in the sidebar to freely show/hide all gamified visuals and the HUD.

## [2026-03-03] Localization & UI Refinement
- **Feature**: Integrated a full localization system supporting English (EN) and Spanish (ES) across all UI, menus, and waypoint content.
- **UI Architecture**: Consolidated separate habitat files into a unified, data-driven `habitat.html`.
- **Explore Button**: Enhanced the scan/explore button with a brand-blue (beacon) accent, improved legibility, and state-based animations (hint pulse and success click).
- **HUD Fixes**: Moved the mission counter to prevent overlap with the sidebar; resolved initialization race conditions ensuring translations are ready before UI injection.
- **Grid Layout**: Tightened the interaction control grid by shifting from `1fr` to `auto` columns for better alignment.

## [2026-02-27] Waypoint Modal Redesign
- **UI**: Implemented a premium glassmorphism aesthetic for the waypoint modal (Logbook).
- **Visuals**: Added `backdrop-filter` blur, semi-transparent dark backgrounds, and smooth scale-up animations.
- **Icons**: Replaced hardcoded close button with the project's standard SVG `#icon-close`.
- **Parity**: Applied updates across all habitat files (`whale_fall.html`, `clam_bed.html`) and consolidated logic in `rov-modal.js`.

## [2026-02-27] Camera Controls & Consolidation
- **Fix**: Re-implemented Mouse Drag camera controls (left-click + drag).
- **Refactor**: Consolidated rotation logic from keyboard, gamepad, and touch into `ROV.actions.look()`.
- **Standardization**: Unified sensitivity handling and rotation limits across all input types.
- **Optimization**: Renamed `initTouchRotation` to `initRotationControls` to reflect multi-input support.

## [2026-02-27] UI Polish & Control Refinement
- **Layout**: Restructured bottom-right control grid into 4 columns; added explicit "Reset Position" and "Toggle Lights" controls.
- **Controls Overlay**: Implemented Gamepad and Keyboard input view parity with dynamic footer hints.
- **Mapping PARITY**: Added Select button mapping for tab switching in the controls overlay.
- **Remaps**: Updated keyboard shortcuts for better ergonomics (Shift to descend, F for lights).
- **HUD Fixes**: Repositioned top-left controls to only show the HUD toggle; integrated hamburger menu with the `hidable` class.
- **Visuals**: Unified HUD and label fonts to 'Inter'; improved SVG icon centering and sizing consistency.
- **Sidebar**: Added a functional close button to the mission navigation sidebar.

## [2026-02-26] CSS Architecture Refinement
- **Standardization**: Implemented modular components for D-pad (`.d-pad`) and Telemetry (`.telemetry-grid`).
- **Layout**: Replaced ad-hoc positioning with standardized Flexbox and CSS Grid structures.
- **Typography**: Simplified font stack to 'Inter' for a cleaner and more professional look.
- **Maintenance**: Consolidated layout utilities in `base.css` and `components.css`.

## [2026-02-26] CSS Refactoring & Modularization
- **Refactor**: Split gargantuan CSS files into modular units: `variables.css`, `base.css`, and `components.css`.
- **Cleanup**: Removed redundant variables and base styles from `menu-styles.css` and `rov-core.css`.
- **Optimization**: Standardized design tokens and glassmorphism utilities across the project.
- **Integration**: Updated `index.html`, `whale_fall.html`, and `clam_bed.html` to use the new modular CSS architecture.

## [2026-02-26] Controls UI & Standardization
- **Feature**: Implemented a modern, glassmorphism Controls UI overlay with Gamepad and Keyboard mappings.
- **Toggle**: Integrated 'Esc' key and a new help icon in the HUD to toggle the overlay.
- **Parity**: Standardized Clam Bed habitat (fixed missing Modal UI, injected centralized icons).
- **Automation**: Integrated version tracking into the deployment workflow.

## [2026-02-26] Project Audit & Re-focus
- Conducted deep file-by-file audit of the entire project.
- Identified UI/HUD inconsistencies and missing habitat files.
- Re-focused development on refining the "Whale Fall" reference habitat.
- **Rules Update**: Established explicit Git Mandate in `PROJECT.md` requiring automatic commit/push on task completion.

## [2026-02-26] Project initialized
- Established standardized Antigravity context files (`PROJECT.md`, `CHANGELOG.md`, `LESSONS.md`).
- Integrated project into the workspace `mission.md`.
- Verified project architecture and tech stack (A-Frame VR).
