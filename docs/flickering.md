# Flickering Analysis & Elimination Plan (Final)

**Status:** Report + plan. Awaiting approval before implementation.
**Input:** `audit/mobile_trace-4.json` (production, real device, remote debugging).
**Goal:** zero visible flicker — no remaining dropped frames on swipe.

---

## 1. Trace-4 environment (measured)

| Fact | Value |
|---|---|
| Duration | 43.37 s (longest recording yet — ~33 s of actual gestures) |
| Frame rate | **91 Hz** (median `BeginFrame` interval 11.0 ms) |
| Gesture windows | 4 (11.2 s + 0.2 s + 5.6 s + 16.2 s) |
| Pointer moves | 906 |

> **Frame-rate note:** the phone renders at ~91 Hz, not the 120 Hz the panel advertises (Chrome on Android is capping it, or adaptive refresh settles at 90 Hz). So "zero flicker" means zero dropped frames **at 90 fps** — the 120 Hz budget never applies here.

---

## 2. Headline metrics (all four traces, per-second where relevant)

| Metric | t1 (baseline) | t2 | t3 | **t4** |
|---|---|---|---|---|
| Dropped frames/s | 17.9 | 25.9 | 10.8 | **14.8** |
| Dropped-frame rate | ~30 % | ~28 % | — | **16.3 %** |
| GC events/s | 1,326 | 484 | 1,136 | **1,020** |
| GC time (ms/s) | 115.7 | 15.6 | 52.0 | **54.1** |
| JS during gesture (ms/s) | ~106 | ~96 | ~103 | **~112** |

**What the numbers say:** the earlier flicker fixes (remove `scale`, drop `preserve-3d`, fix stale `zIndex`, fix the peep) knocked the drop rate down from ~30 % to ~16 %, but it has **plateaued** — the remaining 16 % is a *different* cause that none of those fixes touch.

---

## 3. The remaining cause: per-frame React re-render

### Evidence (function-level self-time, during gesture)

| Function | Script | Self-time (gesture) | Calls |
|---|---|---|---|
| `w` | **react-spring** | **851 ms** | 1,636 |
| `fO` | **react-dom** | **406 ms** | 3,891 |
| `O` | **react-dom** | **322 ms** | 88 |
| `fz` | react-dom | 58 ms | 1,212 |
| `fT` | react-dom | 58 ms | 542 |

react-spring (`w`) + react-dom (`fO` + `O` + `fz` + `fT`) = **~1,700 ms** of the 3,718 ms total JS during gesture — i.e. nearly **half** of the main thread's drag-time work is React re-rendering / spring bookkeeping, not the actual animation.

### Why it happens (two compounding mechanisms)

1. **`useSprings` re-renders on every update.** Verified in `@react-spring/core` source: `useSprings` calls `useForceUpdate()` inside its `flush` path, so every `api.set`/`api.start` (each pointermove) re-runs the whole `CardStackEngine` render — including the 5 `animated.div`s and their card content.
2. **Context value recreated every render.** `<CardDeckContext.Provider value={{ isTop }}>` (`CardStackEngine.tsx:336`, and `{ isTop: false }` at `:300`) creates a **new object each render**, so the `CardDeckVideo` consumers re-render on every drag frame even though `isTop` didn't change.

### Why it's more visible on vertical

The vertical drag transforms all 5 cards every frame, while horizontal mostly moves the top card. Same re-render cost, but vertical multiplies the visible effect across 5 clipped cards.

---

## 4. Best approach (web-validated): decouple transform from content

React's "Choosing the State Structure" and react-spring's v10 API (verified against the installed `@react-spring/core` type defs) point to the same fix:

- **Transform layer** (x, y, scale, rotZ, rotY, opacity, zIndex) → move from React state to **ref-backed `SpringValue`s**, updated imperatively. `animated.div` already binds to `SpringValue`s and writes them to the DOM directly — **no React re-render**.
- **Content layer** (which card is in which slot) → stays React state (`offset`, `activeDeckType`), re-rendering only when it actually changes (throw / swap).
- **Context** → memoize `{ isTop }` so `CardDeckVideo` only re-renders when `isTop` actually flips.

react-spring v10 **removed `useSpringsRef`** (confirmed absent from the v10 exports), so the v10-correct primitives are:

```ts
// from @react-spring/core (re-exported by @react-spring/web)
const x = useSpringValue(0, { tension: 500, friction: 50 }); // SpringValue<number>, no re-render
x.set(120);        // immediate, imperative
x.start(120, config); // animated, imperative
```

`animated.div` accepts the `SpringValue` directly: `style={{ x, y, scale }}`.

---

## 5. Implementation plan (Phase 2 — the final flicker fix)

### Step 1 — replace `useSprings` with ref-backed `SpringValue`s

Replace `useSprings(5, i => ({…}))` with 5 cards × 7 `SpringValue`s held in a `useRef` (stable, no `useForceUpdate`):

```tsx
import { SpringValue, config } from "@react-spring/web";

const springConf = { tension: 500, friction: 50 };
const springsRef = useRef(
  Array.from({ length: NUM_PHYSICAL_CARDS }, (_, i) => ({
    x: new SpringValue(0, springConf),
    y: new SpringValue(0, springConf),
    scale: new SpringValue(1, springConf),
    rotZ: new SpringValue(STATIC_ROTATIONS[i], springConf),
    rotY: new SpringValue(0, springConf),
    opacity: new SpringValue(1, springConf),
    zIndex: new SpringValue(NUM_PHYSICAL_CARDS - i, springConf),
  }))
);
```

### Step 2 — render via `SpringValue`s (no `springs` array)

```tsx
{Array.from({ length: NUM_PHYSICAL_CARDS }, (_, i) => {
  const s = springsRef.current[i];
  const positionInStack = order[i];          // see Step 5
  const isTop = positionInStack === 0;
  const cardData = getCardData(offset + positionInStack * dirMult, activeCards);
  if (!cardData) return null;
  return (
    <animated.div
      key={i}
      {...(isTop ? bind(i) : {})}
      className={…}
      style={{
        x: s.x, y: s.y, scale: s.scale,
        rotateZ: s.rotZ, rotateY: s.rotY, opacity: s.opacity, zIndex: s.zIndex,
        pointerEvents: isTop ? "auto" : "none", cursor: isTop ? "grab" : "auto",
        touchAction: "none",
      }}
    >
      <CardDeckContext.Provider value={memoizedIsTop}>…{cardData}…</CardDeckContext.Provider>
    </animated.div>
  );
})}
```

### Step 3 — scrub with `.set`, release/throw with `.start`

- Vertical scrub: `springsRef.current.forEach(s => { s.y.set(my); s.scale.set(1); … })`.
- Horizontal scrub: top card `s.x.set(mx)`, disturbance `s.rotZ.set(…)`.
- Release spring-back: `s.x.start(0, { tension: 500, friction: 50 })`.
- Throw: top card `s.x.start(250*dir, {…}); s.opacity.start(0, {…, onRest: …})` — `onRest` still exists per `SpringValue.start`.
- `runLayerSwap`: `Promise.all(springsRef.current.map(s => s.y.start(±800, …)))`, then swap + immediate `.set` teleport (including `zIndex`).

### Step 4 — memoize the context value

Replace the inline `value={{ isTop }}` / `value={{ isTop: false }}` with a `useMemo`-ed value so `CardDeckVideo` stops re-rendering every frame:

```tsx
const topCtx = useMemo(() => ({ isTop: true }), []);
const backCtx = useMemo(() => ({ isTop: false }), []);
```

### Step 5 — lift `orderRef` into state (fixes the `react-hooks/refs` error too)

`orderRef.current.indexOf(i)` is read during render (`:313`), which the React 19 lint rule flags as an error. Since we're refactoring anyway, lift it: `const [order, setOrder] = useState([0,1,2,3,4])`, update via `setOrder(newOrder)` in the throw `onRest` and reset via `setOrder([0,1,2,3,4])` in the swap. Removes the ref-during-render error for free.

### Step 6 — verification (acceptance gate)

1. `npx eslint .` → exit 0 (the `react-hooks/refs` error gone) and `npx tsc --noEmit` → clean.
2. `npm run build` → pass.
3. Real-device trace, vertical + horizontal:
   - `react-spring w` / `react-dom fO` / `O` gesture self-time should collapse toward zero (only release animations show spring work).
   - Dropped-frame rate should fall well below 16 % (target: < 5 %).
   - GC stays low (≤ current 2,345 ms is fine; should actually drop since re-render allocates less).

---

## 6. Risk

- Medium-high: this rewrites the engine's value plumbing (`useSprings` → `SpringValue`s). The *logic* (intent lock, throw/swap sequencing, per-deck cursors) is untouched — only the *transport* of animated values changes.
- `SpringValue.start` keeps `onRest`, so the throw/swap `onRest` sequencing survives.
- Rollback = `git checkout` of `CardStackEngine.tsx` (+ `CardDeckVideo.tsx` for the context memo).

---

## 7. Questions (see chat)

1. Confirm the **full refactor** (Step 1–5) is what you want for "no minute flickering", accepting medium risk — vs. a lower-risk first step (memoize context only, re-measure).
2. Include **Step 5** (lift `orderRef` to state) to also clear the existing lint error, since it's the same file?
3. The **91 Hz** cap — acceptable, or do you want to investigate why Chrome isn't hitting 120 Hz separately?
