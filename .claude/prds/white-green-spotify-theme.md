---
name: white-green-spotify-theme
description: Transform the music app UI to a white and green Spotify-inspired theme with clean aesthetics and modern design patterns
status: backlog
created: 2025-11-17T21:43:22Z
---

# PRD: White & Green Spotify Theme

## Executive Summary

Transform the Doit Music application from its current blue-themed design system to a clean, modern white and green color scheme inspired by Spotify's iconic brand aesthetic. This redesign will provide users with a familiar, professional music streaming experience while maintaining the application's existing functionality and responsive design principles.

The theme transformation will update all color variables, component styling, and visual elements to align with Spotify's recognizable palette: vibrant green (#1DB954) as the primary action color, clean white backgrounds, and sophisticated dark text hierarchy.

## Problem Statement

### Current State
The music application currently uses a blue-centric design system with:
- Primary blue color (#2563eb) for all interactive elements
- Purple accent colors (#8b5cf6) for special UI elements
- Generic white/gray neutral palette
- Design system that doesn't leverage music industry visual conventions

### Problem
Users familiar with popular music streaming platforms (especially Spotify) expect a specific visual language that signals "music application." The current blue theme:
1. **Lacks brand recognition** - Doesn't align with established music streaming aesthetics
2. **Misses emotional connection** - Blue conveys stability/trust, but green represents energy/freshness more appropriate for music discovery
3. **No visual differentiation** - Looks like a generic web app rather than a specialized music platform
4. **User confusion** - New users may not immediately recognize it as a music app

### Why Now?
- Music streaming has established visual conventions (Spotify's green is instantly recognizable)
- Users spend significant time in music apps and expect familiar, comfortable interfaces
- Brand identity matters for user retention and app recognition
- Current design system is well-structured with CSS variables, making theme migration straightforward

## User Stories

### Primary Personas

**Persona 1: The Daily Listener (Sarah, 28, Marketing Manager)**
- Uses music apps 3-4 hours daily during work
- Switches between multiple music platforms
- Values familiar, intuitive interfaces
- Wants minimal friction when navigating music libraries

**Persona 2: The Playlist Curator (Mike, 22, College Student)**
- Creates and shares playlists regularly
- Discovers new music frequently
- Appreciates modern, clean aesthetics
- Active on social media sharing music

**Persona 3: The Casual User (Jennifer, 45, Teacher)**
- Listens to music occasionally
- Prefers simple, recognizable interfaces
- Not tech-savvy, relies on visual cues
- Values clarity over complexity

### Detailed User Stories

#### Story 1: Instant Recognition
**As a** daily listener who uses multiple music apps,
**I want** the interface to use familiar music app colors (green/white),
**So that** I immediately recognize it as a music platform and feel comfortable navigating it.

**Acceptance Criteria:**
- [ ] Primary action buttons use Spotify green (#1DB954)
- [ ] Background is clean white (#FFFFFF)
- [ ] Hover states use lighter green (#1ED760)
- [ ] Visual hierarchy matches music streaming conventions
- [ ] Icons and controls feel familiar to Spotify users

**Priority:** HIGH
**Effort:** Medium (2-3 days)

#### Story 2: Clear Interactive Elements
**As a** playlist curator frequently clicking buttons,
**I want** all interactive elements (play buttons, action buttons, links) to stand out with vibrant green,
**So that** I can quickly identify what's clickable and take actions efficiently.

**Acceptance Criteria:**
- [ ] All play/pause buttons use green (#1DB954)
- [ ] Active navigation items highlighted in green
- [ ] Hover states provide clear feedback with green tint
- [ ] Focus states maintain accessibility with green outlines
- [ ] Currently playing track indicators use green

**Priority:** HIGH
**Effort:** Medium (2-3 days)

#### Story 3: Comfortable Reading Experience
**As a** user browsing track lists and artist names,
**I want** text to be highly readable against white backgrounds,
**So that** I can easily scan and find music without eye strain.

**Acceptance Criteria:**
- [ ] Primary text is dark (#191414 - Spotify's near-black)
- [ ] Secondary text has reduced opacity for hierarchy (#535353)
- [ ] Text maintains 4.5:1 contrast ratio (WCAG AA)
- [ ] Font weights create clear visual hierarchy
- [ ] Metadata text is distinguishable but not distracting

**Priority:** HIGH
**Effort:** Low (1 day)

#### Story 4: Sophisticated Component Styling
**As a** user interacting with cards, modals, and menus,
**I want** components to have subtle, elegant styling,
**So that** the interface feels premium and modern.

**Acceptance Criteria:**
- [ ] Cards use subtle shadows (not heavy elevation)
- [ ] Borders are light gray (#E0E0E0) not prominent
- [ ] Hover effects are smooth and green-tinted
- [ ] Components feel cohesive with overall theme
- [ ] Surface colors maintain subtle contrast

**Priority:** MEDIUM
**Effort:** Medium (2 days)

#### Story 5: Consistent Music Player Controls
**As a** user controlling music playback,
**I want** the music player to use iconic green controls,
**So that** it feels like a professional music streaming app.

**Acceptance Criteria:**
- [ ] Play/pause button is vibrant green circular button
- [ ] Progress bar uses green for playback position
- [ ] Volume slider uses green for fill color
- [ ] Control icons are clear and recognizable
- [ ] Active states clearly indicate player status

**Priority:** HIGH
**Effort:** Medium (2 days)

#### Story 6: Mobile-Responsive Green Theme
**As a** mobile user,
**I want** the green theme to work perfectly on small screens,
**So that** I have the same premium experience on any device.

**Acceptance Criteria:**
- [ ] Green buttons meet 44x44px touch target minimum
- [ ] Colors maintain contrast on all screen sizes
- [ ] Responsive breakpoints preserve theme consistency
- [ ] Mobile navigation uses green active states
- [ ] Player controls remain usable on small screens

**Priority:** HIGH
**Effort:** Low (1 day)

## Requirements

### Functional Requirements

#### FR1: CSS Variable System Update
- Replace all blue color variables with green equivalents
- Update primary, secondary, and accent color definitions
- Maintain existing variable naming convention for consistency
- Preserve design system structure and organization

#### FR2: Component Color Migration
- Update all components using primary colors to use green
- Modify hover states to use lighter green (#1ED760)
- Adjust focus states to maintain accessibility
- Update active/selected states across all components

#### FR3: Text Color Hierarchy
- Implement Spotify's text color system (#191414, #535353, #B3B3B3)
- Update all text elements to use new neutral palette
- Maintain clear visual hierarchy with font weights and opacity

#### FR4: Background System
- Set primary background to pure white (#FFFFFF)
- Use light gray surfaces (#F6F6F6) for subtle elevation
- Maintain card/component backgrounds for depth

#### FR5: Music Player Styling
- Update player controls to use green as primary color
- Modify progress bars to use green fill
- Update volume controls with green indicators
- Ensure all interactive elements follow green theme

#### FR6: Navigation & Sidebar
- Update active navigation states to use green
- Modify sidebar hover effects to use green tint
- Update selected playlist indicators
- Maintain sidebar contrast and readability

### Non-Functional Requirements

#### NFR1: Performance
- **Target:** Theme changes must not impact page load time
- **Metric:** First Contentful Paint remains under 1.2s
- **Implementation:** CSS variable updates only, no additional assets
- **Validation:** Lighthouse performance score stays above 90

#### NFR2: Accessibility (WCAG 2.1 AA Compliance)
- **Contrast Ratio:** All text maintains minimum 4.5:1 contrast
- **Color Independence:** Information not conveyed by color alone
- **Focus Indicators:** Green focus states with 3:1 contrast minimum
- **Touch Targets:** Mobile buttons minimum 44x44px
- **Screen Reader:** No changes to semantic HTML or ARIA labels

#### NFR3: Browser Compatibility
- **Support:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **CSS Variables:** All browsers support CSS custom properties
- **Fallbacks:** Not required (modern browser assumption)
- **Testing:** Visual regression testing on all supported browsers

#### NFR4: Design Consistency
- **Spacing:** Maintain existing 8px grid system
- **Typography:** Preserve font sizes and line heights
- **Shadows:** Keep existing elevation system
- **Animations:** Maintain current transition durations

#### NFR5: Maintainability
- **Documentation:** Update design system comments in CSS
- **Variable Naming:** Keep consistent naming conventions
- **Code Organization:** Maintain existing CSS file structure
- **Version Control:** Atomic commits for each component update

#### NFR6: Responsive Design
- **Mobile-First:** Theme works across all breakpoints (320px - 1920px)
- **Breakpoints:** Maintain existing responsive breakpoints
- **Touch-Friendly:** All green buttons meet mobile touch standards
- **Viewport Testing:** Test on iPhone SE, iPad, desktop (1920x1080)

## Success Criteria

### Primary Metrics

1. **Visual Consistency Score: 100%**
   - Measurement: Manual audit of all components
   - Target: Zero instances of old blue colors in UI
   - Validation: Visual regression testing screenshots

2. **User Recognition Rate: 85%+**
   - Measurement: User survey "What type of app is this?"
   - Target: 85% of users identify as "music app" within 5 seconds
   - Method: 5-second test with new users

3. **Accessibility Compliance: WCAG AA**
   - Measurement: Automated WAVE/axe testing
   - Target: Zero contrast failures
   - Validation: Manual keyboard navigation testing

4. **Performance Impact: 0%**
   - Measurement: Lighthouse scores before/after
   - Target: No degradation in performance metrics
   - Validation: Load time, FCP, LCP unchanged

### Secondary Metrics

5. **Developer Velocity**
   - Time to theme completion: ≤ 5 days
   - Lines of CSS changed: ~200-300 lines
   - Components requiring updates: ~15-20

6. **Zero Regressions**
   - All existing functionality works identically
   - No broken layouts or misaligned elements
   - Responsive behavior unchanged

## Technical Approach

### Implementation Strategy

#### Phase 1: CSS Variable Foundation (Day 1)
1. **Update globals.css color variables**
   ```css
   /* Primary Colors - Spotify Green */
   --primary: #1DB954;              /* Spotify Green */
   --primary-dark: #1AA34A;         /* Darker green for emphasis */
   --primary-light: #1ED760;        /* Lighter green for hover */
   --primary-hover: #1ED760;        /* Hover state */
   ```

2. **Update neutral color system**
   ```css
   /* Neutral Colors - Spotify Palette */
   --dark: #191414;                 /* Spotify near-black */
   --text-primary: #191414;         /* Primary text */
   --text-secondary: #535353;       /* Secondary text */
   --text-tertiary: #B3B3B3;        /* Metadata */
   --background: #FFFFFF;           /* Pure white */
   --surface: #F6F6F6;              /* Subtle gray surface */
   --border: #E0E0E0;               /* Light borders */
   ```

3. **Update music app specific colors**
   ```css
   --now-playing-bg: #E8F5E9;       /* Light green tint */
   --track-hover: #F1F1F1;          /* Neutral hover */
   --player-bg: #FFFFFF;            /* White player */
   --control-active: #1DB954;       /* Green active state */
   ```

#### Phase 2: Component Updates (Days 2-3)

1. **MusicPlayer.tsx / MusicPlayer.module.css**
   - Update play/pause button to green circular design
   - Modify progress bar fill to use green
   - Update volume slider with green indicators
   - Adjust control icon colors for contrast

2. **TrackList.tsx / TrackList.module.css**
   - Update play button icons to green
   - Modify active track highlighting with green accent
   - Update hover states with subtle green tint
   - Adjust text colors for new neutral palette

3. **SearchBar.tsx / SearchBar.module.css**
   - Update focus states to green outline
   - Modify search icon color
   - Adjust dropdown result hover states
   - Update selected result highlighting

4. **Sidebar (in page.tsx / Sidebar.module.css)**
   - Update active navigation to green indicator
   - Modify hover states with green tint
   - Adjust playlist item hover effects
   - Update selected playlist highlighting

5. **page.tsx / page.module.css**
   - Update header background if needed
   - Modify section titles and accents
   - Adjust activity card styling
   - Update any remaining blue elements

#### Phase 3: Testing & Refinement (Day 4)

1. **Visual Regression Testing**
   - Screenshot comparison before/after
   - Check all components across breakpoints
   - Verify color consistency throughout app

2. **Accessibility Testing**
   - Run WAVE and axe DevTools
   - Manual keyboard navigation testing
   - Contrast ratio validation for all text
   - Focus indicator visibility checks

3. **Cross-Browser Testing**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers (iOS Safari, Chrome Mobile)
   - Tablet responsive behavior

4. **Performance Validation**
   - Lighthouse audits before/after
   - Load time comparison
   - Render performance checks

#### Phase 4: Polish & Documentation (Day 5)

1. **Fine-Tuning**
   - Adjust any contrast issues
   - Polish hover/active state transitions
   - Ensure consistent spacing and alignment
   - Verify icon colors and sizes

2. **Documentation Updates**
   - Update CSS comments with new color purpose
   - Document green color palette rationale
   - Add design system guidelines
   - Create before/after visual comparison

3. **Code Review & Cleanup**
   - Remove any unused blue color references
   - Consolidate redundant CSS rules
   - Ensure code quality and maintainability

### Technical Considerations

#### Design Tokens
- Leverage existing CSS variable architecture
- No need to change variable names (semantic naming preserved)
- Values updated to green/white palette
- Maintain backward compatibility with component styles

#### Component Architecture
- No structural changes to React components
- Only CSS/styling updates required
- Preserve existing props and functionality
- Maintain current responsive breakpoints

#### State Management
- No changes to state logic
- Visual updates only affect styling layer
- Player functionality remains identical
- Search, playlist, track selection unchanged

#### Build & Deployment
- No build process changes required
- CSS updates only (no new dependencies)
- Can be deployed atomically
- Instant rollback by reverting CSS changes

## Constraints & Assumptions

### Constraints

1. **Technical Constraints**
   - Must use existing CSS variable system (no CSS-in-JS migration)
   - Cannot introduce new dependencies or frameworks
   - Must maintain current React component structure
   - Browser support limited to modern evergreen browsers

2. **Design Constraints**
   - Cannot use actual Spotify logos or trademarked assets
   - Color inspiration only, not exact brand replication
   - Must maintain existing spacing/layout system
   - Cannot change font family (licensing considerations)

3. **Timeline Constraints**
   - Must be completed within 5 days
   - Single developer implementation
   - No designer resources available
   - Self-review process only

4. **Resource Constraints**
   - No budget for paid design tools or assets
   - No user testing budget
   - Limited QA resources (manual testing only)
   - No dedicated accessibility expert review

### Assumptions

1. **User Assumptions**
   - Users are familiar with Spotify's visual identity
   - Users prefer recognizable music app aesthetics
   - Color preference for green over blue in music context
   - Users value familiarity and convention

2. **Technical Assumptions**
   - Current CSS variable system is comprehensive
   - All colors are properly abstracted via variables
   - No hardcoded color values in components
   - Existing design system is well-structured

3. **Business Assumptions**
   - Green theme aligns with product strategy
   - No legal concerns with Spotify-inspired palette
   - Stakeholders approve of visual direction
   - Theme change doesn't require user notification

4. **Performance Assumptions**
   - CSS variable updates have negligible performance impact
   - No bundle size increase from theme changes
   - Browser paint performance unaffected
   - Existing optimization strategies remain valid

## Out of Scope

### Explicitly NOT Included

1. **Dark Mode Implementation**
   - Dark theme with black backgrounds and inverted colors
   - Theme toggle functionality
   - Separate dark color palette
   - System preference detection
   - **Rationale:** Separate feature requiring additional complexity

2. **Logo/Branding Changes**
   - New app logo design
   - Spotify logo usage (trademark concerns)
   - Icon set replacement
   - Custom illustration assets
   - **Rationale:** Legal and resource constraints

3. **Typography Changes**
   - Font family updates (e.g., Circular Spotify font)
   - Font size adjustments
   - Line height modifications
   - Letter spacing changes
   - **Rationale:** Current typography system works well

4. **Layout Restructuring**
   - Sidebar width changes
   - Component positioning modifications
   - Grid system updates
   - Responsive breakpoint adjustments
   - **Rationale:** Scope limited to color/theme only

5. **New Features**
   - Additional player controls
   - New navigation items
   - Extra playlist functionality
   - Social features
   - **Rationale:** Theme update only, no feature additions

6. **Animation Enhancements**
   - New transition effects
   - Loading animations
   - Micro-interactions
   - Gesture-based animations
   - **Rationale:** Animation system already sufficient

7. **Backend Changes**
   - Theme persistence/storage
   - User preference API
   - Theme selection endpoints
   - Database schema updates
   - **Rationale:** Frontend-only update

8. **Multi-Theme System**
   - Theme switching infrastructure
   - Multiple color palette options
   - Theme builder/customizer
   - Theme marketplace
   - **Rationale:** Single theme replacement only

## Dependencies

### External Dependencies

1. **Browser Support**
   - CSS Custom Properties (CSS Variables) support
   - Modern CSS features (flexbox, grid already in use)
   - No polyfills required for target browsers
   - **Risk:** Low - modern browser assumption valid

2. **Design References**
   - Spotify web player for color reference
   - Public Spotify brand guidelines
   - Community design resources
   - **Risk:** Low - widely available resources

### Internal Dependencies

1. **Code Dependencies**
   - Existing globals.css design system
   - Component-level CSS modules
   - Current React component architecture
   - **Risk:** Low - all dependencies under team control

2. **Team Dependencies**
   - Developer availability (5 consecutive days)
   - Code review from team member
   - QA testing resources
   - **Risk:** Medium - scheduling coordination needed

3. **Tooling Dependencies**
   - Version control (Git)
   - Development server
   - Browser DevTools for testing
   - Visual regression testing tools (optional)
   - **Risk:** Low - standard development environment

### No Dependencies On

- Design team availability
- Backend API changes
- Third-party service integrations
- User data migrations
- Mobile app updates (web-only)

## Migration Path

### Rollout Strategy

1. **Development Phase (Days 1-5)**
   - Implement changes in feature branch
   - Local testing and refinement
   - Visual documentation of changes

2. **Review Phase (Day 6)**
   - Code review by peer
   - Accessibility audit
   - Cross-browser testing
   - Performance validation

3. **Staging Deployment (Day 7)**
   - Deploy to staging environment
   - Team review and feedback
   - Final adjustments if needed

4. **Production Deployment (Day 8)**
   - Deploy during low-traffic window
   - Monitor error logs and user feedback
   - Immediate rollback capability if issues arise

### Rollback Plan

- **Trigger Conditions:**
  - Critical accessibility failures
  - Performance degradation >10%
  - Browser compatibility issues
  - User confusion/negative feedback spike

- **Rollback Process:**
  1. Revert Git commit to previous stable version
  2. Rebuild and deploy previous CSS
  3. Monitor for return to baseline metrics
  4. Document issues for future attempt

## Appendix

### Color Palette Reference

#### Spotify-Inspired Green Palette
```css
/* Primary Green */
#1DB954 - Spotify Brand Green (primary actions, buttons, active states)
#1ED760 - Light Green (hover states, highlights)
#1AA34A - Dark Green (pressed states, emphasis)
#169C46 - Darker Green (borders, subtle accents)

/* Success/Positive States */
#1DB954 - Matches primary for consistency

/* Background Greens (Light Tints) */
#E8F5E9 - Very light green (now playing background, subtle highlights)
#F1F8F4 - Barely green white (subtle surfaces)
```

#### Neutral Palette
```css
/* Text Colors */
#191414 - Near Black (primary text, headings)
#535353 - Medium Gray (secondary text, metadata)
#B3B3B3 - Light Gray (tertiary text, placeholders)
#FFFFFF - White (text on dark surfaces)

/* Background Colors */
#FFFFFF - Pure White (main background)
#F6F6F6 - Light Gray (surface, cards)
#E0E0E0 - Border Gray (dividers, borders)
```

### Component Mapping

| Component | Primary Updates | Priority |
|-----------|----------------|----------|
| MusicPlayer | Play button, progress bar, controls | HIGH |
| TrackList | Play icons, active states, hover | HIGH |
| SearchBar | Focus outline, result hover | MEDIUM |
| Sidebar | Active nav, playlist hover | HIGH |
| NowPlaying | Background tint, accent color | MEDIUM |
| Buttons | All primary buttons to green | HIGH |

### Testing Checklist

- [ ] All text meets WCAG AA contrast (4.5:1)
- [ ] Green buttons visible to colorblind users
- [ ] Focus indicators meet 3:1 contrast
- [ ] Mobile touch targets ≥44x44px
- [ ] Hover states work on all interactive elements
- [ ] Active states clearly indicate selection
- [ ] Keyboard navigation works throughout
- [ ] Screen reader testing (basic)
- [ ] Cross-browser visual consistency
- [ ] Responsive behavior on mobile/tablet/desktop
- [ ] Performance metrics unchanged
- [ ] No console errors or warnings

### References

- Spotify Design System (public resources)
- Material Design color guidelines
- WCAG 2.1 Accessibility Standards
- CSS Variables MDN Documentation
- Color contrast checking tools (WebAIM, Colorable)

---

**Document Version:** 1.0
**Last Updated:** 2025-11-17
**Author:** Product Manager
**Status:** Ready for implementation
