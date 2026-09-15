# Responsive Layout Contract

This document is the current source of truth for the homepage responsive redesign.

## Layout Modes

- Below `1280px`: mobile layout.
- Mobile is one centered vertical column with natural page flow.
- At or above `1280px`: desktop layout.
- Desktop is a stable four-column by two-row jigsaw grid.
- The desktop column structure is:
  - Column 1: Hero / contribution graph.
  - Column 2: Experience / LeetCode.
  - Column 3: Projects / Codeforces.
  - Column 4: Live activity / Git archive.
- The mobile layout is already considered correct and must not be redesigned during the desktop refactor.

## Measured Baseline

These values were measured from the maximized browser with one tab bar. They are CSS viewport values, not screenshot pixel dimensions.

| Browser state | CSS viewport | Device pixel ratio | Current page scroll height | Current layout branch |
|---|---:|---:|---:|---|
| `100%` zoom | `1536 x 782` | `1.25` | `782` | Desktop, height lock active |
| `90%` zoom | `1707 x 869` | Not recorded | `869` | Desktop, height lock active |
| `80%` zoom | `1920 x 978` | `1` | `978` | Desktop, height lock active |
| `125%` zoom | `1229 x 626` | Not recorded | `1339` | Mobile, natural page scroll |
| Separate DevTools viewport | `1920 x 1080` | Separate test | Separate baseline | Desktop, separate test |

- The `1280px` boundary controls mobile versus desktop layout.
- The `768px` boundary currently controls page-scroll behavior only; it does not control mobile versus desktop layout.
- The `100%`, `90%`, and `80%` desktop states are all above the current `768px` page-scroll threshold.
- Their current `scrollHeight` matching the viewport height is a result of the desktop overflow lock, not proof that all content naturally fits.
- At `125%`, the CSS width becomes `1229px`, so the mobile branch correctly takes over and the document naturally scrolls.
- At `100%`, a physical-looking `1920px` display corresponds to `1536px` CSS width because the measured device pixel ratio is `1.25`.

## Desktop Canvas

- Desktop page scrolling is always natural, regardless of viewport height.
- There is no special `768px` height layout mode.
- Root, main, and section containers must not permanently lock the page with `overflow: hidden`.
- The desktop canvas has a derived maximum width based on the current ideal screenshot and codebase geometry.
- Above that maximum width, the complete grid remains unchanged and centered.
- Extra viewport width becomes surrounding whitespace rather than stretching individual regions indefinitely.
- The header and skill strip may remain full-width while the desktop grid canvas is centered.

## Grid Geometry

- Grid cells own the outer dimensions of their cards.
- Cards in the same row share equal outer heights to preserve the jigsaw alignment.
- The top row should visually appear approximately twice the height of the bottom row at the ideal desktop canvas.
- The ratio may use a robust layout method rather than a brittle exact `2fr/1fr` rule.
- Grid dimensions must not be driven by a discontinuous viewport-height breakpoint.
- The grid must remain stable on short screens; the page scrolls instead of compressing or clipping the puzzle.

## Card Contract

- A card fills its grid cell boundary.
- The card shell owns its border, shadow, padding, header, body, and footer.
- The header remains anchored at the top.
- The footer remains anchored at the bottom.
- The body receives the remaining space and has `min-height: 0` where needed.
- Content is packed into the available body region without awkward blank space after the content.
- Content must not distort typography, icons, media, or graph cells merely to fill spare space.
- Card overflow must be handled by the body that owns the content, not by clipping the entire card.

## Internal Overflow

- Experience content uses vertical internal scrolling when it exceeds its body region.
- Project content uses vertical internal scrolling when it exceeds its body region.
- Commit activity uses vertical internal scrolling when it exceeds its body region.
- The contribution graph uses horizontal internal scrolling when it exceeds its available width.
- LeetCode, Codeforces, and Git archive content should remain content-sized where possible and use internal scrolling only as a fallback.
- Internal scroll regions must remain inside their card boundaries.
- Media previews retain their aspect ratio and must not be geometrically distorted.
- The page itself remains naturally scrollable at every viewport height.

## Scaling

- Desktop scaling is bounded by the desktop canvas rather than expanded indefinitely for cinema-sized screens.
- Typography, spacing, controls, and card internals may scale within the bounded canvas where useful.
- Scaling must not create inconsistent proportions between the hero, graph, and fixed dashboard cards.
- Browser zoom is expected to change physical size; the invariant is structure, alignment, proportions, and overflow behavior.
- At `125%` zoom, the effective CSS viewport should transition cleanly to the mobile layout when it falls below `1280px`.

## Scope

- The implementation scope is the homepage desktop grid and the shared card primitives required by it.
- Projects, experience, and about routes must be regression-tested but are not being redesigned.
- Existing composition, colors, borders, hierarchy, and column placement are preserved.
- Loading states, API data arrival, animations, dark mode, reduced motion, and resizing must not change grid geometry unexpectedly.

## Implementation Order

1. Establish a baseline at the target widths, heights, and zoom levels.
2. Remove the `768px` height-driven layout and overflow locking.
3. Establish the bounded, centered desktop canvas.
4. Stabilize the four-column by two-row grid and visual row ratio.
5. Correct the card shell contract.
6. Correct content alignment inside each card body.
7. Implement axis-specific internal scrolling.
8. Make internal dimensions scale relative to their card or bounded canvas.
9. Verify zoom, resizing, loading, theme, motion, and route regressions.
10. Remove obsolete height-specific classes and stale layout helpers only after verification.

## Manual Verification Gates

Implementation pauses after every checkpoint. The next checkpoint does not begin until manual visual verification is approved.

1. Natural page flow: verify short and tall desktop heights scroll naturally.
2. Desktop canvas: verify the ideal viewport and a wider cinema-sized viewport remain centered and stable.
3. Grid geometry: verify column alignment, row proportions, and hero/graph placement.
4. Card shells: verify all desktop cards for stretching, clipping, borders, padding, and footer placement.
5. Content alignment: verify graph, statistic cards, experience, projects, and activity content placement.
6. Internal scrolling: manually test experience, projects, commits, and horizontal graph scrolling.
7. Scaling and zoom: manually verify `100%`, `90%`, `80%`, and `125%` zoom.
8. Final regression: verify target widths, heights, themes, loading states, reduced motion, resizing, and related routes.

## Acceptance Criteria

- Exactly two stable responsive modes exist: mobile single-column and desktop four-column/two-row.
- The desktop puzzle does not change structure at `768px` height.
- The page can scroll naturally at every viewport height.
- The desktop canvas stops growing beyond its maximum and centers on wide screens.
- Cards remain aligned to their grid cells without unexpected stretching or clipping.
- Content is packed within cards and scrolls internally only along its intended axis.
- The graph does not create page-wide horizontal overflow.
- Zoom changes physical scale but does not break composition or overflow behavior.
- Mobile remains visually and behaviorally correct below `1280px`.
