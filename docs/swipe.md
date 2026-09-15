# 360-Degree Radial Physics Architecture

This document serves as the architectural blueprint for the GPU-accelerated gesture engine powering the Tinder-style project card stack. The engine relies on `@use-gesture/react` for raw 0ms input and `@react-spring/web` for 120fps hardware-accelerated fluid mechanics.

## Part I: The Core Architecture

### A. Radial Kinematics (Momentum Projection)
A swipe is evaluated not just by the physical distance dragged, but by the physical force of the flick. Because `@use-gesture` provides `vx/vy` strictly as absolute speed magnitudes, we must mathematically restore the `+/-` vector directions before projecting. Upon release, the engine calculates a **Projected Destination**:
- `directionalVx = vx * (mx < 0 ? -1 : 1)`
- `projectedX = mx + (directionalVx * MOMENTUM)`
*(Where MOMENTUM = 200)*

This ensures that a short, violent flick triggers a full action just as reliably as a long, slow drag.

### B. Hybrid Tolerance Cones & The Diagonal Void
To resolve the ambiguity of diagonal throws and respect the natural arc of human thumbs, the 360-degree release space is divided into asymmetric, ergonomic slices based on absolute angles (`Math.atan2`):

- **Horizontal Forgiveness (±45° from X-axis):** Left and right swipes get a massive 90° catch area to absorb the natural, curved arcs of human thumbs. Triggers next/prev card projection.
- **Vertical Strictness (±35° from Y-axis):** Up and down swipes get a stricter 70° catch area (starting at 55°) to prevent accidental deck swaps.
- **The Shrunken Diagonal Void:** A tiny, strict 10° mathematical gap exists exactly between these cones (e.g., exactly 45° to 55°). If a swipe falls precisely here, it is deemed genuinely ambiguous. It safely skips all actions and bounces the deck back to the center as a protective rubber-band rejection.

### C. Differential Parallax Tracking (Layer Slide)
To merge the 360-degree freedom of the top card with the "Heavy Layer Slide" illusion of a vertical deck swap, the active drag loop applies **Differential Axis Tracking**:
- **The Top Card:** Tracks both `mx` and `my` (1:1 full 3D freedom).
- **The Background Active Deck (Cards 1-4):** Tracks ONLY `my`. 

When dragging down or diagonally, the *entire* heavy active deck slides down with the finger to reveal the passive deck underneath, while the top card peels off visually in 360 degrees.

---

## Part II: The 7 Pillars of Optimization (Architectural Laws)

These are the strict engineering laws governing the engine to guarantee zero-latency, 120fps performance.

### 1. 1:1 Tracking & 3D Pitch Tilt
The top card tracks exact finger coordinates instantly. It exhibits 3D rotation (`rotX` for pitch, `rotY` for yaw, `rotZ` for twist) derived directly from `mx`, `my`, `vx`, and `vy` in the active `api.set()` loop to simulate air resistance.

### 2. Neutralize Browser Scroll Interference
Absolute zero browser interference. Mobile browsers must immediately yield touch events to the JS engine without waiting to check if the user is attempting to scroll natively. Achieved via `touchAction: "none"` on the active animated wrapper.

### 3. Prevent React Re-Renders (GPU Parallax Peeking)
Peeking (pulling a card to see the next one) NEVER triggers a React `setState`. React is too slow for 120fps drags. 
There is zero use of `patchActiveCursor` during the `active` dragging phase. The background cards' transformations are interpolated imperatively via `@react-spring`'s `api.set()` on the GPU.

### 4. Strict GPU-Accelerated Properties
The engine animates only transform parameters (`x`, `y`, `scale`, `rotX`, `rotY`, `rotZ`) and `opacity`. It strictly avoids layout properties like `margin`, `top`, or `left`.

### 5. Velocity-Based Release Flicks (Momentum)
A swipe is calculated via the Radial Kinematics formula described in Part I. Momentum rules over raw distance.

### 6. Zero Axis Locking (Omnidirectional Intent)
The card sticks to the finger instantly. There is no deadzone (e.g., waiting 4 pixels to lock into an axis). Total omnidirectional freedom is maintained from `mx=1`.

### 7. Zero Latency Hardware Pointer Binding
The engine reacts the exact millisecond the screen is touched. `{ filterTaps: true }` is banned from the `useDrag` config to prevent the gesture from waiting for a 3px slop movement. 

---

## Part III: Remaining Implementations (TODO)

### 1. Passive Deck Spring Interpolation (The "Peep" Fix)
Currently, the **Active Deck** uses `useSprings` to smoothly slide via Parallax Peeking, successfully revealing the **Inactive Deck** underneath.

**The Missing Implementation:**
The `inactiveCards` mapping (JSX at the bottom of the engine) is currently rendered as static HTML `<div>` elements without any `animated` wrapper or `@react-spring` bindings.
- **Goal:** Upgrade the Inactive Deck to `<animated.div>` and bind its scale/opacity to dynamically interpolate based on the *active* deck's `y` throw value.
- **Result:** When the user vertically drags the active deck away, the passive deck underneath will visually "swell" or scale up dynamically in response to the gesture pressure, rather than sitting completely static until the swap completes.
