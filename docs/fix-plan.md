# Fix Plan v3 (final) — Phase 3 & 4: eliminate the active-deck re-render

**Status:** Plan only. Awaiting approval before implementation.
**Input:** `mobile_trace-7.json`, `@react-spring/core` source, react-spring docs + web.
**Done already:** Phase 1 (shadow → `useSpringValue`), Phase 2 (inactive deck → `useMemo` `SpringValue`s).
**Goal:** keep the physics/design, remove the last re-render, reach ~<10% drop rate — done in two small commits, each verifiable.

---

## 0. Why flicker is still here (one line)

Phases 1–2 fixed the shadow + inactive deck, but the **active deck is still `useSprings`** (`CardStackEngine.tsx:63`), and its `api.set`/`api.start` (`:224, :300, :342, :401, :108`) force-re-render ~5 cards every drag frame. Trace-7: `react-spring w` 672ms + `react-dom fO` 542ms. This plan removes that.

---

## 1. The two mistakes `#6` made (baked into this plan)

1. Used `useRef(Array.from(() => new SpringValue()))` → re-creates values every render + reads a ref during render (React 19 stale value).
2. Left `zIndex` as an animated `SpringValue`.

**This plan:** use `useMemo(..., [])` (stable value, participates in render), and **derive `zIndex` from the `order` state instead of a SpringValue** (zIndex is never animated — it's only ever set `immediate: true`, so it belongs in React state, not the spring system).

---

## 2. Phase 3 — lift `orderRef` into `order` state (small, safe, commit 1)

This is independent of the spring system, clears the `react-hooks/refs` lint error, and makes Phase 4 simpler.

### 3.1 — replace the ref with state
```tsx
// const orderRef = useRef([0, 1, 2, 3, 4]);   (delete)
const [order, setOrder] = useState([0, 1, 2, 3, 4]);
```

### 3.2 — replace every read
`orderRef.current.indexOf(x)` → `order.indexOf(x)` (7 sites: `:64, :109, :199, :225, :301, :343, :402, :469`).

### 3.3 — replace every write
- Vertical swap: `orderRef.current = [0, 1, 2, 3, 4]` (`:320`) → `setOrder([0, 1, 2, 3, 4])`.
- Horizontal throw reorder (`:355-358`): build `newOrder`, then `setOrder(newOrder)`; use `newOrder.indexOf(j)` (not `orderRef.current`) inside the reorder loop.

### 3.4 — verify
`npx tsc --noEmit` clean → `npx eslint .` shows **0** errors (the `react-hooks/refs` error gone) → `npm run build` pass → on-device: throw + swap still rotate the deck correctly. Commit.

---

## 3. Phase 4 — active deck `useSprings` → `useMemo` `SpringValue`s (the core, commit 2)

One commit, but done as ordered sub-steps, running `npx tsc --noEmit` after **each** to catch typos before they cascade.

### 4.1 — factory + hook
Module level (7 values — no `zIndex`):
```tsx
// Define stable configs outside the component to prevent V8 GC churn on mobile
const CFG_DEFAULT = { tension: 500, friction: 50 };
const CFG_FAN = { mass: 1, tension: 400, friction: 30 };
const CFG_THROW = { friction: 40, tension: 350 };
const CFG_THROW_RETURN = { friction: 40, tension: 300 };
const CFG_SWAP = { mass: 1, tension: 300, friction: 30 };

const makeActiveSprings = () =>
	Array.from({ length: NUM_PHYSICAL_CARDS }, (_, i) => ({
		x: new SpringValue(0, { config: CFG_DEFAULT }),
		y: new SpringValue(0, { config: CFG_DEFAULT }),
		scale: new SpringValue(1, { config: CFG_DEFAULT }),
		rotZ: new SpringValue(STATIC_ROTATIONS[i], { config: CFG_DEFAULT }),
		rotY: new SpringValue(0, { config: CFG_DEFAULT }),
		rotX: new SpringValue(0, { config: CFG_DEFAULT }),
		opacity: new SpringValue(1, { config: CFG_DEFAULT }),
	}));
```
In the component, replace `const [springs, api] = useSprings(NUM_PHYSICAL_CARDS, i => ({…}));` (`:63-72`) with:
```tsx
const springs = useMemo(() => makeActiveSprings(), []);
```
Add `springs` to the existing unmount-cleanup effect (`:81-86`): `springs.forEach(s => { s.x.stop(); s.y.stop(); s.scale.stop(); s.rotZ.stop(); s.rotY.stop(); s.rotX.stop(); s.opacity.stop(); })`.

### 4.2 — rewrite the render
Change `springs.map(({ x, y, rotZ, rotY, rotX, scale, zIndex, opacity }, i) => {` (`:468`) to `Array.from({ length: NUM_PHYSICAL_CARDS }, (_, i) => { const s = springs[i];` and use:
```tsx
style={{
	x: s.x, y: s.y, scale: s.scale,
	rotateZ: s.rotZ, rotateY: s.rotY, rotateX: s.rotX,
	opacity: s.opacity,
	zIndex: NUM_PHYSICAL_CARDS - positionInStack,   // derived from order, not a SpringValue
	pointerEvents: isTop ? "auto" : "none", cursor: isTop ? "grab" : "auto", touchAction: "none",
}}
```
(`positionInStack = order.indexOf(i)` already computed above.)

### 4.3 — rewrite `togglePokerFan` (`:108-144`)
`api.start(i => ({…}))` → `springs.forEach((s, i) => { const currentPos = order.indexOf(i); … })`:
- "prune clones" (`currentPos >= visibleCount`) → `s.opacity.set(0); s.scale.set(0); return;` (was `immediate: true`).
- fan → `s.x.start(dx, {config: CFG_FAN}); s.y.start(dy, {config: CFG_FAN}); s.rotZ.start(angle, {config: CFG_FAN}); s.scale.start(0.65, {config: CFG_FAN}); s.opacity.start(1, {config: CFG_FAN});`
- snap back → `s.x.start(0, {config: CFG_DEFAULT}); s.y.start(0, {config: CFG_DEFAULT}); s.rotZ.start(STATIC_ROTATIONS[currentPos], {config: CFG_DEFAULT}); s.scale.start(1, {config: CFG_DEFAULT}); s.opacity.start(1, {config: CFG_DEFAULT});`

### 4.4 — rewrite the scrub (`:224-249`)
`api.set(i => ({…}))` → `springs.forEach((s, i) => { const currentPos = order.indexOf(i); … })`:
- top card → `s.x.set(mx); s.y.set(my); s.rotZ.set((mx/20)*pivotFactor); s.rotX.set((my/20)*pivotFactor); s.rotY.set((mx/20)*pivotFactor); s.scale.set(1.02);`
- `currentPos < 3` → `s.y.set(underlyingY); s.rotZ.set(STATIC_ROTATIONS[currentPos] + mx/300); s.scale.set(1 + Math.min(Math.abs(mx)/2000, 0.05));`
- else → `s.y.set(underlyingY);`

### 4.5 — rewrite the release rubber-band (`:401-407`)
`api.start(i => ({…}))` → `springs.forEach((s, i) => { const currentPos = order.indexOf(i); s.x.start(0, {config: CFG_DEFAULT}); s.y.start(0, {config: CFG_DEFAULT}); s.rotZ.start(STATIC_ROTATIONS[currentPos], {config: CFG_DEFAULT}); s.rotY.start(0, {config: CFG_DEFAULT}); s.rotX.start(0, {config: CFG_DEFAULT}); s.scale.start(1, {config: CFG_DEFAULT}); });`

### 4.6 — rewrite the horizontal throw + reorder (`:342-385`)
```tsx
springs.forEach((s, i) => {
	const currentPos = order.indexOf(i);
	if (currentPos === 0) {
		Promise.all([
			s.x.start(350 * dir, { config: CFG_THROW }),
			s.y.start(projectedY * 0.5, { config: CFG_THROW }),
			s.rotZ.start((mx / 10) * pivotFactor + dir * 20 * vx, { config: CFG_THROW }),
			s.rotY.start(dir * 60 * vx, { config: CFG_THROW }),
			s.rotX.start(0, { config: CFG_THROW }),
			s.scale.start(0.5, { config: CFG_THROW }),
			s.opacity.start(0, { config: CFG_THROW }),
		]).then(results => {
			if (results.every(r => r.finished)) {
				const newOrder = [...order];
				const shifted = newOrder.shift();
				newOrder.push(shifted);
				setOrder(newOrder);
				patchActiveCursor(c => ({ offset: c.offset + (isRightCone ? 1 : -1), direction: "next" }));
				springs.forEach((s2, j) => {
					const newPos = newOrder.indexOf(j);
					if (newPos === NUM_PHYSICAL_CARDS - 1) {
						s2.x.set(0); s2.y.set(0); s2.rotY.set(0); s2.rotX.set(0);
						s2.scale.set(1); s2.rotZ.set(STATIC_ROTATIONS[newPos]); s2.opacity.set(1);
					}
				});
			}
		});
	} else {
		s.scale.start(1, { config: CFG_THROW_RETURN });
		s.y.start(0, { config: CFG_THROW_RETURN });
		s.rotZ.start(STATIC_ROTATIONS[currentPos - 1], { config: CFG_THROW_RETURN });
	}
});
```
(`zIndex` not set anywhere — it re-derives from `setOrder`.)

### 4.7 — rewrite the vertical swap (`:299-335`)
```tsx
const runLayerSwap = async () => {
	const outPromises = springs.flatMap((s, i) => {
		const currentPos = order.indexOf(i);
		return [
			s.y.start(800 * (isDown ? 1 : -1), { config: CFG_SWAP }),
			s.opacity.start(0, { config: CFG_SWAP }),
			s.rotZ.start(STATIC_ROTATIONS[currentPos], { config: CFG_SWAP }),
			s.scale.start(1.05, { config: CFG_SWAP }),
		];
	});
	inactiveSprings.forEach(s => { s.scale.start(1, { config: CFG_SWAP }); s.opacity.start(1, { config: CFG_SWAP }); });
	const results = await Promise.all(outPromises);
	
	if (results.every(r => r.finished)) {
		setActiveDeckType(prev => prev === "projects" ? "experience" : "projects");
		setOrder([0, 1, 2, 3, 4]);
		springs.forEach((s, j) => {
			s.x.set(0); s.y.set(0); s.rotY.set(0); s.rotX.set(0);
			s.rotZ.set(STATIC_ROTATIONS[j]); s.scale.set(1); s.opacity.set(1);
		});
		inactiveSprings.forEach(s => { s.scale.set(0.95); s.opacity.set(0.5); });
	} else {
		// Revert the inactive deck swell if the swap was cancelled mid-air!
		inactiveSprings.forEach(s => { s.scale.start(0.95, { config: CFG_SWAP }); s.opacity.start(0.5, { config: CFG_SWAP }); });
	}
};
```

### 4.8 — cleanup imports + verify
- Import line → `import { useSpringValue, SpringValue, animated } from "@react-spring/web";` (drop `useSprings`).
- `npx tsc --noEmit` clean → `npx eslint .` 0 errors → `npm run build` pass → on-device full check (below). Commit.

---

## 4. Final on-device verification (after Phase 4)

1. 360° drag, vertical swap, horizontal throw, shake-to-fan all feel identical.
2. Real-device trace: `react-dom fO` / `react-spring w` gesture self-time collapse toward ~0; drop rate 65.8% → **< 10%**; long tasks → 0.

---

## 5. Risk & rollback

- Two independent commits (Phase 3 = tiny; Phase 4 = the core but mechanical, with `tsc` after each sub-step).
- Rollback: `git checkout` of `CardStackEngine.tsx`.
- Physics logic (cones, deadzone, momentum), shake-to-fan, and load-time items unchanged.

## 6. Doubts (explicit, for you)

None blocking — but one decision is baked in and worth your awareness: **`zIndex` is now derived from `order` state, not animated.** This is strictly safer (it was only ever set `immediate: true`) and removes a whole class of `#6`-style bugs. If you'd rather keep `zIndex` as a `SpringValue`, tell me and I'll adjust Step 4.1/4.2 accordingly.
