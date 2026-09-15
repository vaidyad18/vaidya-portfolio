# Logic Fixes — Card Deck

**Status:** Documentation only. No code changes made.
**Target file:** `app/components/mobile/CardStackEngine.tsx`.
**Context:** builds on `docs/deck.md` (per-deck independence) — these are the remaining logical gaps after that fix.

---

## Fix 1 — Peep ignores the inactive deck's cursor `offset`

**Evidence (`CardStackEngine.tsx:283`):**
```tsx
{inactiveCards.slice(0, 5).map((card, index) => { ... })}
```
The inactive deck ("peep") always renders from **static index 0** (`inactiveCards[0]` on top). The active deck, by contrast, renders from the cursor: `offset + positionInStack * dirMult` (`:309-310`).

**Consequence:** after `… horizontal → nyayaai → vertical → meity`, the projects deck's cursor is `offset: 1` (nyayaai), but the peep still paints `inactiveCards[0]` = **jansamadhan** on top. On the next vertical pull you briefly see jansamadhan, then the swap lands on nyayaai — the "slight second show jansamadhan then moves to nyayaai" you reported.

**Fix:** derive the inactive deck's cursor and render the peep through the same `getCardData` formula as the active deck.

Add after the active-cursor derivation (`:30-33`):
```tsx
	const inactiveDeckType = activeDeckType === "projects" ? "experience" : "projects";
	const inactiveCursor = cursors[inactiveDeckType];
```

Replace the peep map (`:281-302`) with:
```tsx
			{inactiveCards.length > 0 && (
				<div className="absolute inset-0 origin-center pointer-events-none" style={{ zIndex: 0 }}>
					{Array.from({ length: NUM_PHYSICAL_CARDS }, (_, positionInStack) => {
						const dataIndex = inactiveCursor.offset + (positionInStack * (inactiveCursor.direction === "prev" ? -1 : 1));
						const card = getCardData(dataIndex, inactiveCards);
						if (!card) return null;
						return (
							<div
								key={`inactive-${positionInStack}`}
								className={`absolute top-0 left-0 right-0 mx-auto origin-center ${ENGINE_SHAPE_CLASSES}`}
								style={{
									transform: `rotateZ(${STATIC_ROTATIONS[positionInStack]}deg)`,
									zIndex: NUM_PHYSICAL_CARDS - positionInStack
								}}
							>
								<CardDeckContext.Provider value={{ isTop: false }}>
									<div className="w-full h-full pointer-events-none overflow-hidden rounded-xl">
										{card}
									</div>
								</CardDeckContext.Provider>
							</div>
						);
					})}
				</div>
			)}
```

This also makes the peep wrap correctly for short decks (2 projects / 3 experience), matching the active deck's `getCardData` wrapping instead of `slice(0, 5)`.

---

## Fix 2 — Peep ignores the inactive deck's cursor `direction`

**Evidence:** the old peep used `STATIC_ROTATIONS[index]` with **no `dirMult`**, while the active deck applies `dirMult` from its own `direction`.

**Fix:** handled by the same edit as Fix 1 — the `inactiveCursor.direction === "prev" ? -1 : 1` term in the new `dataIndex` makes the peep's card order (behind the top card) match the active deck exactly. No separate change.

---

## Fix 3 — Ghost element renders `activeCards[0]` (hidden duplicate video)

**Evidence (`:266-270`):**
```tsx
			{/* The Ghost Element: Holds container open securely */}
			{activeCards.length > 0 && (
				<div className={`relative invisible pointer-events-none opacity-0 ${ENGINE_SHAPE_CLASSES}`}>
					{activeCards[0]}
				</div>
			)}
```
`activeCards[0]` is static index 0 (not the cursor's top card), and — because it's outside any `CardDeckContext.Provider` — `CardDeckVideo` defaults to `isTop: true`, so it mounts a `<video>` that **still decodes while invisible**.

**Fix:** the ghost is only a spacer (all cards share `aspect-[5/7]`), so it needs no card content at all:
```tsx
			{/* The Ghost Element: Holds container open securely */}
			{activeCards.length > 0 && (
				<div className={`relative invisible pointer-events-none opacity-0 ${ENGINE_SHAPE_CLASSES}`} />
			)}
```
Removes the hidden duplicate video and the index-0 inconsistency in one move.

---

## Fix 4 — Intent-lock decided on zero movement

**Evidence (`:68-71`):**
```tsx
		if (first) {
			intentRef.current = Math.abs(mx) > Math.abs(my) ? "horizontal" : "vertical";
		}
```
On the first drag event `movement` is `[0, 0]`, so `Math.abs(0) > Math.abs(0)` is `false` → the lock **always** resolves to `"vertical"` on `first`. This relies on `use-gesture`'s `first` semantics; if `first` fires before real movement, the first gesture is always classified vertical.

**Fix:** decide intent only once movement is large enough to reveal the dominant axis (a ~4px tap threshold), and do nothing until then:
```tsx
		// Lock gesture intent once there's enough movement to know the dominant axis
		if (intentRef.current === null) {
			if (Math.abs(mx) > 4 || Math.abs(my) > 4) {
				intentRef.current = Math.abs(mx) > Math.abs(my) ? "horizontal" : "vertical";
			} else {
				return; // not enough movement yet — wait for a clearer signal
			}
		}
```
`intentRef` is already reset to `null` at the end of every gesture (`:152`, `:259`), so `null` correctly marks "undecided".

**Cleanup required:** `first` becomes unused after this change — remove it from the `useDrag` destructuring (`:64`). (Also unused today: `ix` and `vy` — pre-existing, can be removed in the same edit.)

---

## Verification checklist

1. `npx eslint .` → exit 0 (no unused `first`, no ref-during-render regressions) and `npx tsc --noEmit` → clean.
2. `npm run build` → pass.
3. On device, run the full sequence:
   `jansamadhan → vertical → meity → vertical → jansamadhan → horizontal → nyayaai → vertical → meity`
   then **one more vertical** → the peep during the lift must show **nyayaai** (not jansamadhan), and it must land on nyayaai with no flash.
4. Also verify the peep matches when a deck is advanced more than one card, and when a deck was swiped "prev" (direction −1): the peep's behind-cards must mirror the active deck's order.
5. Confirm no hidden video decodes: with the ghost fixed, the trace's `play`/`loadedmetadata` media-init count should not include a ghost-init video.

---

## Scope note

These four fixes are independent of `docs/deck.md`'s per-deck state and can ship together or one at a time. Fix 3 and Fix 4 are tiny; Fix 1/2 (single edit) is the one that resolves your reported flash.
