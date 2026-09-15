# SEO Master Plan — medhanshk.me (v2026-08-22b)

> **Single goal:** rank **#1 for the entity "Medhansh Kapoor"** — in Google *and* in LLMs (ChatGPT, Perplexity, Gemini, Google AI Overviews / AI Mode).
>
> **Finish line:** a Google Knowledge Panel for "Medhansh Kapoor" + being the sole cited entity when anyone asks "Who is Medhansh Kapoor?" to any AI engine.
>
> This is a **360° plan** — on-page, technical, GEO/AEO, off-page (self-serve), and LLM visibility. Every item exists to make one machine-understandable claim:
> *"Medhansh Kapoor = the AI/ML engineer & full-stack developer based in Jaipur, India, working under IndiaAI Mission (MeitY) and ISSA-DRDO, reachable at medhanshk.me."*

Every item carries a status — **DONE** / **PARTIAL** / **MISSING** / **FAIL** — with a `file:line` reference where the fix lives. Phases are ordered by ROI; do them in order.

---

## 0. Baseline facts (re-gathered 2026-08-22)

Production Lighthouse **mobile** (throttled — the ranking-relevant run): Performance **83**, Accessibility **86**, Best Practices **96**, SEO **100**, **Agentic-browsing 50**. FCP **1.2 s**, **LCP 3.0 s (FAIL)**, Speed Index 4.5 s, TBT **350 ms**, CLS **0**. LCP element is now the **`nyayaai.webp` `<img>`** on the mobile project card (not the `<h1>` anymore).

Production Lighthouse **desktop** (unthrottled — UX only, not used for ranking): Performance 97, Accessibility 83, Best Practices 96, SEO 100, Agentic-browsing 49. LCP 0.8 s, TBT 20 ms, CLS 0.058.

Live checks against `https://medhanshk.me` (curl, 2026-08-22):

- `robots.txt` → **404** · `sitemap.xml` → **404** · `llms.txt` → **404** · `opengraph-image` → **404** · `resume.pdf` → **200** · `favicon.ico` → **200**.
- Served `<head>` contains **only** `<title>Medhansh Kapoor</title>` + one `<meta name="description">`. **Zero** `og:`, `twitter:`, `canonical`, `robots`, or JSON-LD tags (grep on raw HTML: `og:`=0, `ld+json`=0, `canonical`=0).
- **Two `<h1>`s** in the homepage DOM (desktop + mobile hero variants) — still unresolved.
- Videos were converted `.mp4` → `.webm` and posters were added, but desktop still ships **13.2 MB of media** (each `.webm` fetched **twice** via 206 range requests) → total desktop weight **13.78 MB**. Mobile run fetches zero `.webm`.
- `errors-in-console` still fires: **Minified React #418** hydration mismatch (`_next/static/chunks/3kw1yyr4uuo_n.js`).
- **`FiLinkedin` is imported but never rendered** — the LinkedIn link is missing from every page (`app/components/HeroSection.tsx:7`).
- Lighthouse now has an **"Agentic browsing"** category (score 50) measuring `llms.txt`, the accessibility tree, and WebMCP. A clean `llms.txt` + clean a11y tree directly raise it — the same fixes that help Google also help AI agents cite you.

> ⚠ **Do not read "SEO 100" as done.** Lighthouse's SEO category does **not** score `robots.txt`, `sitemap.xml`, canonicals, or JSON-LD. Every gap below remains open despite the 100.

---

## 1. Entity definition & keyword map (do once — it drives everything)

The entity is **"Medhansh Kapoor"** — one canonical identity used identically in the site, JSON-LD, GitHub, LinkedIn, X, Instagram, and cal.com.

- [x] Canonical name: **"Medhansh Kapoor"** everywhere (decided 2026-08-22). Site currently renders the H1 as just `"Medhansh"` — fix in Phase 5.
- [x] Canonical job title: **"AI/ML Engineer & Full-Stack Developer"**.
- [x] `sameAs` set: **GitHub + LinkedIn + X + Instagram + cal.com + Wikidata (once created, Phase 9)** (decided 2026-08-22).
- [ ] No image/headshot — deferred until a real photo exists (do **not** fabricate `Person.image` or an OG image).

| Page | Primary keyword (entity + intent) | Secondary terms |
|------|-----------------------------------|-----------------| 
| `/` | **Medhansh Kapoor** (brand/navigational) | AI/ML engineer India, portfolio |
| `/projects` | AI/ML projects | JanSamadhan, NyayaAI, RAG, LangGraph, YOLOv8 |
| `/experience` | AI/ML engineer experience | IndiaAI Mission MeitY, ISSA DRDO, software engineering intern |
| `/about` | about Medhansh Kapoor | AI engineer Jaipur, achievements, education |

- [ ] **Cannibalization validation**: verify that home (`/`) and about (`/about`) do not compete for the same "Medhansh Kapoor" query. Home = brand/navigational entity; about = biographical/informational intent. If they compete, differentiate the title tags + H1s further (e.g., about → "About Medhansh Kapoor — Background, Education & Achievements").
- [ ] The bare-name query "Medhansh Kapoor" is contested (a filmmaker owns `medhanshk.com`; other same-name people on LinkedIn). **Entity disambiguation is the whole game** — the winning move is `Person` schema + `sameAs` + `disambiguatingDescription` (Phase 4) + a live LinkedIn cross-link (Phase 5) + Wikidata entry (Phase 9) + Knowledge Panel (Phase 10).

---

## Phase 1 — Measurement & verification (set up before you fix)

- [x] **Google Search Console** — verified `medhanshk.me`. Sitemaps submitted (`5 discovered URLs`). (Completed 2026-08-22).
- [x] **Bing Webmaster Tools** — imported from GSC, IndexNow key file (`public/4acab0b6b1664896bf7d6705e9b0908f.txt`) configured and sitemap submitted (`5 discovered URLs`). (Completed 2026-08-22).
- [x] **GA4** — Measurement ID `G-D064XWFM94` added to `app/layout.tsx` via `@next/third-parties/google` with automatic `file_download` tracking for `/resume.pdf`. (Completed 2026-08-22).
- [x] Write down KPIs: position for "Medhansh Kapoor" / "AI/ML engineer India" / "AI engineer Jaipur"; organic clicks to `/`; `resume.pdf` download events. (Completed 2026-08-22).
- [x] Rank tracking via GSC position (+ a paid tracker later; none owned yet — GSC is enough to start). (Completed 2026-08-22).
- [x] Track **AI-referral traffic** in GA4 (referrers `chatgpt.com`, `perplexity.ai`, `gemini.google.com`). (Completed 2026-08-22).
- [x] **Google Alerts** — skipped / not needed for personal dev workflows.
- [x] **Manual AI citation baseline** — completed on 2026-08-22 across Google Search, ChatGPT, and Perplexity:
  - **Google Featured Snippet**: Ranks #1 with direct citation of `medhanshk.me/about`.
  - **ChatGPT & Perplexity**: Cites `medhanshk.me` and GitHub `Medhansh-741`, but conflates entity with other Medhansh Kapoors (filmmaker at `medhanshk.com` & school records).
  - **Key Disambiguation Takeaway**: Proves Phase 4 (JSON-LD `Person` schema with `sameAs`) & Phase 5 (live LinkedIn reciprocal link) are strictly required.

---

## Phase 2 — Indexability & crawlability (P0 — nothing else matters if Google can't crawl you)

| # | Fix | Status | Evidence / where |
|---|-----|--------|------------------|
| 2.1 | Create `app/robots.ts` — allow all public + explicit AI-bot policy, `Disallow: /api/`, point to sitemap, **never** block `/_next/` | **DONE** | `app/robots.ts` serving `/robots.txt` |
| 2.2 | Create `app/sitemap.ts` — list `/`, `/projects`, `/experience`, `/about`, `/resume.pdf` with `lastModified` | **DONE** | `app/sitemap.ts` serving `/sitemap.xml` |
| 2.3 | Submit sitemap in GSC + Bing, enable IndexNow | **DONE** | GSC & Bing verified (5 discovered URLs, 0 errors) |
| 2.4 | Self-referencing `rel="canonical"` on every indexable page (`alternates.canonical`) | **DONE** | Server Component metadata exports on `/`, `/projects`, `/experience`, `/about` |
| 2.5 | `metadataBase` set so relative OG/canonical URLs resolve | **DONE** | `metadataBase: new URL("https://medhanshk.me")` in `app/layout.tsx:47` |

**Implementation:** `app/robots.ts` → `MetadataRoute.Robots` with `rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }]` + `sitemap: "https://medhanshk.me/sitemap.xml"`. `app/sitemap.ts` → `MetadataRoute.Sitemap` with the 4 routes + `/resume.pdf`. Both are Next.js file conventions served automatically at `/robots.txt` and `/sitemap.xml`.

**AI-bot policy in `robots.ts`** (Phase 8 cross-ref): explicitly **allow** `OAI-SearchBot`, `ChatGPT-User`, `GPTBot`, `ClaudeBot`, `Claude-SearchBot`, `PerplexityBot`, `Perplexity-User`, `Google-Extended`, `Bingbot`, `Applebot`, `CCBot`. Blocking retrieval bots = invisible to AI answers.

---

## Phase 3 — On-page metadata (titles, descriptions, OG/twitter)

The single highest-impact on-page element is a **unique, keyword-front-loaded `<title>` per page**. Today 3 of 4 pages inherit the homepage title.

| # | Fix | Status | Evidence / where |
|---|-----|--------|------------------|
| 3.1 | Root metadata: `metadataBase`, `title.template`, full `description`, `openGraph`, `twitter`, `robots` | **DONE** | `app/layout.tsx:47-75` |
| 3.2 | `generateMetadata` (or colocated `metadata.ts`) for `/projects`, `/experience`, `/about` | **DONE** | Server Component metadata exports on `/projects`, `/experience`, `/about` |
| 3.3 | Homepage title front-loads "Medhansh Kapoor — AI/ML Engineer…" (currently bare "Medhansh Kapoor") | **DONE** | `title.default` in `app/layout.tsx` |
| 3.4 | Implement `og:title`, `og:description`, `og:url`, `og:type`, `twitter:card`, `twitter:title`, `twitter:description` on **every page** — these do NOT need an image | **DONE** | Full OG and Twitter card tags rendered on `/`, `/projects`, `/experience`, `/about` |
| 3.5 | `og:image` + `twitter:image` — **deferred** until a real photo/logo exists (decided) | **DEFERRED** | `opengraph-image` → 404 |

> ⚠ **Note on Formally Created About Section:** The `/about` page now formally features the "How I Build" engineering philosophy, Achievements, and Education sections with tailored project-agnostic metadata in `app/about/page.tsx`.

**Key Next.js constraint:** metadata exports only work in **Server Components**. `/projects`, `/experience`, `/about` are `"use client"`, so put `metadata`/`generateMetadata` in a colocated `app/*/metadata.ts` server module, or convert the pages to Server Components with client islands.

**Recommended values** (single source of truth = `app/data/profile.ts`):

- Home: `Medhansh Kapoor — AI/ML Engineer & Full-Stack Developer`
- Projects: `Projects — Medhansh Kapoor`
- Experience: `Experience — Medhansh Kapoor`
- About: `About — Medhansh Kapoor`
- Template: `%s | Medhansh Kapoor`; keep each description 120–160 chars with the primary keyword + a CTA.

---

## Phase 4 — Structured data (JSON-LD) — the disambiguation lever

Comprehensive, linked Schema.org structured data (JSON-LD) implemented across all server routes via `app/lib/jsonld.tsx`, establishing a distinct machine-readable entity for **"Medhansh Kapoor"** tied to `@id: "https://medhanshk.me/#person"`.

| Schema | Where | Status | Evidence / where |
|--------|-------|--------|------------------|
| `Person` (+ `sameAs`, `jobTitle`, `worksFor`, `alumniOf`, `knowsAbout`, `disambiguatingDescription`) | root graph (`layout.tsx`) | **DONE** | `app/lib/jsonld.tsx` & `app/layout.tsx:100` |
| `WebSite` (publisher/author → `#person`) | root graph (`layout.tsx`) | **DONE** | `app/lib/jsonld.tsx` & `app/layout.tsx:100` |
| `ProfilePage` (`mainEntity` → `#person`) | `/` & `/about` | **DONE** | `app/page.tsx` & `app/about/page.tsx` |
| `CollectionPage` + `ItemList` (`SoftwareApplication` for JanSamadhan & NyayaAI) | `/projects` | **DONE** | `app/projects/page.tsx` |
| `WebPage` (`mainEntity` → `#person`) | `/experience` | **DONE** | `app/experience/page.tsx` |
| `FAQPage` | home/about | **PENDING** | Scheduled with Phase 8.1 FAQ content creation |

**Rules & Implementation Status:**
- [x] One stable `@id` for the Person node everywhere: `https://medhanshk.me/#person`.
- [x] `sameAs` = the 5 verified profiles (GitHub `https://github.com/Medhansh-741`, LinkedIn `https://www.linkedin.com/in/medhansh-kapoor`, X `https://x.com/medhansh541`, Instagram `https://www.instagram.com/medhansh341/`, cal.com `https://cal.com/medhansh541`). Ready for Wikidata QID in Phase 9.3.
- [x] `disambiguatingDescription: "AI/ML engineer & full-stack developer based in Jaipur, India, working under IndiaAI Mission (MeitY) and ISSA-DRDO."`
- [x] `jobTitle: "AI/ML Engineer & Full-Stack Developer"`, `worksFor: ["IndiaAI Mission (MeitY)", "ISSA – DRDO", "Geminid Systems"]`, `alumniOf: ["Manipal University Jaipur", "VVDAV Public School, New Delhi"]`, `addressLocality: "Jaipur"`.
- [x] `knowsAbout`: Dynamic flattening of all 42+ technical skills from `app/data/profile.ts`.
- [x] XSS-safe serialization (`\u003c`) directly injected into Next.js Server Components.

---

## Phase 5 — Entity & content signals (make the claim visible on-page)

| # | Fix | Status | Evidence / where |
|---|-----|--------|------------------|
| 5.1 | **One H1 per page**; homepage H1 = "Medhansh Kapoor" (desktop + mobile normalized, single semantic H1 in DOM) | **DONE** | `app/components/HeroSection.tsx:38-52` & `app/components/mobile/MobileHeroSection.tsx:14-25` |
| 5.2 | **Render the LinkedIn link** + `rel="me"` on GitHub/LinkedIn/X/Instagram/cal | **DONE** | `app/components/HeroSection.tsx` & `app/components/mobile/MobileHeroCTA.tsx` |
| 5.3 | Fix GitHub URL inconsistency (`Medhansh-741/` vs `Medhansh-741`) | **DONE** | `app/data/profile.ts:7` & `app/lib/jsonld.tsx` |
| 5.4 | Fix dangling `#` deep-links (project cards have `id` targets) | **DONE** | `app/projects/ProjectsView.tsx:48` |
| 5.5 | Fix heading order — ensure `<h2>` hierarchy under `<h1>` without level skips | **DONE** | `app/components/mobile/MobileExperienceCard.tsx:29` & `app/components/mobile/MobileProjectModal.tsx:55` |
| 5.6 | Add visible "last updated" + machine `dateModified` (freshness signal LLMs + Google weight) | **DONE** | `app/lib/jsonld.tsx` (Schema `dateModified: 2026-08-23`) |
| 5.7 | Answer-first content: one-sentence "Medhansh Kapoor is…" definition right under the H1 (40–50 words, self-contained, speakable-ready). | **DONE** | `app/components/HeroSection.tsx:68-70` |
| 5.8 | **Image alt text audit**: every `<img>` (project posters, screenshots, modals) has descriptive, contextual alt text. | **DONE** | `app/components/mobile/CardDeckVideo.tsx:20` & `app/components/mobile/MobileProjectModal.tsx:93` |
| 5.9 | **Internal linking strategy**: cross-link all pages with descriptive anchor text. | **DONE** | Cross-navigation footers on `/projects`, `/experience`, `/about` |
| 5.10 | **E-E-A-T signals**: add visible credentials/bio snippet, contact endpoints, verified social links | **DONE** | `app/components/HeroSection.tsx` & `app/about/AboutView.tsx` |
| 5.11 | **URL slug acknowledgment**: clean lowercase slugs with primary keywords | **OK** | Slugs `/`, `/projects`, `/experience`, `/about` |

**The H1 fix (5.1) is the highest-priority content change.** Options: keep the desktop H1 and mark the mobile one `aria-hidden`/`sr-only`, or share one hero. Mobile-only indexing means the DOM must contain exactly one H1.

**5.2 is the strongest disambiguation signal available to you** — a visible LinkedIn link with `rel="me"` (and the LinkedIn profile linking back to `medhanshk.me`) is how Google resolves you vs. the other Medhansh Kapoors. The `rel="me"` must be a **reciprocal loop** — your site links to LinkedIn with `rel="me"`, AND your LinkedIn "Website" field points back to `medhanshk.me`. Same for GitHub, X, Instagram, cal.com.

**5.8 image alt text guidelines:**
- Describe what the image *communicates*, not just what it shows (e.g., "NyayaAI — RAG-based legal research tool showing case search results" not "screenshot of app").
- Keep 80–140 characters. Don't start with "Image of" or "Picture of" (screen readers already announce it).
- Only include keywords if they fit naturally.
- Decorative images (dividers, background flourishes) → `alt=""`.
- LCP image (`nyayaai-poster.webp`) alt text matters for SEO — Google weights it.

**5.9 internal linking map:**

| From | To | Anchor text example |
|------|----|-------------------|
| `/` (hero/projects section) | `/projects` | "View all AI/ML projects" |
| `/` (experience section) | `/experience` | "Full work experience" |
| `/projects` (JanSamadhan card) | `/experience` | "Built during IndiaAI Mission (MeitY)" |
| `/projects` (NyayaAI card) | `/about` | "Read about the tech stack" |
| `/experience` (IndiaAI role) | `/projects` | "See JanSamadhan — the civic complaint platform" |
| `/about` (skills section) | `/projects` | "Projects built with these technologies" |
| `/about` | `/experience` | "Professional experience timeline" |
| All sub-pages (footer/nav) | `/` | "Medhansh Kapoor — Home" |

---

## Phase 6 — Performance & Core Web Vitals (LCP 3.0s must come down)

| # | Fix | Status | Evidence / where |
|---|-----|--------|------------------|
| 6.1 | Shrink videos: `jansamadhan` & `nyayaai` video assets compressed with `-an` audio stripped & `+faststart` streaming | **DONE** | `public/videos/` (`.mp4` / `.webm` re-encoded) |
| 6.2 | Stop double-fetch: `preload="none"` on video components prevents double range requests | **DONE** | `app/components/ui/SharedVideoPreview.tsx:17` & `app/components/mobile/CardDeckVideo.tsx:62` |
| 6.3 | LCP element (`nyayaai.webp`): `priority={true}` & `fetchPriority="high"` on LCP `<img>` | **DONE** | `app/components/mobile/CardDeckVideo.tsx:24-25` |
| 6.4 | Fix React #418 hydration mismatch (prevent pre-hydration render drift) | **DONE** | Resolved hydration attributes across root layouts and views |
| 6.5 | Reduce framer-motion entrance cost (minimize LCP render delay) | **DONE** | `HeroSection.tsx` & optimized stagger animations |
| 6.6 | Add `font-display: "swap"` to DSEG `@font-face` (eliminate FOIT) | **DONE** | `app/layout.tsx:35,43` (`display: "swap"`) |
| 6.7 | **Security headers** (HSTS, CSP, Permissions-Policy): configure A+ security headers | **DONE** | `next.config.ts:7-34` & `vercel.json:14-25` |
| 6.8 | **Favicon quality audit**: verify `favicon.ico` output size (48×48 Google SERP compliance) | **DONE** | `app/favicon.ico/route.tsx:35-36` (`48x48`) |
| 6.9 | **Custom 404 page**: create `app/not-found.tsx` with navigation back to main content (home, projects, experience, about) | **DONE** | `app/not-found.tsx:28-46` (with section recovery links) |

**Targets (mobile p75):** LCP ≤ 2.5 s (aim ≤ 2.0 s — some 2026 guidance cites a lowered 2.0 s threshold; be safe), INP ≤ 200 ms, CLS ≤ 0.1, FCP < 0.4 s (FCP matters most for AI citations). Convert videos to ~1–2 MB each, add `preload="none"`, and serve optimized `.webp` previews.

**Security headers implementation:**
```ts
// next.config.ts headers
{
  key: "Strict-Transport-Security",
  value: "max-age=63072000; includeSubDomains; preload"
}
```

---

## Phase 7 — Accessibility & "agentic browsing" (same fixes lift the AI-agent score)

Lighthouse's new **Agentic-browsing** category scores the accessibility tree + `llms.txt`. The a11y failures below are *also* what make you hard for AI agents to parse — fix once, benefit twice.

| # | Fix | Status | Evidence / where |
|---|-----|--------|------------------|
| 7.1 | `aria-prohibited-attr` (60): skill badges are `<div aria-label={skill.name}>` with no role → add `role="img"` or use a semantic element | **DONE** | `app/components/mobile/MobileSkillStrip.tsx:63` (`role="img"`) |
| 7.2 | `svg-img-alt` (57): `<svg role="img">` with no `<title>`/`aria-label` → add one, or `aria-hidden` decorative icons | **DONE** | Decorative SVG & icon aria-labels across views |
| 7.3 | `color-contrast` (1 mobile / 6 desktop): `GIT` badge + `V2.0` = 3.68:1 (`#000` on `#7c3aed`) → meet ≥4.5:1 | **DONE** | `ProjectsDrawer.tsx:79` (`badgeTextColor="text-white"`) |
| 7.4 | `link-name` (desktop): header GitHub `<a>` has no accessible name → add `aria-label` | **DONE** | `CardHeader.tsx:36` & `CommitFeed.tsx:52,82` (`badgeAriaLabel`) |
| 7.5 | `target-size` (6 mobile / 1 desktop): CTA/offer-letter links < 48px → increase hit area/spacing | **DONE** | `MobileExperienceCard.tsx:50,61,72` & `MobileProjectCard.tsx:56,67,76` (`w-12 h-12`) |
| 7.6 | Create `/llms.txt` (Markdown, ≥1 H1) describing Medhansh Kapoor + linking `/`, `/projects`, `/experience`, `/about`, GitHub, LinkedIn | **DONE** | `public/llms.txt` created with 2026 standard spec |

**Note on `llms.txt`:** Google Search does **not** consume it (official 2026 guidance), but other AI tools/agents do, and Lighthouse now scores it. Treat it as cheap, optional infrastructure — never as a substitute for crawlable HTML + schema.

---

## Phase 8 — AI / GEO / AEO (Generative & Answer Engine Optimization)

> **Why this phase is now expanded:** The original 7-bullet version was too thin. GEO/AEO is a co-equal pillar alongside on-page SEO for the "Medhansh Kapoor" query — AI engines are increasingly the *primary* way people discover entities. This phase covers everything needed to be cited by AI, not just crawled.

### 8A — Technical foundation for AI visibility

| # | Fix | Status | Evidence / where |
|---|-----|--------|------------------|
| 8A.1 | Explicit AI-bot policy in `robots.txt` (Phase 2 cross-ref): **allow** `OAI-SearchBot`, `ChatGPT-User`, `GPTBot`, `ClaudeBot`, `Claude-SearchBot`, `PerplexityBot`, `Perplexity-User`, `Google-Extended`, `Bingbot`, `Applebot`, `CCBot` | **DONE** | `app/robots.ts` configured with explicit rules for all major AI crawlers |
| 8A.2 | Content in server-rendered HTML (already ✓ — Next SSR; primary text is in raw HTML) | **DONE** | Next.js Server Components serve raw semantic HTML payload |
| 8A.3 | `llms.txt` (Phase 7.6 cross-ref) + valid `Person`/`Organization`/`WebSite` schema (Phase 4 cross-ref) | **DONE** | `public/llms.txt` served; JSON-LD graph with Person, WebSite, ProfilePage in `app/lib/jsonld.tsx` |
| 8A.4 | Visible `dateModified` / "last updated" (Phase 5.6 cross-ref) — retrieval-first engines (Perplexity) weight recency hard | **DONE** | `dateModified: "2026-08-23"` injected in JSON-LD schemas and page headers |

### 8B — Content architecture for AI extraction

| # | Fix | Status | Evidence / where |
|---|-----|--------|------------------|
| 8B.1 | **FAQ section + `FAQPage` schema**: add a visible Q&A section to home or about page. Minimum questions: "Who is Medhansh Kapoor?", "What has Medhansh Kapoor built?", "Where does Medhansh Kapoor work?", "What technologies does Medhansh Kapoor use?" — with concise 40–60 word answers. Implement `FAQPage` JSON-LD matching the visible Q&A exactly. | **DONE** | `app/about/AboutView.tsx` renders 4 canonical Q&A cards; `getFaqPageSchema()` injected in `app/about/page.tsx` |
| 8B.2 | **Answer-first definition** (Phase 5.7 cross-ref): "Medhansh Kapoor is…" 40–50 word entity definition under the H1. This is the passage LLMs lift. Must be self-contained, speakable-ready, and work when extracted out of context. | **DONE** | `#entity-definition` section in `app/about/AboutView.tsx` and JSON-LD speakable markup |
| 8B.3 | **Modular / "chunkable" content**: every section on every page must stand alone when "lifted" by an AI. No "as mentioned above" or "see the previous section" references. Each paragraph should make sense in isolation. This is the key insight from GEO research (Aggarwal et al. 2024). | **DONE** | All FAQ answers and project highlights formatted as self-contained atomic passages |
| 8B.4 | **Question-based H2/H3 headings** on sub-pages: mirror how people query AI assistants (e.g., "What projects has Medhansh built?" instead of just "Projects"). At minimum, use question-format headings in the FAQ section. | **DONE** | Interrogative `<h3>` headings in `app/about/AboutView.tsx` FAQ section |
| 8B.5 | **Citable metrics kept visible**: your numbers (0.68 mAP50, 70.3% precision, 256 tickets, 4,582 chunks, 1,410 Neo4j nodes) are exactly the "specific, attributed numbers" LLMs cite. They're already in `app/data/profile.ts` — keep them visible and in-context on-page. | **DONE** | Exact statistics rendered in both project cards and FAQ answers |
| 8B.6 | **Comparison / positioning content**: project descriptions should briefly position against alternatives (e.g., "Unlike generic legal chatbots, NyayaAI uses a GraphRAG pipeline with 1,410 Neo4j nodes…"). AI engines frequently pull from comparison-style content for "best X for Y" queries. | **DONE** | Included in `profile.faqs` comparing GraphRAG & multi-agent routing to generic chatbots |

### 8C — Voice & speakable (low priority but easy)

| # | Fix | Status | Evidence / where |
|---|-----|--------|------------------|
| 8C.1 | **Speakable schema** (`Speakable` property on `WebPage` or `Article`): mark the answer-first definition (5.7) and FAQ answers as speakable. Helps voice assistants (Google Assistant, Siri) read your entity definition aloud. Low-effort, low-priority. | **DONE** | `SpeakableSpecification` added in `getProfilePageSchema` pointing to `#entity-definition` and `#faq-section` |

### 8D — Anti-patterns (don't do these)

- [x] Don't over-optimize: no artificial "chunking", no fake mentions, no keyword stuffing.
- [x] Don't create thin pages just for SEO — every page must have unique, substantial content.
- [x] Google's own AI guidance: solid SEO + unique, helpful, people-first content is the GEO foundation.

---

## Phase 9 — Off-page SEO (self-serve — everything you can do yourself)

> **Why this phase is now expanded:** The original 4 bullets covered ~20% of what you can do on your own. For the specific problem of competing with a filmmaker named Medhansh Kapoor, **off-page corroboration is the decisive factor**. No amount of on-page perfection wins entity disambiguation alone — Google needs multiple independent sources agreeing on who you are.

### 9A — Profile & entity consistency (the foundation)

| # | Fix | Status | Evidence / where |
|---|-----|--------|------------------|
| 9A.1 | **Full profile audit** — every platform must say the exact same name + title + `medhanshk.me` link. One inconsistency = Google can't consolidate your entity. | **DONE** | Verified identical name, title, bio, and URL across all 5 active platforms |

**Platform-by-platform checklist:**

| Platform | Name | Title | Website | Bio matches site? | `rel="me"` loop? |
|----------|------|-------|---------|--------------------|-------------------|
| **LinkedIn** | Medhansh Kapoor | AI/ML Engineer & Full-Stack Developer | `https://medhanshk.me` | [x] | [x] site→LinkedIn + LinkedIn→site |
| **GitHub** | Medhansh Kapoor | — | `https://medhanshk.me` | [x] | [x] site→GitHub + GitHub→site |
| **X (Twitter)** | Medhansh Kapoor | — | `https://medhanshk.me` | [x] | [x] site→X + X→site |
| **Instagram** | Medhansh Kapoor | — | `https://medhanshk.me` | [x] | [x] site→Instagram + Instagram→site |
| **cal.com** | Medhansh Kapoor | — | — | [x] | [x] site→cal |

**The rule:** Identical `Name + Title + Link` across every platform. Google's entity disambiguation algorithm flags inconsistencies as low-confidence signals.

| # | Fix | Status | Evidence / where |
|---|-----|--------|------------------|
| 9A.2 | **LinkedIn profile** specifically: link to `medhanshk.me`, match name/job title wording exactly ("Medhansh Kapoor", "AI/ML Engineer & Full-Stack Developer"). LinkedIn is the strongest disambiguation signal for professional entities — it's where Google resolves you vs. the filmmaker. | **DONE** | LinkedIn profile configured with exact title and website link |

### 9B — GitHub optimization (high-authority, self-serve)

Your GitHub profile is a high-DA page that Google indexes well. It's one of the few high-authority pages you fully control.

| # | Fix | Status | Evidence / where |
|---|-----|--------|------------------|
| 9B.1 | **Profile README** (`Medhansh-741/Medhansh-741/README.md`): must contain "Medhansh Kapoor — AI/ML Engineer & Full-Stack Developer" as the first line + link to `medhanshk.me` + brief bio matching the site's answer-first definition | **DONE** | Profile README configured with exact bio, badges, and medhanshk.me link |
| 9B.2 | **Pinned repos**: JanSamadhan and NyayaAI with excellent READMEs — one-sentence value prop, badges (build status, license), demo links back to your site, and your name in the README | **DONE** | Pinned repos JanSamadhan and NyayaAI with full documentation and live demo links |
| 9B.3 | **Website field**: set to `https://medhanshk.me` | **DONE** | Website field set to `https://medhanshk.me` |
### 9C — Wikidata entity creation (the Knowledge Graph bridge)

> ⚠ **This is the most impactful off-page action you can take yourself.** Wikidata is the machine-readable bridge to Google's Knowledge Graph. Your doc covers `sameAs` pointing to social profiles but never mentions creating a Wikidata entry.

| # | Fix | Status | Evidence / where |
|---|-----|--------|------------------|
| 9C.1 | **Create a Wikidata item** at `wikidata.org/wiki/Special:NewItem` | **DONE** | Wikidata entity created: `Q141155822` with official properties |

**Wikidata properties to add:**
- `instance of` → `human`
- `occupation` → `software engineer` / `machine learning engineer`
- `employer` → `IndiaAI Mission (MeitY)` (create item if needed)
- `educated at` → `Manipal University Jaipur`
- `official website` → `https://medhanshk.me`
- `social media links` → GitHub, LinkedIn, X
- `country of citizenship` → India
- `residence` → Jaipur

**After creation:**
- [x] Add your Wikidata QID (e.g., `Q141155822`) to your Person schema's `sameAs` array (Phase 4 cross-ref).
- [x] This creates a **self-confirming loop**: website → schema → Wikidata → Knowledge Graph → website.

**Rules for Wikidata:**
- Stick to objective, factual statements. No promotional language.
- Add references: link to `medhanshk.me`, LinkedIn, IndiaAI Mission official page, hackathon results pages.
- Don't add unverifiable claims.

### 9D — Content creation (self-serve backlinks + LLM training data)

> Every piece of content you publish on a high-crawl platform = a backlink to `medhanshk.me` + topical authority in Google's eyes + training data for future LLM updates.

| # | Fix | Status | Evidence / where |
|---|-----|--------|------------------|
| 9D.1 | **Technical blog posts** (2–3 to start): write on Dev.to, Medium, or Hashnode with `canonical_url` pointing to your site if you host on your own domain later | **MISSING** | No blog posts exist |

**Blog topic ideas (each links back to your site):**
- "How I built NyayaAI: A GraphRAG system for Indian law" → links to `/projects`
- "YOLOv8 + PostGIS for real-time civic complaint routing at IndiaAI Mission" → links to `/experience`
- "Building AI apps under India's IndiaAI Mission — what I learned" → unique angle no one else has
- "Comparing RAG architectures: 4,582 chunks vs. GraphRAG with 1,410 Neo4j nodes" → positions your work

**Platform priority:**
| Platform | Why |
|----------|-----|
| **Dev.to** | High DA, indexed fast, you control the content, `canonical_url` support |
| **Medium** | High DA, good for non-dev audiences, great for LinkedIn sharing |
| **Hashnode** | Custom domain support (`blog.medhanshk.me` possible) |
| **Your own `/blog` page** (later) | Ultimate control — but needs time to build authority; do external first |

| # | Fix | Status | Evidence / where |
|---|-----|--------|------------------|
| 9D.2 | **Submit projects to directories**: DevPost (for hackathon projects), Product Hunt (for tools), Hacker News Show HN | **MISSING** | Not submitted anywhere |
| 9D.3 | **Open-source contributions**: PRs to notable repos get you mentioned in changelogs/contributor lists = backlinks + entity mentions | **MISSING** | No notable contributions tracked |

### 9E — Backlink recovery & outreach (self-serve)

| # | Fix | Status | Evidence / where |
|---|-----|--------|------------------|
| 9E.1 | **Unlinked brand mention recovery**: when Google Alerts (Phase 1) catches "Medhansh Kapoor" mentioned without a link, reach out and request a link to `medhanshk.me`. Free, high-quality backlinks. | **MISSING** | Google Alerts not set up yet |
| 9E.2 | **Ask credible pages** (university pages, hackathon pages for India Innovates/Prayatna, IndiaAI Mission press releases) to link to `medhanshk.me` | **MISSING** | — |
| 9E.3 | **Hackathon/event recaps**: write a blog post about each hackathon you've won (on your site or Dev.to) and link back. These pages get indexed and become permanent entity mentions. | **MISSING** | — |

### 9F — Community presence (breadth of evidence)

> AI engines (especially Perplexity) pull heavily from Reddit. Community presence creates breadth in your evidence base — multiple independent sources mentioning "Medhansh Kapoor" with consistent facts.

| # | Fix | Status | Evidence / where |
|---|-----|--------|------------------|
| 9F.1 | **Reddit participation**: answer questions in r/MachineLearning, r/webdev, r/learnprogramming, r/IndianDeveloper. Share projects naturally when relevant (not spam). Your Reddit profile = another corroborating source. | **MISSING** | — |
| 9F.2 | **Speaking / podcast / interview presence**: university tech talks (leverage Manipal), YouTube videos explaining your projects, podcast guest appearances. Each creates a new indexed page that mentions "Medhansh Kapoor" + your expertise. | **MISSING** | — |
| 9F.3 | **Stack Overflow / forum participation**: answer questions in your area of expertise. Profile links back to `medhanshk.me`. | **MISSING** | — |

---

## Phase 10 — Knowledge Panel & LLM visibility (the finish line)

> **This is the explicit goal.** Everything in Phases 1–9 builds toward this. A Google Knowledge Panel = Google saying "this is a distinct, notable entity." Being cited by LLMs = winning the AI-era SERP.

### 10A — Knowledge Panel pursuit

A Knowledge Panel is **not applied for** — it's earned automatically when Google's Knowledge Graph has enough confidence in your entity. The typical timeline is **6–18 months** of consistent signals.

**Requirements checklist (all feed from prior phases):**

| # | Requirement | Phase | Status |
|---|-------------|-------|--------|
| 10A.1 | **Entity Home** = `medhanshk.me` with Person schema + `@id` | Phase 4 | DONE |
| 10A.2 | **Wikidata entry** = machine-readable bridge to Knowledge Graph | Phase 9C | DONE |
| 10A.3 | **Profile consistency** = identical name/title/bio on ≥5 platforms | Phase 9A | DONE |
| 10A.4 | **Third-party corroboration** = mentions on ≥3 independent, authoritative sites | Phase 9D/9E | PENDING |
| 10A.5 | **Schema `sameAs`** = linking site → all profiles → Wikidata QID | Phase 4 | DONE |
| 10A.6 | **Reciprocal `rel="me"` loop** = every profile links back to `medhanshk.me` | Phase 5.2 + 9A | DONE |

**After the panel appears:**
- [ ] Use "Claim this knowledge panel" link at the bottom (requires verified Google account linked to one of your official profiles).
- [ ] Review the panel for accuracy — suggest edits if any facts are wrong.
- [ ] Continue maintaining entity consistency to prevent panel degradation.

### 10B — LLM-specific visibility

LLMs learn about you from two sources: **(1) training data** (web content crawled before their knowledge cutoff) and **(2) live retrieval** (RAG — real-time web search during inference).

**Training data strategy (long game):**
- [ ] Content on **high-crawl platforms** (GitHub, Wikidata, Stack Overflow, Dev.to, Medium) gets into training data faster than your personal site.
- [ ] Blog posts with your name + expertise = training data for "Who is Medhansh Kapoor?" in future model updates.
- [ ] Open-source READMEs mentioning you = training data.
- [ ] The more **diverse, independent sources** mention you with consistent facts, the more LLMs will converge on you as the answer.

**Live retrieval (RAG) strategy (immediate):**
- [ ] Your site must be **crawlable by AI retrieval bots** (Phase 2 + 8A.1). ✓ (once implemented)
- [ ] Content must be **answer-first, fact-dense** (Phase 5.7 + 8B). ✓ (once implemented)
- [ ] **Third-party pages that corroborate your entity** are critical — if Perplexity retrieves your site AND a Dev.to article AND your GitHub AND your LinkedIn, all saying "Medhansh Kapoor is an AI/ML engineer at IndiaAI Mission," it will cite you with **high confidence**. This is why off-page (Phase 9) matters for LLM visibility.

**Manual AI citation audit (monthly cadence):**

| AI Engine | Test Query | What to Log |
|-----------|-----------|-------------|
| ChatGPT | "Who is Medhansh Kapoor?" | Cited? What's quoted? Links? |
| Perplexity | "Who is Medhansh Kapoor?" | Cited? Sources listed? |
| Gemini | "Who is Medhansh Kapoor?" | Cited? Knowledge Panel info? |
| Google AI Overviews | "Medhansh Kapoor" | Included in overview? Source? |
| ChatGPT | "Best AI/ML engineer portfolio India" | Are you mentioned? |
| Perplexity | "NyayaAI legal AI tool" | Is your project cited? |

> Run these in incognito/clean sessions. Log results monthly in a spreadsheet. Track progress over time.

---

## Phase 11 — Monitoring cadence & content refresh

### Monitoring schedule

| Frequency | Action |
|-----------|--------|
| **Weekly** | Check GSC for indexing errors, position changes for "Medhansh Kapoor" |
| **After every deploy** | Re-crawl in GSC (Request Indexing); verify robots.txt + sitemap still serve correctly |
| **Monthly** | Re-run Lighthouse mobile; re-check SERP for "Medhansh Kapoor" in incognito |
| **Monthly** | Manual AI citation audit (Phase 10B table) — query all 4 AI engines |
| **Monthly** | Check Google Alerts for unlinked brand mentions → outreach (Phase 9E.1) |
| **On every schema change** | Validate in Rich Results Test |
| **Quarterly** | Review and update project metrics (mAP50, precision numbers, chunk counts) if they've changed |
| **Quarterly** | Check GSC "Generative AI" performance report (if available for your property) |

### Content refresh strategy

| What | How Often | Why |
|------|-----------|-----|
| Project metrics (mAP50, precision, chunk counts) | Quarterly or when they change | Freshness signal; LLMs cite current numbers |
| Answer-first definition (5.7) | When role/employer changes | Must reflect current truth |
| FAQ section (8B.1) | When new projects/roles are added | Expand Q&A coverage |
| Blog posts (9D.1) | 1 new post every 1–2 months | Compound backlinks + training data |
| `dateModified` / "last updated" (5.6) | On every content change | Machine-readable freshness signal |
| `llms.txt` (7.6) | On every significant content change | Keep AI agent summary current |

---

## Priority matrix (what to do in what order)

| Tier | Do | Why | Effort |
|------|----|-----|--------|
| **P0 (blocking)** | Phase 2 (robots, sitemap, canonicals, metadataBase) | you are currently uncrawlable-by-design (robots/sitemap 404) | 2–3 hours |
| **P0** | Phase 1 (GSC/Bing verification + Google Alerts + AI citation baseline) | you can't measure or get indexed without it | 2 hours |
| **P1 (fastest ranking wins)** | Phase 3 (per-page titles/descriptions + **unblock OG meta**) + Phase 4 (JSON-LD + FAQPage) + Phase 5.1 (single H1) + Phase 5.2 (LinkedIn + reciprocal `rel="me"`) | directly target the "Medhansh Kapoor" query | 4–6 hours |
| **P1** | Phase 5.8 (image alt text) + Phase 5.9 (internal linking) + Phase 5.7 (answer-first definition) | on-page fundamentals that boost both Google and AI extraction | 3 hours |
| **P2 (performance + a11y)** | Phase 6 (videos, hydration error, security headers, favicon, 404) + Phase 7 (a11y + llms.txt) | performance + agentic-browsing scores + trust signals | 4–6 hours |
| **P2** | Phase 8B (FAQ content + modular architecture + comparison content + question headings) | the biggest GEO/AEO gap — AI engines extract Q&A at dramatically higher rates | 3–4 hours |
| **P3 (off-page foundation)** | Phase 9A (full profile audit + consistency) + Phase 9B (GitHub optimization) + Phase 9C (Wikidata entry) | entity disambiguation requires off-page corroboration; this is the decisive factor vs. the filmmaker | 4–5 hours |
| **P3** | Phase 5.10 (E-E-A-T: visible credentials/bio) + Phase 5.6 (dateModified) | trust and freshness signals | 2 hours |
| **P4 (compounding)** | Phase 9D (blog posts — 2–3 to start) + Phase 9E (backlink recovery + outreach) + Phase 9D.2 (project directories) | each post = backlink + training data + topical authority; compounds over months | 3 hours/post |
| **P5 (ongoing)** | Phase 9F (Reddit/community/speaking) + Phase 10 (Knowledge Panel pursuit) + Phase 11 (monitoring cadence) | long-game entity building; 6–18 month timeline for Knowledge Panel | Ongoing |

---

## Evidence sources

- Lighthouse **13.x** JSONs: `lighthouse/medhanshk.me-mobile.json` (mobile, throttled) and `lighthouse/medhanshk.me-desktop.json` (desktop), run 2026-08-22 against `https://medhanshk.me/`.
- Live HTTP checks via `curl` (2026-08-22): `robots.txt`/`sitemap.xml`/`llms.txt`/`opengraph-image` → 404; `resume.pdf`/`favicon.ico` → 200; raw HTML has 2 `<h1>`, 0 OG/canonical/JSON-LD.
- Code evidence: `app/layout.tsx:45-49` (metadata), `app/components/HeroSection.tsx:7,38-52,86-171`, `app/components/mobile/MobileHeroSection.tsx:14-20`, `app/components/mobile/MobileSkillStrip.tsx:64`, `app/components/mobile/MobileExperienceCard.tsx`, `app/components/mobile/MobileProjectCard.tsx`, `app/data/profile.ts`, `app/projects/page.tsx`, `app/experience/page.tsx`, `app/about/page.tsx`, `vercel.json`.
- 2026 guidance: Google Search Central (metadata, robots, hreflang, helpful-content, E-E-A-T, AI-optimization guide), Next.js App Router docs (Metadata API, `sitemap.ts`/`robots.ts`, `generateMetadata`, Server-Component-only metadata), Lighthouse agentic-browsing + `llms.txt` audits, llmstxt.org, GEO research (Aggarwal et al. 2024 + 2026 surveys), and current technical-SEO audit frameworks (CrawlRaven, MarqOps, seoxpert, thestacc).
- 360° audit (2026-08-22): on-page SEO checklists (Semrush, Ahrefs, Search Engine Land, SEO Works), GEO optimization frameworks (Elementor, ROI Revolution, Onely), AEO checklists (Piper Rocket, Maciej Turek, TechVedhas), Knowledge Panel strategies (Reputation X, Instant Press, Alejandro Rioja), and LLM visibility guides (HubSpot, Loud Face, Evergreen Media).
