# Project: vidaenlosextremos-vr

## Overview
A virtual reality experience titled "VIDA EN LOS EXTREMOS" (Life in the Extremes), documenting deep-sea expeditions from the R/V Falkor (too). It provides interactive 3D/VR dives into deep-sea habitats like Whale Falls and Clam Beds.

## Tech Stack
- **Framework**: [A-Frame](https://aframe.io/) (v1.4.2) for 3D/VR rendering.
- **Languages**: HTML5, Vanilla JavaScript (ES6+), Vanilla CSS.
- **Architecture**: Modular JavaScript structure with core systems, input handlers, and habitat-specific settings.
- **Assets**: 3D models (GLTF/GLB expected), textures, and immersive images.

## Environment
- **Local Dev**: Run via a simple static file server (e.g., `npx serve`, `Live Server`).
- **Dependencies**: Loaded via CDN (A-Frame, Google Fonts).

## Agent Rules (Project-Specific)
- **Auto-Pilot**: This project follows the global **Automated Workflow Protocol** defined in `d:\Antigravity\.antigravity\rules.md#11`. 
- **Git**: Automated commit/push for code changes; context files remain local only.
- **Whale Fall Priority**: Focus exclusively on the reference habitat refinement until instructed otherwise.

## Active Roadmap
- [x] Initial workspace project onboarding
- [x] Complete project deep audit
- [x] Refine Whale Fall (Performance, HUD, Waypoints)
- [x] Implement Premium Controls UI & Mapping Overlay
- [ ] Implement upcoming dive habitats (e.g., Giant Corals Bed) [PAUSED]
