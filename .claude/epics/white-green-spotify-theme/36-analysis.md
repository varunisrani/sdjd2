---
issue: 36
title: Refactor NowPlaying Component Styling
analyzed: 2025-11-17T22:02:04Z
estimated_hours: 2
parallelization_factor: 1.0
---

# Parallel Work Analysis: Issue #36

## Overview
Update NowPlaying component CSS with light green background tint and green accent colors to match the Spotify theme, ensuring proper text contrast and visual hierarchy.

## Parallel Streams

### Stream A: NowPlaying Styling Update
**Scope**: Update all NowPlaying component styling including background tint and accent colors
**Files**:
- `components/NowPlaying.tsx`
- `components/NowPlaying.module.css`
**Agent Type**: frontend-specialist
**Can Start**: after Task 31 completes
**Estimated Hours**: 2
**Dependencies**: Task 31 (CSS variable foundation)

## Coordination Points

### Shared Files
None - NowPlaying component files are independent

### Sequential Requirements
1. Task 31 must complete first (CSS variable foundation)
2. Single stream completes all NowPlaying work

## Conflict Risk Assessment
- **Low Risk**: Completely separate component files from all other tasks
- No shared files with any other tasks
- Can run in parallel with Tasks 32, 33, 34, 35, 37

## Parallelization Strategy

**Recommended Approach**: sequential (single stream)

This is a small, focused task affecting one component. No internal parallelization benefit. However, can run in parallel with all other component tasks (32, 33, 34, 35, 37).

## Expected Timeline

With parallel execution:
- Wall time: 2 hours (after Task 31)
- Total work: 2 hours
- Efficiency gain: 0% (single stream)

Without parallel execution:
- Wall time: 2 hours (after Task 31)

## Notes
- Small component task (2 hours)
- Can run fully in parallel with all other component tasks (32, 33, 34, 35, 37)
- Light green background (#E8F5E9) provides subtle "now playing" indicator
- Text contrast critical on tinted background (WCAG AA required)
- Component typically shown in sidebar or footer
- Should complement but not compete with main player
- Contrast validation essential for all text on light green background
