# Mobile Card Deck Implementation Flow (Awwwards-Level)

Based on industry standards for high-performance mobile animations in React/Next.js, here is the bulletproof, production-grade flow to implement the Cinema Pass card deck. The secret sauce is **bypassing React's render lifecycle during the actual animation frames** and **offloading work to the GPU**.

## Phase 1: The Architectural Split (Server vs. Client)
*   **Step 1: Build the Static DOM first.** Build your `ProjectCard` and `ExperienceCard` as 100% static Server Components first. Do not add any animation libraries yet. Ensure they look perfect visually and are SEO-crawlable. 
*   **Step 2: The "Donut Hole" Pattern.** Create your `"use client"` wrapper (e.g., `CardStackEngine.tsx`). Pass your static server cards into it as `children`. This isolates the heavy JS required for the physics engine so it doesn't bloat your content components.

## Phase 2: State & Physics Isolation (The Engine)
*   **Step 3: Choose the Right Engine.** For this specific "card toss" physics (which requires continuous velocity tracking and friction), **React Spring** paired with `@use-gesture/react` is superior to Framer Motion. Framer is great for simple layout transitions, but React Spring calculates fluid physics per-frame based on drag velocity.
*   **Step 4: Bypass React State (`useRef` + `api.start`).** **Never** map drag coordinates (`x`, `y`) directly to a React `useState`. Updating React state on every pixel of a swipe triggers massive re-renders and causes severe mobile stutter. Instead, bind the drag events directly to React Spring's `useSprings` controller (which animates the DOM nodes directly via `ref` without re-rendering the component tree).

## Phase 3: Hardware Acceleration & GPU Handoff
*   **Step 5: Animate ONLY `transform` and `opacity`.** Never animate layout properties like `width`, `height`, `top`, or `left`. These trigger browser "Layout" and "Paint" cycles which destroy mobile CPUs. When tossing the card, only animate `transform: translate3d(x, y, 0) rotate(z) scale(s)`.
*   **Step 6: The `will-change` Hint.** Add `will-change: transform` via CSS to the cards just *before* the drag starts, and remove it immediately after the physics settle. This tells the mobile GPU to put the card on its own hardware layer, ensuring buttery 60-120fps.

## Phase 4: Asset & Media Strategy
*   **Step 7: Defer Heavy Iframes.** Standard YouTube iframes inside the deck will ruin performance. Keep them completely out of the DOM. Use a static thumbnail placeholder on the card.
*   **Step 8: Dynamic Imports.** When the user taps "View Details", use Next.js `next/dynamic` to lazy-load the actual video player component in a modal over the deck. 

## Phase 5: The Easter Eggs (GSAP for Choreography)
*   **Step 9: Separation of Concerns for Timelines.** While React Spring handles the physics of dragging and tossing, use **GSAP** for the "cardistry shuffle" double-tap easter egg. GSAP is the industry standard for sequenced, staggered timelines (e.g., card 1 flies left, card 2 spins right, card 3 drops in). Bind GSAP directly to the DOM refs.

## Phase 6: Fail-Safes & Accessibility
*   **Step 10: Reduced Motion.** Wrap your physics engine in a check for `window.matchMedia('(prefers-reduced-motion: reduce)')`. If true, disable the drag physics entirely and fall back to simple tap-to-cycle buttons.
*   **Step 11: Touch-Action CSS.** Apply `touch-action: pan-y` (or `none`) to the deck container to prevent the browser's native scroll from fighting with your custom `@use-gesture` horizontal drag.
