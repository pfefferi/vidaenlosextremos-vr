# Agent Instructions

> **This project is part of the Antigravity workspace.**
> All agent rules, skills, and context live in the central workspace brain.

## Read the brain first

Before doing anything, read the workspace rules file:

📍 **Absolute path**: `d:\Antigravity\.antigravity\rules.md`
📍 **Relative path** (from `projects/`): `..\..\..antigravity\rules.md`

That file is the single source of truth. It defines:
- Your identity and role
- The 3-layer architecture (directive → orchestration → execution)
- Artifact-first protocol
- Operating principles and self-annealing
- Prompt optimization workflow
- Skills discovery (shared skill library at `d:\Antigravity\.antigravity\skills\`)
- Coding conventions (at `d:\Antigravity\.antigravity\context\coding_style.md`)
- Capability scopes and permissions

## Workspace mission

See `d:\Antigravity\mission.md` for the full project list and high-level goals.

## Key rule

**Never duplicate the brain.** If you need to update agent behavior, edit `d:\Antigravity\.antigravity\rules.md` — not this file. This file is just a pointer.
