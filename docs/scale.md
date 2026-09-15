# Mobile Scale — Ratio & Multiplier Reference (0–1279px)

This file is the **single source of truth** for the mobile type/spacing system in
`app/globals.css`. It explains *how* the scale works and *how to extend it*, so you
never hand-tune a pixel value again. The governing engineering rules live in
`docs/mobile.md` (Section 4); read that for the "why", this file for the "math".

---

## 1. The system in one sentence

One base + two knobs; every mobile size on the page is **derived** from them by
multiplier math. Change a knob once and the whole mobile scale re-derives.

Everything in `:root` that is not a knob is a `calc()` of a knob or a previous token.
Nothing below the knobs is tuned by hand.

## 2. The knobs (the ONLY independently-tuned values)

Defined in `app/globals.css` `:root` (lines ~171–196). Do not change anything else
by hand.

| Knob | Value | Meaning |
|------|-------|---------|
| `--text-ratio` | `1.25` | Major Third. Multiply the previous step by this to go up a heading level. |
| `--text-base` | `clamp(1rem, calc(0.87rem + 0.608cqi), 1.125rem)` | Body size (16→18px). The only full clamp with a `cqi` term. |
| `--spacing-unit` | `clamp(0.25rem, calc(0.14rem + 0.55cqi), 0.5rem)` | Spacing base (4→8px). All gaps/paddings are integer multiples of this. |

To **rescale** the whole mobile UI: change `--text-ratio`, `--text-base`,
or `--spacing-unit`. Nothing else should move.

## 3. Type — pure multiplier chain

All tokens resolve by multiplying the base (or a previous step). `hero` is a
floor-scale ratio (`×4.5`), not a chain step, because it is display-type.

| Token | Derivation | Rendered @ base 16px (floor) | Rendered @ base 18px (max) |
|-------|-----------|------------------------------|------------------------------|
| `--text-caption-val` | `base × 0.6875` | 11px | 12.4px |
| `--text-small-val` | `base × 0.8125` | 13px | 14.6px |
| `--text-body-val` | `base` | 16px | 18px |
| `--text-h3-val` | `base × ratio (×1.25)` | 20px | 22.5px |
| `--text-h2-val` | `h3 × ratio (×1.25²)` | 25px | 28px |
| `--text-h1-val` | `h2 × ratio (×1.25³)` | 31px | 35px |
| `--text-display-val` | `h1 × ratio (×1.25⁴)` | 39px | 44px |
| `--text-hero-val` | `base × 4.5` | 72px | 81px |

The `-val` suffix tokens are the computed numerics. The public utilities
(`text-caption`, `text-small`, `text-h3`, …) are aliases to them in `@theme`
so Tailwind emits `text-caption`, `text-h3`, etc.

## 4. Spacing — integer multiples of the unit

| Token | Derivation | Unit @ floor (4px) | Unit @ max (8px→cap 6px) |
|-------|-----------|--------------------|---------------------------|
| `--spacing-fluid-xs-val` | `unit × 1` | 4px | ~6px |
| `--spacing-fluid-sm-val` | `unit × 2` | 8px | ~12px |
| `--spacing-fluid-md-val` | `unit × 4` | 16px | ~24px |
| `--spacing-fluid-lg-val` | `unit × 6` | 24px | ~36px |
| `--spacing-fluid-xl-val` | `unit × 8` | 32px | ~48px |

> Note: the spacing unit **min is 4px** (`0.25rem`); at the 672px column the unit
> lands at ~6px (it has not hit its 8px max yet because the column caps the
> container). Derived values above reflect that.

## 5. Component anchors

Fixed proportions, also derived from the knobs — never hardcoded sizes.

| Anchor | Derivation | Rendered @ floor (64px) | Rendered @ max (72px) |
|--------|-----------|--------------------------|--------------------------|
| Clock | `--clock-w-val = base × 4` (+ `aspect-[16/7]`) | height follows width, no locked height | height follows width, no locked height |
| Clock text | `--clock-text-val = clock-w × 14/64` | 14px (= text-sm, desktop-matching) | 15.8px |
| Clock cell | `--clock-cell-w-val = clock-w × 9.5/64` | 9.5px (matches desktop digit size) | 10.7px |
| Clock colon | `--clock-colon-w-val = clock-w × 7/64` | 7px (desktop-matching advance) | 7.9px |
| CTA / icon touch floor | `min-h-11` (44px) via Tailwind | WCAG 2.5.5/2.5.8 target (R9.1) | — |

Components consuming these: `MobileClock` (`w-clock aspect-[16/7]`),
`MobileHeroCTA` (`min-h-11`), `MobileHeader` (`text-h3`), `MobileHeroSection`
(`text-caption` / `text-hero` / `text-small`).

## 6. How to extend (the recipe)

- **Add a new text size** → usually not needed; reuse an existing token. If genuinely
  new: define `calc(var(--text-base) * N)` (or a `×1.25` chain step) in `:root`,
  **never a literal**.
- **Add a new spacing step** → `calc(var(--spacing-unit) * n)` with `n` an integer.
- **New component size** → derive from `--text-base` / `--spacing-unit`, or use a
  ratio, or `aspect-ratio`. Never introduce an arbitrary pixel.
- **Clock inner segments** → derived from `--clock-w-val` by fixed ratio
  (`9.5/64` cell, `7/64` colon, `14/64` text), never literals. Anchored to the
  desktop's *effective* glyph advance (9.5px digit / 7px colon / 14px font) so the
  mobile hero clock's digits read visually equal to the desktop header clock despite
  the different glyph count (HH:MM vs HH:MM:SS) and smaller frame.
- **Rescale everything** → change only `--text-ratio` / `--text-base` / `--spacing-unit`.
- **Never** add a `px` width/height/font/spacing anywhere in mobile.

## 7. Behavior notes (read before you touch it)

- **Fluid range.** `cqi` = 1% of the nearest `container-type: inline-size` ancestor
  (the mobile shell, capped by `max-w-2xl` = 672px). The scale is **fluid only from
  roughly 342px container width (~375px viewport) until the column fills (~640px
  container ≈ 672px viewport)**. Below that it sits at its 16px floor; above it locks
  at max and holds flat to 1279px. This plateau is correctness per `docs/mobile.md`
  R4.8 — one design for every width — not a bug.
- **Zoom.** Every clamp carries a `rem` term, so 200% browser zoom works (WCAG 1.4.4).
- **`cqi` fallback.** `cqi` needs a container ancestor; outside the shell it falls
  back to the viewport-based `sv*`/leading term behavior. All mobile tokens are
  consumed inside `@container` parents, so this is safe.