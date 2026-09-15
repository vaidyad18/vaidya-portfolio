Everything is verified. Here is the execution-ready plan — file-by-file, with exact code, so the implementing agent makes zero decisions.

# Phase 0.5 — Desktop/Mobile UI Split (execution plan)

**Goal:** phones never download the desktop grid's JS, HTML, or data. Desktop keeps SSR hero (SEO/LCP) + layout-stable skeleton first paint.
**Verified facts the plan relies on:** all four `/api` routes return the exact shapes the widgets consume; `GithubData` and `NormalizedCodeforcesDto` types already exist in `app/lib/schemas.ts`; `GithubCalendarUI` (client) accepts `{githubData, leetcodeData, codeforcesData}`.
**Lint rule to expect:** `react-hooks/set-state-in-effect` fires on new setState-in-effect. Repo convention = `// eslint-disable-next-line react-hooks/set-state-in-effect` + short justification (see `ThemeProvider.tsx:22`, `HeaderClock.tsx:46`, `GenieModal.tsx:29`).

---

## Step 1 — New file: `app/lib/use-match-media.ts`

```tsx
"use client";
import { useState, useEffect } from "react";

export function useMatchMedia(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches); // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from browser, idempotent
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}
```
Returns `null` during SSR / pre-hydration → callers render skeleton. Listeners cleaned up on unmount.

## Step 2 — New file: `app/lib/use-client-data.ts`

```tsx
"use client";
import { useState, useEffect } from "react";

export function useClientData<T>(url: string): { data: T | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    setLoading(true); // eslint-disable-next-line react-hooks/set-state-in-effect -- resets flag when URL changes; idempotent
    fetch(url)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((json: T) => { if (!active) { return; } setData(json); setError(null); })
      .catch((e: unknown) => { if (!active) { return; } setError(e instanceof Error ? e.message : "Fetch failed"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [url]);
  return { data, loading, error };
}
```
If lint flags the `.then`/`.finally` setState calls (it shouldn't — they're async callbacks), add the same disable comment on the flagged line. `active` guard prevents setState after unmount.

## Step 3 — Edit `app/lib/schemas.ts`: add one shared type

Append (near line 144):

```ts
export type LeetCodeApiResponse = {
  data?: {
    allQuestionsCount?: Array<{ difficulty: string; count: number }>;
    matchedUser?: {
      submitStats?: { acSubmissionNum?: Array<{ difficulty: string; count: number }> };
      calendarCurrent?: { submissionCalendar?: string } | null;
      calendarPrev?: { submissionCalendar?: string } | null;
    } | null;
    userContestRanking?: { rating?: number; topPercentage?: number } | null;
  } | null;
  calendar?: Record<string, number>;
};
```

## Step 4 — Convert 5 widgets: server → client

Pattern for **all five**: add `"use client";` as the **first line**; delete the `getXData`/`api-fetchers` import; add `useClientData` import; replace the top `await`-based data lines with the hook; guard `loading` with the existing skeleton export; keep **all JSX and helper logic identical**; keep the existing skeleton export functions.

**4a. `app/components/GithubCalendar.tsx`** (has no skeleton today — add one)
- Imports: `import { useClientData } from "@/app/lib/use-client-data";` and `import type { GithubData, NormalizedCodeforcesDto, LeetCodeApiResponse } from "@/app/lib/schemas";`
- Remove the whole `export default async function` + `await Promise.all` block. New body:
```tsx
export default function GithubCalendar() {
  const github = useClientData<GithubData>("/api/github");
  const leetcode = useClientData<LeetCodeApiResponse>("/api/leetcode");
  const codeforces = useClientData<NormalizedCodeforcesDto>("/api/codeforces");
  if (github.loading || leetcode.loading || codeforces.loading) return <GithubCalendarSkeleton />;
  return (
    <GithubCalendarUI
      githubData={github.data ?? { total: {}, contributions: [] }}
      leetcodeData={leetcode.data?.calendar || {}}
      codeforcesData={codeforces.data?.calendar || {}}
    />
  );
}
```
- Add `export function GithubCalendarSkeleton()` — a plain static RetroCard-shaped placeholder (header bar + grid of muted squares). Do **not** import RetroCard here (see Step 6 rationale); use plain Tailwind divs.

**4b. `app/components/LeetCodeWidget.tsx`**
- Replace `const lcData = await getLeetcodeData();` with:
```tsx
const { data: lcData, loading } = useClientData<LeetCodeApiResponse>("/api/leetcode");
if (loading) return <LeetCodeSkeleton delay={delay} className={className} style={style} />;
```
- Change line 29 `if (lcData.data) {` → `if (lcData?.data) {`. Everything else (shaping, JSX, `LeetCodeSkeleton`) unchanged.

**4c. `app/components/CodeforcesWidget.tsx`**
- Replace `const cfData = await getCodeforcesData();` with:
```tsx
const { data: cfData, loading } = useClientData<NormalizedCodeforcesDto>("/api/codeforces");
if (loading) return <CodeforcesSkeleton delay={delay} className={className} style={style} />;
```
- Lines 32–36 become: `const rating = cfData?.rating ?? 0; const maxRating = cfData?.maxRating ?? 0; const rank = cfData?.rank ?? "unrated"; const solvedCount = cfData?.solvedCount ?? 0; const contestCount = cfData?.contestCount ?? 0;`

**4d. `app/components/GithubStatsWidget.tsx`**
- Replace `const githubData = await getGithubData();` with:
```tsx
const { data: githubData, loading } = useClientData<GithubData>("/api/github");
if (loading) return <GitArchiveSkeleton delay={delay} className={className} style={style} />;
```
- Everything else unchanged (it already optional-chains `githubData?.stats?.publicRepos` etc.).

**4e. `app/components/CommitFeed.tsx`**
- Replace `const fetchedCommits = await getCommitFeed();` with:
```tsx
const { data: fetchedCommits, loading } = useClientData<Commit[]>("/api/github-activity");
if (loading) return <CommitFeedSkeleton delay={delay} className={className} style={style} />;
```
- Line 81 `const commits = fetchedCommits.length > 0 ? ...` → `const commits = fetchedCommits && fetchedCommits.length > 0 ? fetchedCommits : mockFallbackCommits;`. Keep the mock-fallback fill loop and all JSX.

**Untouched:** `app/lib/api-fetchers.ts`, all four `app/api/*/route.ts`.

## Step 5 — New file: `app/components/desktop/DesktopGridSkeleton.tsx`

**No `"use client"`.** Pure static Tailwind divs — **deliberately no RetroCard/framer-motion imports** so the SSR skeleton ships zero widget JS. 7 placeholder cells, each wrapped in the exact grid-item classes used today (`h-full min-h-0 flex flex-col clip-margin-5`):
- Cell A (Experience): bordered box, header bar, 2 muted text lines, footer bar.
- Cell B (Projects): same shape.
- Cell C (Commit feed): header + vertical timeline dots (muted squares).
- Cell D (Calendar): header + grid of ~20 small muted squares.
- Cell E/F/G (LeetCode/Codeforces/Git archive): header + 2–3 muted bars.
- Use `animate-pulse` (pure CSS, no JS).

`clip-margin-5` is a custom class already used in `GridHero.tsx` — confirm it exists in `globals.css` during implementation; reuse it verbatim.

## Step 6 — New file: `app/components/desktop/DesktopGrid.tsx`

`"use client"`. Fragment of the 7 **live** cells, exact classes copied from `GridHero.tsx`:

```tsx
"use client";
import ExperienceCard from "../ExperienceCard";
import ProjectsDrawer from "../ProjectsDrawer";
import CommitFeed from "../CommitFeed";
import AnimatedCell from "../AnimatedCell";
import GithubCalendar from "../GithubCalendar";
import LeetCodeWidget from "../LeetCodeWidget";
import CodeforcesWidget from "../CodeforcesWidget";
import GithubStatsWidget from "../GithubStatsWidget";

export default function DesktopGrid() {
  return (
    <>
      <div className="h-full min-h-0 flex flex-col clip-margin-5"><ExperienceCard delay={0.5} /></div>
      <div className="h-full min-h-0 flex flex-col clip-margin-5"><ProjectsDrawer delay={0.6} /></div>
      <div className="h-full min-h-0 flex flex-col clip-margin-5"><CommitFeed delay={0.7} /></div>
      <div className="h-full min-h-0 flex flex-col clip-margin-5">
        <AnimatedCell delay={0.5} className="h-full w-full flex flex-col justify-end"><GithubCalendar /></AnimatedCell>
      </div>
      <div className="h-full min-h-0 flex flex-col clip-margin-5"><LeetCodeWidget delay={0.55} /></div>
      <div className="h-full min-h-0 flex flex-col clip-margin-5"><CodeforcesWidget delay={0.65} /></div>
      <div className="h-full min-h-0 flex flex-col clip-margin-5"><GithubStatsWidget delay={0.75} /></div>
    </>
  );
}
```
(Relative imports `../` because the folder is `app/components/desktop/`.)

## Step 7 — New file: `app/components/desktop/DesktopOnly.tsx`

```tsx
"use client";
import dynamic from "next/dynamic";
import { useMatchMedia } from "@/app/lib/use-match-media";
import DesktopGridSkeleton from "./DesktopGridSkeleton";

const DesktopGrid = dynamic(() => import("./DesktopGrid"), {
  ssr: false,
  loading: () => <DesktopGridSkeleton />,
});

export default function DesktopOnly() {
  const isDesktop = useMatchMedia("(min-width: 1280px)");
  if (isDesktop === null) return <DesktopGridSkeleton />;
  return isDesktop ? <DesktopGrid /> : null;
}
```
Behavior: SSR + pre-hydration → skeleton (matches SSR, no hydration mismatch); desktop → `ssr:false` chunk loads → live cells; phone → `null` → chunk **never requested**; resize both ways → mounts/unmounts correctly.

## Step 8 — Rewrite `app/page.tsx`

```tsx
import HeroSection from "./components/HeroSection";
import SkillStrip from "./components/SkillStrip";
import DesktopOnly from "./components/desktop/DesktopOnly";
import MobileHome from "./components/mobile/MobileHome";

export default function Home() {
  return (
    <>
      <main className="hidden xl:flex flex-1 flex-col bg-background overflow-visible xl:[@media(min-height:768px)]:overflow-hidden">
        <section className="w-full px-6 md:px-12 pt-3 md:pt-4 xl:pt-6 pb-6 flex-grow min-h-0 flex flex-col relative overflow-x-hidden overflow-y-visible xl:[@media(min-height:768px)]:overflow-hidden">
          <div className="w-full h-auto xl:[@media(min-height:768px)]:h-full xl:[@media(min-height:768px)]:max-h-[900px] xl:[@media(min-height:768px)]:my-auto min-h-0 flex flex-col">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_repeat(3,240px)] xl:[@media(max-height:767px)]:grid-rows-[minmax(250px,55vh)_auto] xl:[@media(min-height:768px)]:grid-rows-[minmax(0,2fr)_minmax(0,1fr)] gap-4 h-auto xl:[@media(min-height:768px)]:h-full">
              <div className="h-full min-h-0 flex flex-col justify-start clip-margin-5">
                <HeroSection />
              </div>
              <DesktopOnly />
            </div>
          </div>
        </section>
        <div className="hidden xl:block mt-auto">
          <SkillStrip />
        </div>
      </main>
      <MobileHome />
    </>
  );
}
```
This preserves `GridHero`'s exact grid + classes; hero (cell 1) stays SSR for SEO/LCP; `DesktopOnly` fills cells 2–8 via its fragment.
**Delete `app/components/GridHero.tsx`** (dead code — no longer imported anywhere).

**Documented decision (do not change):** `SkillStrip` stays SSR'd as today. It's a tiny marquee; gating it risks the `mt-auto` flex layout with near-zero payoff. The heavy desktop UI (widgets, calendar, framer-motion grid) is what gets excluded from phones. If you want SkillStrip gated later, do it as a separate follow-up — not in this phase.

## Step 9 — Update `docs/mobile.md` R5.2

- Grep `docs/mobile.md` for `R5.2` (or `matchMedia`). It currently says the desktop grid still mounts/fetches on phones and to gate it "when mobile ships." Rewrite it to: **implemented** — the desktop grid is client-only, loaded via `matchMedia('(min-width: 1280px)')`-gated `next/dynamic(..., { ssr: false })`; phones never request its chunk, HTML, or `/api` data. Note the SkillStrip exception and the accepted tradeoff (desktop grid leaves raw HTML; widget data now hydrates via `/api` after JS).

## Step 10 — Verify

1. `npx eslint .` → **exit 0**. If new `set-state-in-effect` flags appear, add the repo-standard disable comment (not `any`, not suppressing the whole file).
2. `npm run build` → pass.
3. `npm run dev`, DevTools → **Network**:
   - At <1280px: no request containing `DesktopGrid`/widget chunk names; no `/api/*` calls; page shows only mobile shell.
   - Resize to ≥1280px: widget chunk + `/api/github`, `/api/leetcode`, `/api/codeforces`, `/api/github-activity` fire; skeleton cells swap to live grid.
   - Resize back <1280px: grid unmounts, zero console errors.
   - First load at both widths: no hydration warnings in console.
4. `curl http://localhost:3000` (SSR HTML) at each width: contains hero text + skeleton placeholders + mobile shell; **no** widget data.

**Do not commit** unless the user explicitly asks.

---

**Scope summary:** 3 new files in `app/lib`, 3 new files in `app/components/desktop/`, 5 widget edits, `schemas.ts` +1 type, `page.tsx` rewrite, delete `GridHero.tsx`, `docs/mobile.md` R5.2 edit. Untouched: `api-fetchers.ts`, all `/api` routes, `Navbar`, `layout.tsx`, `MobileHome`, `ui/*` primitives, `ThemeProvider`, all route pages.

Ready to execute on your green light.

read this plan completely end to end

tell me if understood if not even minor ask me in point format
if understood tell it