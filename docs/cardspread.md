Plan: add will-change: transform to the card layers (A1 only)
Scope: app/components/mobile/CardStackEngine.tsx — 3 style-object edits, zero logic changes.

Edit 1 — Shadow plate (:381)
// from
style={{ zIndex: -1, scale: bgSpring.scale, opacity: bgSpring.opacity }}
// to
style={{ zIndex: -1, scale: bgSpring.scale, opacity: bgSpring.opacity, willChange: "transform" }}
Edit 2 — Inactive deck wrapper (:389)
// from
style={{ zIndex: 0, scale: bgSpring.scale, opacity: bgSpring.opacity }}
// to
style={{ zIndex: 0, scale: bgSpring.scale, opacity: bgSpring.opacity, willChange: "transform" }}
Edit 3 — The 5 active cards (:430-437)
// add one line to the style object
style={{
    zIndex, x, y, scale,
    rotateZ: rotZ, rotateY: rotY,
    opacity,
    willChange: "transform",
    pointerEvents: isTop ? "auto" : "none",
    cursor: isTop ? "grab" : "auto",
    touchAction: "none",
}}
Why this works
will-change: transform forces Chrome to rasterize each card into a fixed compositor bitmap once, then apply the fan's scale/rotate on the GPU without re-rasterizing — this is the direct fix for the 418-RasterTask burst the trace showed. The 5 cards ≈ 4–5 MB of GPU textures, acceptable on the Nord 3.

Explicitly NOT touching
togglePokerFan, useSprings/api, orderRef, the drag handler, handleMotion, CardDeckVideo/context, and no ref→state conversion (B4 deferred).

Verification
npx tsc --noEmit → npm run lint → npm run build (should be clean; pure style-prop change).
On-device re-trace (cardspread-3.json): confirm RasterTask count drops to ~0 during the fan and dropped-frame rate falls below ~10%.
Regression: shake-to-fan, s key, swipe left/right (throw+reorder), swipe up/down (deck swap) all behave identically.
Ready to implement when you approve exiting plan mode.

