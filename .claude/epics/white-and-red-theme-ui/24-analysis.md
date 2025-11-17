---
issue: 24
title: Apply Theme to NowPlaying Component
analyzed: 2025-11-17T20:54:11Z
estimated_hours: 1.75
parallelization_factor: 1.3
---

# Parallel Work Analysis: Issue #24

## Overview
Refactor the NowPlaying component to use the white and red theme system with white card surface, red active indicator, and proper text contrast.

## Parallel Streams

### Stream A: Component JSX/TSX Refactor
**Scope**: Update className strings and JSX for white card surface, red active indicators
**Files**:
- `components/NowPlaying.tsx`
**Agent Type**: frontend-specialist
**Can Start**: immediately (after task 23 completes)
**Estimated Hours**: 1.0
**Dependencies**: Task 23 (MusicPlayer themed)

### Stream B: Module CSS Refactor
**Scope**: Modify CSS module for elevation shadows, active/inactive states, transitions
**Files**:
- `components/NowPlaying.module.css`
**Agent Type**: frontend-specialist
**Can Start**: immediately (after task 23 completes)
**Estimated Hours**: 0.5
**Dependencies**: Task 23 (MusicPlayer themed)

### Stream C: Accessibility & Testing
**Scope**: Verify WCAG AA text contrast, test active/inactive transitions, visual verification
**Files**:
- Manual testing and accessibility checks
**Agent Type**: frontend-specialist
**Can Start**: after Streams A & B complete
**Estimated Hours**: 0.25
**Dependencies**: Streams A & B

## Coordination Points

### Shared Files
No direct conflicts - streams work on different files:
- Stream A: `NowPlaying.tsx`
- Stream B: `NowPlaying.module.css`
- Coordination needed on class names and state indicators

### Sequential Requirements
1. Task 23 must be complete to establish theming pattern
2. Both component and CSS updates complete before testing
3. Accessibility verification must happen after visual implementation

## Conflict Risk Assessment
- **Low Risk**: Component file and CSS module file are separate
- **Integration risk**: Moderate - need to ensure active/inactive state styles match component logic
- **Recommended**: Coordinate on class naming for active track indicator

## Parallelization Strategy

**Recommended Approach**: hybrid

Launch Streams A and B simultaneously. Coordinate on the approach for active track indicator styling (e.g., `isActive` class, data attribute, etc.). Complete Stream C after integration.

## Expected Timeline

With parallel execution:
- Wall time: 1.35 hours (max of A/B: 1.0h + C: 0.25h + coordination: 0.1h)
- Total work: 1.75 hours
- Efficiency gain: 23%

Without parallel execution:
- Wall time: 1.75 hours

## Notes
- Similar structure to task 23 (MusicPlayer component)
- Conflicts with tasks 23, 25, 26, 27 - don't run simultaneously
- Benefits from established pattern in task 23
- Focus on visual distinction between active/inactive tracks
- Card elevation and shadows add visual complexity
- Text contrast verification is critical for accessibility
