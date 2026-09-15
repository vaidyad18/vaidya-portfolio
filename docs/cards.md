# Mobile Card Deck Specification (Cinema Pass)

## 1. The Vision & Goal
The projects and experience sections on mobile are transformed into a physical, highly tactile "playing-card deck". This avoids standard scrolling and leans heavily into familiar smartphone gestures, providing a premium, native-app-like experience.

### Core Mechanics
- **Horizontal Axis (Swipe Left/Right):** Flips through cards within the current active category (Projects or Experience). The deck loops infinitely.
- **Vertical Axis (Swipe Up/Down):** Switches the active category (Projects ↔ Experience).

---

## 2. Interaction & Animation Requirements

- **The Entrance Trigger:** As the user scrolls down the page and the deck container becomes fully visible in the viewport, the deck performs a small "cardistry" shuffle animation and settles on the first Project card.
- **The Tutorial Overlay:** Immediately after the entrance, a subtle hover/overlay appears to teach the new mental model (e.g., "Swipe Down for Experience, Swipe Right for Next"). It dismisses upon the first interaction.
- **Swipe Physics (Realism):** 
  - When swiping right, the top card flies off and is added to the back of the deck.
  - As the top card is dragged, the underlying cards must "disturb" (subtle rotation/jostle based on drag velocity) to simulate physical weight and friction.
- **Deck Switch (Vertical):** Swiping down replaces the entire deck of Project cards with the Experience cards, accompanied by a fluid transition (e.g., old deck drops out, new deck springs up). This won't be a page scroll but deck will flip vertically to show exp deck.

---

## 3. Card Content Architecture

### Project Cards
Mirrors the desktop project drawer format:
Mirrors doesn't mean imitate px by px it means logically to have same sense to have design uniformity.The typography spacing style functions should be logically discussed then only adpated in mobile.
- Heading & Subheading exact same(literals) as the desktop
- Demo Video (Silent, auto-looping)
- "View Details" button will redirect to the /projects page 
  - **Expansion:** 
  - We won't implement the modal thing by clicking on the video because it will have animations and may hinder or fight
  rahter it will be triggered using yt button
  - it will full vertical screen modal
  - internally it will look like  yt ui
  - video modal opens
  - top video player 
  - profile subscribe like dislike share download
  - comments
  - modal will be internally scrollable
  - and have my other project's demo video stacked with webp thumbnail and title
  
  - The Static Shell (Server-First): Build the entire modal structure as a pure, non-interactive layout using min-h-[100dvh] and overflow-y-auto. Zero state, zero JavaScript, zero fixed heights.
  - The Brutalist Translation: Map the YouTube elements directly to your globals.css tokens. Action pills become sharp border-2 squares; spacing relies solely on gap-fluid-* and p-fluid-*; typography uses only text-h3, text-body, and text-caption.
  - Overflow Hardening: Enforce overscroll-behavior: contain on the modal wrapper and min-w-0 on every text container (title, comments) to guarantee it never causes horizontal scroll or page-bouncing.
  - The Client Boundary (Donut Pattern): Once the static design scales perfectly from 320px to 1279px, wrap it in a strict "use client" shell (e.g., ProjectModalEngine). This shell will solely handle the open/close state and the YouTube button trigger.
  - The Motion Pass: Finally, add the entrance animation exclusively to the client shell, ensuring it only uses transform/opacity and respects prefers-reduced-motion, so it can be ripped out in 5 minutes without touching the UI layout.

### Experience Cards
- See the current desktop exp children cards i want logically same.(The typography spacing style functions should be logically discussed then only adpated in mobile.)
- Organization Name
- exact same description(copy the same literals)
- Tools / Tech Stack used(same way as used in desktop)
- Certificate hyperlink(have it in button format placed in bottom left and bottom right)
- "View Details" button (i am not sure where to place this or how should we redirect to /exp page)

---

## 4. Navigation & Easter Eggs

- **Pagination:** Small dots located under the deck to indicate the current card's position and the total number of cards in the current deck.
- **Easter Egg 1 (Cardistry):** Double-tapping the active card triggers a randomized, fast-paced cardistry shuffle animation.
- **Easter Egg 2 (Deck Spread):** Long press + drag left/right triggers a "spread". The stacked cards fan out horizontally, allowing the user to view all projects simultaneously and hop directly to a specific card without sequentially swiping.

---

## 5. Phase-Wise Build Flow

To ensure the complex physics don't destroy layout or Core Web Vitals (aligned with `docs/mobile.md`), build strictly in these phases:

### Phase 1: Static Foundation (Server Components)
Build the `ProjectCard` and `ExperienceCard` as 100% static, server-rendered components with no fixed heights (`min-h-svh` or fluid aspect ratios). This ensures SEO text reachability before JS executes.

### Phase 2: The Motion Boundary (CardStackEngine)
Create a dedicated `"use client"` wrapper (`CardStackEngine.tsx`). Pass the static cards into it as `children` (donut pattern). Implement the Z-axis stacking (scale, y-offset) so it physically looks like a deck (e.g., card 1 = scale 1, card 2 = scale 0.95).

### Phase 3: Core Gestures & Physics
Implement `drag` with strict velocity thresholds.
- Wire horizontal pan to animate the card flying away and re-ordering the array index.
- Wire vertical pan to toggle the active dataset state (Projects vs Experience).
- Add the "disturbance" micro-interaction (mapping top card's drag X to underlying cards' `rotateZ`).

### Phase 4: Heavy Content & Overlays
Build the absolute-positioned tutorial overlay and the pagination dots. Ensure the "Monitor" YouTube expander is dynamically imported (`next/dynamic(..., { ssr: false })`) so it only mounts when explicitly clicked.

### Phase 5: Easter Eggs
Implement the tap-count listener for the double-tap shuffle, and the `onPointerDown` timeout logic to trigger the "Deck Spread" grid reflow.

### Phase 6: Tone-Down & Verification
Wrap all heavy motion in `prefers-reduced-motion` checks. Disable JavaScript completely to ensure the site gracefully degrades to a static layout (top card visible or vertical list) so users are never locked out of content.
