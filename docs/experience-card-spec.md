# Experience Card — Interaction Spec

**Component:** Homepage Experience preview card
**Status:** Concept locked, Magnetic Crane iteration
**Last updated:** August 2026

---

## 1. Overview

The Experience card has two states:

1. **Normal State** — a static, highly readable list (default, always shown on mobile, default on desktop too).
2. **Game State** — a Magnetic Crane interactive physics simulation (desktop only, opt-in via a Play button).

The normal state is the source of truth for professional content. The game state is an interactive delight layer—it never gates access to information; it is purely to reward curiosity and provide a highly memorable page transition.

---

## 2. Normal Card (Default State)

Visually similar to the "Projects Cabinet" drawer pattern.

**Contents per experience entry:**
- Title (company/organization name)
- Short description (1 line)
- Tools/stack used (tags)
- Certificate hyperlinks (if any)
- "View Details" link ? /experience

**Behavior:**
- Fully scannable in a glance.
- Identical on mobile. The game layer is **not** built for mobile to avoid overwhelming smaller touch screens.
- **Desktop-only addition:** A **Play** button on this card triggers the transition into the Game State.

---

## 3. Transition: Card ? Game

- **Trigger:** User clicks **Play** on the normal card.
- **Animation:** The card flips (like a physical card turning over) to reveal the game view on its reverse face.
- After the flip completes, the game view is the only thing visible in that card's bounds.

---

## 4. Game State — The Magnetic Crane Phase

### 4.1 Visual Theme
- The scene features a construction crane with a large magnet at the top of the card.
- The experiences are represented as solid, heavy "floors" or blocks.
- **Color:** Randomized neo-brutalist palette on every load. Floors get bold, flat, saturated colors with hard black outlines and offset shadows to perfectly match the rest of the portfolio.

### 4.2 Floor Content
Each floor block contains:
- Title (company/org name)
- Short description (1 line)
- Tools/stack used (tags)
- Certificate hyperlinks (if any)
- "View Details" link

### 4.3 The "Anti-Gravity" Build Animation
- When the game view opens, all experience floors are initially stacked resting on the ground at the bottom of the card.
- The crane's magnet powers on. 
- Defying expectations, the floors are magnetically pulled **upward** one by one. 
- They fly up and slam into the magnet (or the floor above them), eventually forming a hanging, suspended stack dangling from the crane at the top of the screen.
- This animation replays every time the card is flipped into the game view.

### 4.4 Internal Scroll (Scalability)
- If the hanging stack exceeds the card's visible height, internal scrolling silently activates so no content is cut off as new career experiences are added over time.

---

## 5. Game State — The Fall Phase (Interaction & Transition)

- **Trigger:** The user clicks any specific floor in the hanging stack.
- **Effect:** The clicked floor loses its magnetic attraction. Gravity immediately normalizes for that specific block. 
- **Animation:** The block plummets heavily off the bottom of the screen. 
- **Navigation:** As the block falls, it acts as a dramatic page-transition curtain. The user is instantly taken to the /experience page, anchored directly to the section for the specific company whose block was clicked.

---

## 6. Mobile Behavior

- Mobile shows **only the Normal Card** (Section 2).
- Rationale: The physics simulation requires screen real estate and precise pointer interaction that doesn't translate perfectly to a quick mobile scroll session.

---

## 7. Design Rationale

- **Why a Crane & Magnet?** A crane lifting floors perfectly symbolizes "building a career." It is a positive, additive metaphor compared to games like Tetris that focus on deletion.
- **Why Anti-Gravity?** Web users expect objects to fall down. Reversing gravity instantly captures attention because it feels unnatural and magical.
- **Why the Sudden Fall?** The snap from anti-gravity suspension to a heavy, realistic downward free-fall is incredibly punchy. It makes the transition to the next page feel deliberate and action-oriented.

---

## 8. Implementation Workflow (Creative Developer Standard)

1. **The Static Skeleton (Structure First)**
   Build the entire component as a flawless, static React/HTML layout first using CSS Flexbox/Grid. Ensure it acts as a perfect visual fallback without any JavaScript.
   
2. **Asset Separation (Vector/WebGL Prep)**
   Extract complex visual elements (e.g., the crane, magnet) into distinct, inline SVG nodes or 3D assets so they can be manipulated directly via code without triggering DOM layout recalculations.
   
3. **The Motion Boundary (The Puppeteer Layer)**
   Wrap the elements that will move in animation containers (like \motion.div\). Establish basic lifecycle animations (mount/unmount fading) to define the boundaries of what is allowed to move.
   
4. **The Physics Engine (The Invisible World)**
   Initialize a background physics engine (like \Rapier\ or \Matter.js\) separated from the DOM. Create invisible bodies that map to your HTML elements, running on a \equestAnimationFrame\ loop that syncs coordinate data to the visual layer.
   
5. **Choreography & Juice (Micro-Interactions)**
   Layer in organic spring physics for transitions, sequence your animations with staggered delays, and bind subtle parallax or rotational forces to cursor/scroll tracking to make the component feel "alive."
   
6. **The Hardware & Accessibility Audit (Jank Control)**
   Offload motion to the GPU by strictly animating only \	ransform\ and \opacity\ (avoiding layout thrashing). Wrap the engine in a \prefers-reduced-motion\ check to automatically downgrade to the static skeleton for accessibility compliance.
