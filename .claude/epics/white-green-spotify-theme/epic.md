---
name: white-green-spotify-theme
status: backlog
created: 2025-11-17T21:47:04Z
progress: 0%
prd: .claude/prds/white-green-spotify-theme.md
github: https://github.com/varunisrani/sdjd2/issues/30
---

# Epic: White & Green Spotify Theme

## Overview

Transform the Doit Music application from its current blue theme to a clean, modern white and green Spotify-inspired design. This is a CSS-only refactoring that leverages the existing CSS variable architecture to replace all blue colors with Spotify's iconic green (#1DB954) while maintaining white backgrounds and a sophisticated neutral text hierarchy.

The implementation will update approximately 15-20 CSS files (globals.css and component modules) to achieve visual consistency across the entire application without touching any React component logic or functionality.

## Architecture Decisions

### 1. CSS Variable-Based Theming (CHOSEN APPROACH)
**Decision:** Use existing CSS custom properties in globals.css as single source of truth for all color values.

**Rationale:**
- Already implemented and working across all components
- Atomic changes - update variables once, cascade everywhere
- Instant rollback capability by reverting one file
- No component refactoring required
- Zero runtime performance impact
- Maintains existing design system structure

**Alternative Rejected:** Component-level inline styles or CSS-in-JS
- Would require touching 15+ React components
- Higher risk of inconsistency and bugs
- More complex rollback process
- No architectural benefit for color-only changes

### 2. Mobile-First Responsive Approach (MAINTAINED)
**Decision:** Preserve existing mobile-first responsive design patterns and breakpoints.

**Rationale:**
- Current responsive system already works well
- Theme changes don't affect layout or spacing
- Touch targets and mobile interactions remain unchanged
- Only color values need updating at each breakpoint

### 3. Accessibility-First Color Selection
**Decision:** All color combinations must meet WCAG AA contrast ratios (4.5:1 for text) before implementation.

**Rationale:**
- Non-negotiable requirement for production deployment
- Green on white can have contrast issues if not carefully selected
- Spotify's brand colors already tested for accessibility
- Using #191414 (near-black) instead of pure black for softer contrast

### 4. Zero-Dependency Implementation
**Decision:** Pure CSS updates only - no new packages, frameworks, or build tools.

**Rationale:**
- Minimal risk and deployment complexity
- No bundle size increase
- No new maintenance burden
- Fastest path to production

## Technical Approach

### Phase 1: CSS Variable Foundation
**Files:** `app/globals.css`
**Effort:** 2-3 hours

Update the core design system variables:

```css
/* Primary Colors - Spotify Green System */
--primary: #1DB954;              /* Main brand green */
--primary-dark: #1AA34A;         /* Emphasis/pressed states */
--primary-light: #1ED760;        /* Hover states */
--primary-hover: #1ED760;        /* Interactive hover */

/* Neutral Text Hierarchy */
--text-primary: #191414;         /* Headings, primary text */
--text-secondary: #535353;       /* Body text, metadata */
--text-tertiary: #B3B3B3;        /* Placeholders, hints */

/* Background System */
--background: #FFFFFF;           /* Main background */
--surface: #F6F6F6;              /* Cards, elevated surfaces */
--border: #E0E0E0;               /* Dividers, borders */

/* Music-Specific Colors */
--now-playing-bg: #E8F5E9;       /* Light green tint */
--track-hover: #F1F1F1;          /* Neutral hover */
--control-active: #1DB954;       /* Active player controls */
```

**Validation:** Run app and verify all components inherit new colors automatically.

### Phase 2: Component-Level Refinement
**Files:** Component `.module.css` files
**Effort:** 1-2 days

Fine-tune individual components where CSS variables aren't sufficient:

1. **MusicPlayer.module.css**
   - Play/pause button circular green design
   - Progress bar green fill
   - Volume slider green indicators
   - Control icon colors

2. **TrackList.module.css**
   - Play button icons to green
   - Active track green accent
   - Hover states with green tint
   - Text color hierarchy

3. **SearchBar.module.css**
   - Green focus outline
   - Result hover states
   - Selected item highlighting

4. **Sidebar.module.css** (in page.tsx)
   - Active navigation green indicator
   - Playlist hover effects
   - Selected playlist highlighting

5. **NowPlaying.module.css**
   - Background tint adjustment
   - Accent color updates

**Testing Strategy:** Test each component in isolation after updates, then integration test full app.

### Phase 3: Cross-Browser & Accessibility Testing
**Effort:** 4-6 hours

1. **Accessibility Validation**
   - Run WAVE and axe DevTools on all pages
   - Verify all text meets 4.5:1 contrast ratio
   - Test keyboard navigation with green focus indicators
   - Verify colorblind-friendly (green + text labels)

2. **Browser Testing**
   - Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
   - Mobile: iOS Safari, Chrome Mobile
   - Tablet responsive behavior

3. **Performance Validation**
   - Lighthouse audit before/after comparison
   - Verify FCP, LCP, and performance score unchanged
   - Check for any CSS rendering issues

### Phase 4: Polish & Documentation
**Effort:** 2-3 hours

1. **Visual Consistency Audit**
   - Screenshot all components before/after
   - Check for any remaining blue elements
   - Verify smooth hover/active transitions
   - Ensure icon colors match new theme

2. **Code Quality**
   - Remove unused blue color references
   - Update CSS comments with new color purposes
   - Ensure consistent code formatting

3. **Documentation**
   - Update design system comments
   - Document color palette rationale
   - Create visual comparison for team

## Implementation Strategy

### Development Workflow
1. Create feature branch: `feat/white-green-spotify-theme`
2. Start with globals.css (immediate visual feedback)
3. Iterate through components alphabetically
4. Commit atomically per component
5. Run accessibility checks after each phase
6. Merge only when all tests pass

### Risk Mitigation
- **Risk:** Contrast failures
  - **Mitigation:** Pre-validate all colors with WebAIM contrast checker
- **Risk:** Missed blue elements
  - **Mitigation:** Global search for hex codes (#2563eb, #8b5cf6) before final commit
- **Risk:** Browser compatibility
  - **Mitigation:** Test on oldest supported browser versions first

### Rollback Plan
If critical issues arise post-deployment:
1. Revert Git commit to previous stable version
2. Rebuild and deploy (CSS-only, instant)
3. No data loss or functionality impact
4. Document issues for future retry

## Task Breakdown Preview

The implementation will be divided into these high-level task categories:

- [ ] **Foundation Setup** - Update globals.css CSS variables and verify cascade
- [ ] **Music Player Component** - Refactor player controls, progress bar, and volume slider
- [ ] **Track List Component** - Update play icons, active states, and hover effects
- [ ] **Search & Navigation** - Update SearchBar and Sidebar with green accents
- [ ] **Secondary Components** - Update NowPlaying and any remaining components
- [ ] **Accessibility Testing** - WCAG AA validation and keyboard navigation
- [ ] **Cross-Browser Testing** - Chrome, Firefox, Safari, Edge verification
- [ ] **Performance Validation** - Lighthouse audit and optimization
- [ ] **Visual QA & Polish** - Final consistency check and refinements
- [ ] **Documentation & Cleanup** - Update comments and create before/after comparison

**Total Estimated Tasks:** 10 tasks covering all implementation phases

## Dependencies

### External Dependencies
- **None** - No third-party libraries or services required
- Browser CSS variable support (already validated for modern browsers)

### Internal Dependencies
- Access to codebase and development environment
- Code review from team member (post-implementation)
- Staging environment for pre-production testing

### Prerequisite Work
- **Completed:** Mobile-responsive refactoring (Issues #2, #3, #7)
- **Completed:** Design system foundation (Issue #5)
- Current blue theme fully functional and stable

### Blocking Dependencies
- **None** - Can start immediately

## Success Criteria (Technical)

### 1. Visual Consistency
**Metric:** 100% color migration completion
- Zero instances of old blue colors (#2563eb, #8b5cf6) in UI
- All interactive elements use green (#1DB954)
- All backgrounds use white/light gray system
- Text hierarchy uses Spotify neutral palette

**Validation:** Manual visual audit + automated color search in codebase

### 2. Accessibility Compliance
**Metric:** WCAG 2.1 AA compliance
- All text meets 4.5:1 contrast ratio minimum
- Focus indicators meet 3:1 contrast ratio
- Color not sole indicator of information
- Keyboard navigation fully functional

**Validation:** WAVE, axe DevTools, manual keyboard testing

### 3. Performance Maintenance
**Metric:** Zero performance degradation
- Lighthouse performance score ≥90 (same as before)
- First Contentful Paint <1.2s
- Largest Contentful Paint <2.5s
- No increase in CSS bundle size

**Validation:** Lighthouse audit before/after comparison

### 4. Cross-Browser Consistency
**Metric:** Visual consistency across all supported browsers
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)
- No CSS rendering bugs or fallback issues

**Validation:** Manual testing on all target browsers

### 5. Code Quality
**Metric:** Clean, maintainable code
- No hardcoded color values in components
- CSS variable usage consistent
- Comments updated with new color purposes
- No unused CSS rules or dead code

**Validation:** Code review and static analysis

## Estimated Effort

### Timeline
- **Total Duration:** 3-5 days (single developer)
- **Phase 1:** 0.5 days (CSS variables)
- **Phase 2:** 1.5 days (component updates)
- **Phase 3:** 0.5 days (testing)
- **Phase 4:** 0.5 days (polish)
- **Buffer:** 1 day for unexpected issues

### Resource Requirements
- 1 Frontend Developer (full-time)
- 0.5 days Code Reviewer (peer review)
- 0.5 days QA Testing (manual testing)

### Critical Path
1. CSS variable foundation (blocks all other work)
2. Component updates (sequential, can be parallelized)
3. Accessibility testing (blocks deployment)
4. Final polish and documentation

### Deployment Window
- Low-risk change (CSS-only)
- Can deploy during normal hours
- Instant rollback available if needed
- No downtime required

## Notes

### Simplification Opportunities
- Leverage existing CSS variable cascade to minimize component-level changes
- Use browser DevTools to identify which components need manual updates vs automatic inheritance
- Batch similar component updates to reduce context switching
- Focus on the 20% of components that represent 80% of visual impact (MusicPlayer, TrackList, Sidebar)

### Existing Functionality Leverage
- Mobile-responsive breakpoints already defined - don't recreate
- Hover/active state logic already implemented - just change colors
- Accessibility markup (ARIA labels) already in place - don't modify
- Animation/transition timing already tuned - preserve existing values

### Efficiency Principles
- **Single source of truth:** globals.css variables control 80% of colors
- **Atomic commits:** One component per commit for easy rollback
- **Test early:** Accessibility checks after each phase, not at end
- **Visual feedback:** Run dev server continuously to see changes immediately

## Tasks Created
- [ ] #31 - Update CSS Variable Foundation (parallel: true)
- [ ] #32 - Refactor MusicPlayer Component Styling (parallel: false)
- [ ] #33 - Refactor TrackList Component Styling (parallel: true)
- [ ] #34 - Refactor SearchBar Component Styling (parallel: true)
- [ ] #35 - Refactor Sidebar Navigation Styling (parallel: true)
- [ ] #36 - Refactor NowPlaying Component Styling (parallel: true)
- [ ] #37 - Accessibility Testing and WCAG Validation (parallel: false)
- [ ] #38 - Cross-Browser and Performance Testing (parallel: true)
- [ ] #39 - Visual QA Polish and Documentation (parallel: false)

Total tasks: 9
Parallel tasks: 6
Sequential tasks: 3
