# Deck Independence Fix Plan

**Status:** Plan only. Awaiting approval before implementation.
**Target file:** `app/components/mobile/CardStackEngine.tsx`.

---

## 1. Root cause (evidence-based, two distinct bugs)

Tracing your exact sequence against the code exposed **two** coupling bugs between the projects and experience decks:

### Bug A — stale `zIndex` after a horizontal throw (the "DRDO on top" bug)

The vertical swap's "teleport" (`CardStackEngine.tsx:128-131`) resets `y`, `rotZ`, `scale`, `opacity` — but **not `zIndex`, `x`, or `rotY`**:

```tsx
api.start(j => ({
	y: 0, rotZ: STATIC_ROTATIONS[j], scale: 1, opacity: 1,
	immediate: true
}));
```

Meanwhile the horizontal throw's `onRest` *does* set `zIndex` for the rotated order (`:216`). So after `horizontal → nyayaai`, the physical cards hold the *thrown* z-order (physical card 1 = `zIndex 5`, physical card 0 = `zIndex 1`). The vertical swap resets `orderRef` back to `[0,1,2,3,4]` but leaves `zIndex` stale, so:

- physical 0 → position 0 → **MeitY** … but `zIndex 1` (back)
- physical 1 → position 1 → **DRDO** … but `zIndex 5` (front)

The correct card (MeitY) is mapped to the slot, but DRDO renders **on top** because of the stale z-order. That's exactly the "changes to DRDO" + "jerk" you saw — it is a *z-order* bug, not a data bug.

> Note: there is already a correct full reset in the dead `useEffect` (`:66-76` — sets `zIndex`, `x`, `rotY`), but it never runs because `isVerticalSwapRef` always suppresses it. The live teleport just forgot the same fields.

### Bug B — shared `offset` / `dragDirection` (the "no independence" issue)

`offset` (`:25`) and `dragDirection` (`:26`) are single states shared by both decks. The vertical swap fakes separation by calling `setOffset(0)` in an `async` block *after* `await` (`:124`). That means neither deck remembers its own position — every swap resets to card 0 — and the two decks are connected through one cursor (the "clash/connection" you want removed).

---

## 2. Best-practice validation (react.dev — "Choosing the State Structure")

The fix follows the documented principles:

- **Group related state** — `offset` + `direction` always change together → store them as one object per deck.
- **Avoid contradictory state** — one shared cursor + an async reset *is* the contradiction the guide warns about.
- **Prefer flat keyed state** — a `Record<deck, cursor>` is flat and easy to update, vs. two coupled `useState`s.

---

## 3. The fix

### Step 1 — per-deck cursor state (replaces `:25-26`)

Add a module-level type near `STATIC_ROTATIONS`, and replace the two shared states:

```tsx
type DeckCursor = { offset: number; direction: "next" | "prev" };

// inside the component (replaces offset + dragDirection):
const [cursors, setCursors] = useState<Record<"projects" | "experience", DeckCursor>>({
	projects: { offset: 0, direction: "next" },
	experience: { offset: 0, direction: "next" },
});

// derived — replaces the old `offset` and `dragDirection` everywhere else in the file:
const { offset, direction: dragDirection } = cursors[activeDeckType];

// helper — always uses a functional update (safe from stale closures in onRest):
const patchActiveCursor = (fn: (c: DeckCursor) => DeckCursor) =>
	setCursors(prev => ({ ...prev, [activeDeckType]: fn(prev[activeDeckType]) }));
```

`offset` and `dragDirection` keep their names (via destructuring), so the render body (`:320-327`) needs no change.

### Step 2 — horizontal logic writes to the active deck only

- `:176` — `setDragDirection(currentDir)` → `patchActiveCursor(c => ({ ...c, direction: currentDir }))`.
- `:204-205` — replace `setOffset(prev => prev + (isNext ? 1 : -1)); setDragDirection("next");` with:
  ```tsx
  patchActiveCursor(c => ({ offset: c.offset + (isNext ? 1 : -1), direction: "next" }));
  ```

### Step 3 — vertical swap: switch deck, reset z-order correctly, no offset reset

In `runLayerSwap`:

- Delete `isVerticalSwapRef.current = true;` (`:122`).
- Delete `setOffset(0);` (`:124`).
- Keep `setActiveDeckType(prev => ...)` and `orderRef.current = [0, 1, 2, 3, 4]`.
- **Fix the teleport** (`:128-131`) to reset the full rest state, including `zIndex` (fixes Bug A). Since `orderRef` is reset to `[0,1,2,3,4]`, physical card `j` is at position `j`, so:

```tsx
api.start(j => ({
	x: 0, y: 0, rotY: 0,
	rotZ: STATIC_ROTATIONS[j],
	scale: 1, opacity: 1,
	zIndex: NUM_PHYSICAL_CARDS - j,
	immediate: true
}));
```

### Step 4 — remove the dead `useEffect` and `isVerticalSwapRef`

- Delete the `useEffect` block (`:57-77`) — it only ever early-returned because `isVerticalSwapRef` is always set right before `setActiveDeckType`.
- Delete `const isVerticalSwapRef = useRef(false);` (`:35`).
- Update the React import (`:3`): `import { useState, useRef, useEffect } from "react";` → `import { useState, useRef } from "react";` (otherwise `useEffect` becomes an unused-import lint error).

---

## 4. Expected behavior after the fix

Your sequence now gives:

1. jansamadhan → vertical → **meity**
2. vertical → **jansamadhan**
3. horizontal → **nyayaai**
4. vertical → **meity** ✅ (was DRDO)

And each deck is now **independent**: advance experience to DRDO, swap away and back, and experience stays on DRDO; projects keeps its own position too. No cross-deck leak, no z-order clash.

---

## 5. Verification

1. `npm run lint` / `npx eslint .` → exit 0 (no unused `useEffect`, no type errors).
2. `npm run build` → pass.
3. On the real phone, run your exact sequence — step 5 must show MeitY, no jerk.
4. Also test: swipe experience horizontally to DRDO → vertical → projects (should remember its card) → vertical → experience still DRDO.
5. Re-record a mobile trace if you want quantitative confirmation that the spurious video remounts (8 inits in trace-3) drop back toward the 6-inits baseline once swaps behave.

---

## 6. Notes / out of scope

- `orderRef` stays a single shared ref and is reset on swap — it's physical slot bookkeeping, not deck content, so it doesn't violate independence.
- The `patchActiveCursor` helper closes over `activeDeckType`; for the horizontal throw's async `onRest` this is correct because a gesture runs entirely within one deck. (A vertical swipe *during* a pending horizontal `onRest` is an unreachable-in-practice edge; if you ever want it bulletproof, capture `activeDeckType` in a local at gesture start.)
- Video remount on swap is a separate perf item, not part of this fix.
