# Mobile UI Engineering Rules (0–1279px)

> **The contract:** Mobile = everything below `xl:` (1280px). It is a **vertical-only, phone-first** build. No tablet layouts, no `sm:`/`md:` breakpoints inside mobile components. On any width below 1280px the design is one centered column; if the screen is wider, the column simply stays centered (ramx.in pattern). Above 1280px the existing desktop bento grid takes over.

```
0px ────────────────────────────── 1279px ──── 1280px ────────────>
  MOBILE: single centered column          DESKTOP: bento grid
  mx-auto max-w-2xl px-4                  (existing, untouched)
  NO breakpoints inside
```

> **The ambition:** maximum buttery, cinema-level animation — **no bundle constraint.** Cinema is built the safe way: every animated value is `transform`/`opacity` only, all motion lives in isolated components, and the whole thing can be toned down to "normal" in ~30 minutes without breaking anything (Section 6).

These are **engineering rules** — the logical constraints that prevent the regret you had on desktop (hardcoded heights, magic numbers, brittle layout math). Design is free; these rules are not.

---

## 1. Architecture & Structure

- **R1.1** Keep desktop and mobile in separate component trees. Desktop components (`GridHero`, widgets, etc.) are not touched; mobile components live in `app/components/mobile/`.
- **R1.2** `app/page.tsx` is the **only** file that knows both worlds exist. It renders the desktop grid inside `hidden xl:flex` and the mobile shell inside `xl:hidden`. This is the single responsive switch for the whole homepage.
- **R1.3** Never create `app/mobile/` — that is a *route* (a URL), not a folder. `app/components/mobile/` is the folder.
- **R1.4** One component per file. Compose sections in `MobileHome.tsx` (the shell) — it renders sections, never the section logic itself.
- **R1.5** Do not reuse desktop widget components inside mobile just because they exist. If a widget doesn't fit the vertical narrative, build a mobile-specific one or drop it. Don't fight desktop markup into mobile slots.
- **R1.6** The shell and every section are **server components by default**. Only interactive leaves (menu toggle, any drawer, any accordion) get `"use client"`.

## 2. Sizing — Nothing Hardcoded

- **R2.1** The **only** fixed width in the entire system is the column cap. Everything inside is fluid.
- **R2.2** Zero fixed heights. No `h-[400px]`, no `h-[calc(...)]`, no `h-1/2`. Heights come from content. If a section must feel "full", use `min-h-svh` (viewport floor), never a locked height.
- **R2.3** Zero percentage heights. The desktop grid's `2fr/1fr` pain is exactly what mobile must never repeat. Single column → content defines height, always.
- **R2.4** Widths come from the column and the token scale: `w-full`, `max-w-prose`, `min-w-0`. No arbitrary `w-[123px]`.
- **R2.5** Spacing from the Tailwind scale only (`gap-4`, `py-8`, `p-4`). Any site-wide rhythm is a token in `globals.css` `@theme`, never a per-component magic number.
- **R2.6** Type mobile-first with tokens: base size first, scale up with `sm:` **only if a section genuinely needs it** (see R3.2). No `text-[15px]` magic values. Prefer fluid `clamp()` sizes (see R4.1) over any fixed step.
- **R2.7** `min-w-0` on every flex/grid child that can hold long content. This is the single most common missing piece that causes mobile overflow.

## 3. Breakpoint Discipline

- **R3.1** The only breakpoint in the whole system is the `xl:` desktop gate in `page.tsx`. Mobile components contain **no media queries at all**.
- **R3.2** No `sm:`/`md:` inside mobile components. If the design feels like it needs one, you are designing a tablet layout — stop and reflow the content instead. The column cap absorbs width variance for you.
- **R3.3** Rely on fluid/intrinsic behavior (flex, grid `minmax(0,1fr)`, `w-full`, `overflow-wrap`) rather than any breakpoint to absorb width changes.
- **R3.4** `hover:` styles do not exist on touch. If an interaction must be discoverable, make it visible by default — never reveal-on-hover (see Section 9).

## 4. One UI for Every Device (0–1279) — Dynamic & Scalable

> The whole mobile range is **one layout**, not one-per-device. A 320px phone and a 1279px screen show the *same design*; the only difference is fluid scale and text reflow. This is the ramx.in doctrine: fixed column, fluid everything inside. Nothing is tuned per-device; everything scales. **The multiplier math, knobs, and rendered sizes live in `docs/scale.md` — implement from tokens, not this prose.**

- **R4.1** Fluid typography with `clamp()`: `font-size: clamp(min, calc(x·unit + y·base), max)` where `unit` is `vw` or `cqi`. The `base` (`rem`) term is **mandatory** — it keeps text zoomable (WCAG 1.4.4: 200% zoom must work) and honors the user's font-size preference. Never a bare `vw`/`cqi` and never bare `min`/`max` without a `rem` term. Min/max range ≤ ~2.5× (the web.dev WCAG-safe bound); the 1.25 scale steps stay well inside it.
- **R4.2** Component-relative scaling with container-query units: `font-size: clamp(1rem, 0.5rem + 4cqi, 2rem)` inside a `container-type: inline-size` parent. Card internals scale with the card's own width, not the viewport — one component is correct at 320px and 672px with zero wrapper classes.
- **R4.3** Fluid spacing with `min()`/`max()` or integer multipliers — e.g. `padding: min(2rem, 8vw)` or `gap: calc(var(--spacing-unit) * 4)` — always derived from the token scale, never per-component magic numbers.
- **R4.4** Intrinsic layout: flex + grid `auto-fit`/`minmax()`, `w-full`, `min-w-0`. Never hardcode column counts for a width — let the container negotiate.
- **R4.5** `aspect-ratio` + `object-fit: cover` for media boxes (video previews, images) — identical proportions on every phone, no CLS from size jumps.
- **R4.6** No `px` for **width/height/font/spacing** anywhere. All sizing in `rem`/tokens so one root size drives every device. Borders/shadows/clip-paths/blurs are effect values and are exempt. If you catch yourself adding a `px` size "just for this phone", stop.
- **R4.7** Reserve media queries for **environment, never width**: `pointer: coarse`, `prefers-reduced-motion`, safe-areas. A width check inside a mobile component means you're building a second layout — stop.
- **R4.8** Acceptance test: at 320 / 375 / 414 / 768 / 1279px the page is the *same design* — only scale and wrapping differ. If any width needs a structural tweak, the tweak is wrong, not the width. The scale is fluid only until the column fills (~672px container), then locks flat to 1279px — that plateau is this rule working, not a bug (see `docs/scale.md` §7).

## 5. Performance — Core Web Vitals

- **R5.1** Targets (2026 thresholds, aim under not at): **LCP < 2.5s**, **INP < 200ms**, **CLS < 0.1**. Mobile scores are 2–3x worse than desktop; mobile data is what Google ranks on.
- **R5.2** **implemented** — the desktop grid is client-only, loaded via `matchMedia('(min-width: 1280px)')`-gated `next/dynamic(..., { ssr: false })`; phones never request its chunk, HTML, or `/api` data. Note the SkillStrip exception and the accepted tradeoff (desktop grid leaves raw HTML; widget data now hydrates via `/api` after JS).
- **R5.3** **No hard bundle budget — full cinema is allowed.** Still track size per feature with `@next/bundle-analyzer` so that any future tone-down is a **decision**, not archaeology.
- **R5.4** No long tasks. Any handler that could run > 50ms gets chunked or deferred. Every scroll/tap handler is passive.
- **R5.5** Keep DOM lean: flat structure, < 1,500 nodes, selector depth ≤ 3. Every wrapper div costs layout time on low-end phones.
- **R5.5b** Mobile clock inner segments scale with the bezel via `--clock-w-val` ratios (see `docs/scale.md` §5), so one knob rescales the whole clock with no hardcoded `px` (R4.6).
- **R5.6** `content-visibility: auto` (with `contain-intrinsic-size`) for long below-fold sections so the browser skips rendering them until near-viewport. Never skip the hero (it's the LCP).
- **R5.7** Only animate `transform` and `opacity`. Never `top/left/width/height`. This is the bedrock of both 60fps and tone-down safety (Section 6).

## 6. Cinema & Tone-Down Safety

> Goal: maximum buttery animation, zero constraint. Rule: build it so cinema can be degraded to "normal" in ~30 minutes without breaking a single thing. Both are true because of the rules below. Tone-down is a cheap downgrade, not a rewrite.

- **R6.1** Animate **only `transform` and `opacity`** (R5.7). A transform-based animation can be dropped entirely without touching layout — this single rule is what makes tone-down trivial.
- **R6.2** Isolate all motion logic in dedicated components (`CardStack`, scroll wrappers, etc.). Page/section components stay dumb — they render, they never know *how* things move. Tone-down = swap one component, not the whole tree.
- **R6.3** Motion libraries are **implementation details** — tool-agnostic. framer-motion today, anything tomorrow. As long as it lives behind the isolated components of R6.2, swapping engines is a local change.
- **R6.4** Never let animated values drive layout. Springs control transform/opacity only. A mid-animation width/height change is a bug *and* a tone-down blocker — it means an animation is responsible for layout.
- **R6.5** Content is never gated behind animation. Text, links, and images exist in the DOM at their final positions from first render; animation only *reveals* what's already there. (Also the SEO rule — see R12.6.)
- **R6.6** Every entrance sequence has a `prefers-reduced-motion` path that renders the same content instantly, no animation. This is the free, built-in tone-down — it must always work.
- **R6.7** Track per-feature bundle size (R5.3) so a tone-down decision knows exactly what it buys.
- **R6.8** Final-state test: disable every animation library (and all CSS transitions). If the page is still a complete, correct layout at every width, tone-down is proven safe.

## 7. Images

- **R7.1** Use `next/image` everywhere (never raw `<img>`), except sub-1KB SVG icons/decoration.
- **R7.2** Every image carries explicit `width` + `height` (or `fill` inside a sized `relative` parent). Missing dimensions = CLS, the #1 mobile layout-shift cause.
- **R7.3** `sizes` prop on every responsive/`fill` image — e.g. `sizes="100vw"` for full-column, or `(max-width: 640px) 100vw, 42rem` matching the column cap. Without it the browser downloads desktop-sized images to phones.
- **R7.4** The LCP image (hero): `priority` (or `fetchPriority="high"`), never `loading="lazy"`, never `placeholder="blur"` (adds decode time). One priority image per page.
- **R7.5** All below-fold images: default lazy loading (built-in). Don't lazy-load the hero.
- **R7.6** Set `images.deviceSizes` in `next.config.ts` to match reality — your column caps at ~672px, so trim the huge 2048/3840 variants.
- **R7.7** Static imports for local images (auto width/height + blur placeholder). Configure `remotePatterns` narrowly, never wildcard domains.

## 8. Fonts

- **R8.1** Keep using `next/font` (already in `layout.tsx`) — it self-hosts, sets `font-display`, generates size-adjusted fallbacks, and preloads. This is the correct Next.js font system.
- **R8.2** Do **not** add `@font-face` + manual `font-display: swap` without a size-adjusted fallback — a metric-mismatched swap causes CLS.
- **R8.3** Limit to the font faces actually used above the fold. Every extra face competes with the LCP image for bandwidth on mobile.
- **R8.4** DSEG7/DSEG14 (your digital clock fonts) are already self-hosted via `@font-face` in `globals.css` — fine, but they're decorative; never let them block body text.

## 9. Touch & Interaction

- **R9.1** Touch targets: **≥ 44×44px** (Apple) / 48px (Android) for anything tappable, and ≥ 8px spacing between targets. In Tailwind: `h-11 w-11` minimum for icon buttons, `min-h-11` for inline controls. WCAG 2.5.5/2.5.8.
- **R9.2** Tap area ≠ visual size. An icon can be 16px visually inside a 44px hit area (padding on the button, not the icon).
- **R9.3** No hover-dependent UI. Anything revealed/changed by `:hover` must work by default on touch and for keyboard. Pair every `:hover` with `:focus-visible`/`:focus-within`.
- **R9.4** Use `active:`/pressed states for tap feedback, not `hover:`. A `:active` translate+shadow gives instant physical feedback.
- **R9.5** If you ever need input-capability detection, use CSS `@media (pointer: coarse)` / `any-pointer` — never user-agent sniffing. (Not needed at all if you follow R9.3.)
- **R9.6** Respect `prefers-reduced-motion`: gate the heavy entrance sequences behind it (see R6.6).

## 10. Overflow Prevention (the #1 mobile bug)

- **R10.1** Never size anything with `100vw` when `100%` will do. `100vw` includes the scrollbar and causes horizontal scroll.
- **R10.2** Global baseline already present + add as needed: `box-sizing: border-box` (Tailwind default), `img/video/iframe { max-width: 100% }`.
- **R10.3** `min-width: 0` on flex/grid children (repeat of R2.7 — it's that important).
- **R10.4** Long unbroken strings (URLs, code, IDs) get `overflow-wrap: anywhere`.
- **R10.5** Tables/code blocks scroll **inside their own wrapper** (`overflow-x-auto`), never force the page wider.
- **R10.6** One guard at the shell: `overflow-x-clip` (not `hidden`) on the mobile shell so a misbehaving child can't break the layout — but treat it as a safety net, not a fix. Find and fix the real culprit, don't mask it.
- **R10.7** Debug ritual: DevTools at ~320px, or run a snippet that logs every element wider than `document.documentElement.clientWidth`. Find the widest offender, fix its width — never blanket `overflow-x: hidden`.

## 11. Viewport Units & Safe Areas

- **R11.1** Never `100vh`. Use `100svh` for "fits the visible screen on load" or `100dvh` (with `100vh` fallback line first) when the section should track the browser chrome. On phones `100vh` is taller than the visible area → content hides behind the address bar.
- **R11.2** Prefer `min-h-svh`/`min-h-dvh` over locked heights (aligns with R2.2).
- **R11.3** Add `viewport-fit=cover` to the viewport meta and pad fixed/nav elements with `pb-[env(safe-area-inset-bottom)]` (and the other insets as needed) for notched phones. These are `0` on normal devices — safe to always apply.
- **R11.4** `overscroll-behavior: contain` on any internal scroll container (accordions, drawers) so scroll never chains to the page or triggers pull-to-refresh.
- **R11.5** The virtual keyboard does NOT resize viewport units by default. If you build forms, test on a real device; don't assume `dvh` shrinks for the keyboard.

## 12. Server/Client Boundary & SEO (Next.js)

- **R12.1** Server components by default — they ship **zero** JS to the client. Every section that just renders data stays a server component.
- **R12.2** `"use client"` goes as **deep as possible** — only the leaf that needs `useState`/effects/handlers. A `"use client"` on a wrapper turns its entire subtree into client JS. One bad directive can balloon a page from ~85KB to ~400KB.
- **R12.3** Client components render server components via the `children`/props "donut" pattern when needed. Never import a client-only library into a server component.
- **R12.4** Data fetching happens in server components or the existing `app/lib` fetchers — not in `useEffect`.
- **R12.5** Heavy interactive things (a drawer, a chart, a modal) load with `next/dynamic` + `ssr: false` so they're not in the initial bundle. Reserve `ssr: false` for things that only exist client-side.
- **R12.6** **SEO — content reachability (hard to fix later):** all text destined for search lives in the server-rendered DOM at its final position. Never gate content behind client-only mounts or animation (see R6.5). If Google can't see the text without JS, it's a rankings problem you can't easily undo.
- **R12.7** **SEO — one URL per page:** never split a mobile route (`/m`, separate subdomain). One DOM, one URL — desktop/mobile is the `hidden xl:flex` / `xl:hidden` toggle only. Duplicate-content splits are painful to unwind.
- **R12.8** **SEO — never lock the page behind JS:** don't hijack scrolling or apply permanent `overflow: hidden` to `<body>`. Smooth-scroll libraries are fine as long as content stays in normal document flow and the page is reachable/renderable without JS.

## 13. Bundle Size & Code Splitting

- **R13.1** Import icons by name (`import { FiGithub } from "react-icons/fi"` — your codebase already does this; keep it). Never `import * as`.
- **R13.2** No barrel-file imports (`import { x } from "@/lib"` → import from the specific file).
- **R13.3** Animation libraries are implementation details (R6.3). framer-motion is already installed and sufficient for the deck; add engines freely as long as they live behind the isolated motion components. Every entrance sequence gates behind `prefers-reduced-motion`.
- **R13.4** No hard dependency budget (R5.3). Before adding a library, confirm it can't be done with the tools already in place — but cinema features are authorized. Record the size impact so a future tone-down stays a decision, not a mystery.
- **R13.5** Route-based splitting is automatic. Within the homepage, split anything not visible on load with `next/dynamic`.

## 14. Data — Single Source of Truth

- **R14.1** All content comes from `app/data/profile.ts` (and the `app/lib` fetchers). Zero content hardcoded in components. Same data, new layout.
- **R14.2** If mobile needs a subset or reshaped version, derive it in `app/data` or a mobile-local constant — never inline magic values in JSX.

---

## Build Flow — First Things First, Systematic

Built in phases, each gated and verifiable, so a mistake is caught where it's made and never compounds. The card-stack's layered interaction build lives in a separate plan; this is the global order.

1. **Phase 0 — Shell + router (done).** `app/components/mobile/MobileHome.tsx` (server component, `mx-auto max-w-2xl px-4`, `overflow-x-clip`) + `app/page.tsx` switch. Verify at 1279px (mobile) and 1280px (desktop). This is the only responsive switch — never touch breakpoints again.

2. **Phase 1 (done) — Foundation tokens.** Define the fluid scale in `globals.css` `@theme`: `clamp()` type scale (R4.1), `min()`/`max()` spacing tokens (R4.3). Establish the `prefers-reduced-motion` baseline (R6.6). Everything downstream consumes these tokens.

3. **Phase 2 — Sections in dependency order.** Header → Hero (LCP) → Contribution graph → card-stack shell (static only) → Bottom bar. Each is a server component, `w-full`, content-driven height, token spacing, no breakpoints, no hover-only UI, data from `profile.ts`.

4. **Phase 3 — Interactive leaves last.** Gestures, tabs, arrows, any drawer — added only after the static page is fully correct. Every gesture has its single-pointer equivalent wired to the *same* motion function (arrows/tabs reuse the deck's fly/settle/swap commands).

5. **Phase 4 — Cinema pass.** The deck's gestures, tutorial overlay, self-nudge, and easter eggs go through the layered card-stack build plan (kept separate by design). All motion behind the R6.2 isolated components, all transform/opacity only.

6. **Phase 5 — Full-range verification.** Test at 320 / 375 / 414 / 768 / 1279px + browser zoom (200%) + `prefers-reduced-motion` + Lighthouse. Run `npm run lint` after every section and check the bundle with the analyzer before moving on (R5.3).

> **Final guardrail:** when you're done, the mental test is — *disable all breakpoints in CSS. If the mobile page still works, it's genuinely mobile-first.* And the tone-down test (R6.8): disable every animation library. If the page is still a complete, correct layout, cinema was built safely.
