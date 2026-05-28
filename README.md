# Anjali QC Design System

A design system for **บริษัท อัญชลี ฟรุ๊ต โปรดักส์ จำกัด** (Anjali Fruit Products Co., Ltd.) — a Thai fruit-processing factory that makes preserved/dried fruit products (pineapple, mango, papaya, tamarind, longan, etc.).

The flagship product is **ระบบ QC ประจำวัน** ("Daily QC System") — a mobile-first web app used by line QC staff (e.g. "อัญชลี") to record quality inspections across six rounds per day (3 morning + 3 afternoon/evening), spanning four stations:

| Station (Thai)   | Station (EN)   | Inspects                                                |
|------------------|----------------|---------------------------------------------------------|
| 🫙 โรงกวน        | Stirring house | 9 stir machines, sugar/syrup ratio, color, taste        |
| 🔥 บอยเลอร์       | Boiler         | Temp ≤40°C, pressure, water level, pump, smoke          |
| ⚙️ โรงโม่         | Mill           | 3 mill machines, contaminants, raw-material checks      |
| 📦 โรงแพ็ค       | Pack house     | Sticker / seal / shrink machines, expiry stamp, weight  |

Per round the operator tags 0-N LOTs (e.g. `B1-25-5-26-1` = pineapple, oven 1, day 25, month 5, year 26, stir time 1) with taste/smell/color verdicts, and finishes the round with a "Copy to LINE" summary push.

## Why this design system

The user's stated pain points (translated from the brief):
1. **ใช้งานง่ายขึ้น รองรับมือถือ/คอม** — easier to use on **both** phone and desktop (current build is phone-only)
2. **บันทึกข้อมูลตลอดเวลา แม้รีเฟรช แอปเด้ง สายโทรเข้า เปลี่ยนแอป** — never lose data on refresh, app crash, incoming call, or app-switch (multi-layer persistence is **non-negotiable**)
3. **กดใช้งานได้สะดวก ไม่ต้องมาคอยเลื่อนหา** — controls must be reachable without endless scrolling

The system therefore enforces: **44 px minimum tap targets** everywhere, **collapsible sections** so each round fits one viewport, **multi-layer auto-save** (localStorage + sessionStorage + IndexedDB + remote Supabase), and a **recovery banner** on every reload.

## Sources

- `source/qc_anjali_original.html` — the single-file production app the user shipped. ~1600 lines, vanilla JS + inline `<style>`. The **only** source of truth for the brand right now.
- No Figma, no codebase, no logo files were provided.

---

## Index — Files in this design system

| File / folder                  | What's inside                                                     |
|--------------------------------|-------------------------------------------------------------------|
| `README.md`                    | This file. High-level context + content + visual + iconography.   |
| `SKILL.md`                     | Agent-Skills front-matter for portability into Claude Code.       |
| `colors_and_type.css`          | All CSS variables — green scale, grays, semantic colors, type, spacing, radii, shadows, breakpoints, tap targets. |
| `source/qc_anjali_original.html` | Verbatim copy of the user-supplied app for grep / reference.    |
| `assets/`                      | Logo placeholder (flag: real logo needed), favicon mark.          |
| `fonts/`                       | Empty — fonts are loaded from Google Fonts (see Caveats).         |
| `preview/`                     | Design-system card HTML files (registered for the DS tab).        |
| `ui_kits/qc/`                  | High-fidelity React recreation of the QC app.                     |

---

## Content fundamentals

**Language: Thai-first, factory-floor register.** The whole UI is in Thai. Tone is **direct, terse, action-oriented** — this is a tool for line operators who tap through it every 60–90 minutes during a 12-hour shift, not a consumer product. No marketing voice, no "we" / "you" — just nouns and verbs.

**Form addressing.** No personal pronouns. Tasks are stated as bare actions. Examples from the source:
- `กดเลือกรอบที่ต้องการบันทึก` — "Tap the round to record" (no `คุณ` / "you")
- `ยังไม่มี LOT — กด ＋ เพิ่ม LOT ด้านล่าง` — "No LOTs yet — tap ＋ to add a LOT below"
- `บันทึกแล้ว` / `กำลังบันทึก...` — "Saved" / "Saving…" (status, no subject)

**Casing & emphasis.**
- All Latin technical terms are written **uppercase**: `LOT`, `QC`, `LINE`, `Supabase`, `Comment`. They sit inside Thai sentences unchanged.
- Section labels are **UPPERCASE + 0.5px tracked + 11px** — used as eyebrow labels above every field (e.g. `วันที่`, `STATUS`).
- No SHOUTING; just functional uppercase.

**Verbs.** Imperative, no politeness particles (no `ครับ` / `ค่ะ`):
- `บันทึก` (save), `กู้คืน` (restore), `ยืนยัน` (confirm), `ลบ` (delete), `Copy สรุปทั้งวัน → LINE` (Copy day summary → LINE).

**Numbers + units.** Always written tightly, mono-spaced:
- `≤40°C`, `(1-10)`, `(1-20)`, `(2 หลัก)` ("2 digits"), `B1-25-5-26-1` (LOT format).

**Domain vocabulary** (memorize these — they appear constantly):
- `รอบ` = round (inspection cycle)
- `เช้า` / `บ่าย` / `เย็น` = morning / afternoon / evening
- `เตา` = oven, `เครื่อง` = machine, `คัน` = vehicle/cart
- `กวน` = stir, `โม่` = mill, `แพ็ค` = pack
- `แบะแซ` = glucose syrup, `น้ำตาล` = sugar
- `เกณฑ์` = criterion / spec
- `สิ่งปนเปื้อน` = contamination
- `ปกติ` = normal / `ไม่ปกติ` = abnormal — the universal OK/NG pair
- `เปรี้ยวอมหวาน` = "sour-sweet" — the canonical correct fruit taste profile

**Voice cues — examples from production copy:**
- `🔄 พบข้อมูลที่บันทึกไว้ก่อนหน้า — ต้องการกู้คืนหรือไม่?` ("Found previously saved data — restore?")
- `📵 ออฟไลน์ — ข้อมูลบันทึกในเครื่องแล้ว จะส่งเมื่อมีสัญญาณ` ("Offline — data saved locally, will sync when online")
- `✅ บอยเลอร์ทำงานปกติทุกรายการ` ("Boiler running normal on all items")
- `กรณีสีผิดปกติ — แนวทางแก้ไข` ("If color is off — corrective action")

**Em-dash + arrow conventions.**
- Use `—` between a context and its detail (`LOT 1 — B1-25-5-26-1`, `Comment — ความนิ่ม / เหนียว`).
- Use `→` for destinations (`Copy สรุปทั้งวัน → LINE`).
- Use `/` to enumerate sensory criteria (`ความนิ่ม / เหนียว / กลิ่น / สี`).

**Emoji policy: minimal and functional only.** The brand reads **formal and modern** — emoji are used sparingly, only where they carry real meaning:

- **State chips only**: `✓` for OK / pass, `!` (or `⚠`) for warn / NG. These are the only emoji that should appear on chip / button labels.
- **Fruit identifiers in LOT data**: the 10 fruit codes (🍍 สับปะรด, 🥭 มะม่วง, etc.) keep their fruit emoji in the LOT-code dropdown because they're *data*, not decoration — they help the operator visually distinguish 10 codes at a glance.
- **Round identification**: time-of-day emoji (🌅 รอบ1 เช้า, 🌤️ รอบ2 เช้า, ☀️ รอบ3 เช้า, 🌞 รอบ1 บ่าย, 🌇 รอบ2 บ่าย, 🌆 รอบ3 เย็น) on the round selector tiles + the active-round page header. These six emoji are *identifying glyphs* (not decoration) — they let an operator pick the right round at a glance without reading every label.

**Do NOT use decorative emoji** on card titles, section headers, button labels, navigation, or page chrome. Use clean Thai text.

Cues from production copy (revised — see source file for old emoji-heavy phrasing):
- `พบข้อมูลที่บันทึกไว้ก่อนหน้า — ต้องการกู้คืนหรือไม่?` (was `🔄 พบข้อมูล…`)
- `ออฟไลน์ — ข้อมูลบันทึกในเครื่องแล้ว จะส่งเมื่อมีสัญญาณ` (was `📵 ออฟไลน์…`)
- `บอยเลอร์ทำงานปกติทุกรายการ` (was `✅ บอยเลอร์…`)
- `กรณีสีผิดปกติ — แนวทางแก้ไข` (kept as-is)

---

## Visual foundations

### Color vibe
Deep, saturated **forest / sap green** is the primary brand identity. The green scale (`--g0`…`--g9`) is the single most important system: dark greens for headers + dark CTAs, mid-greens for primary actions, light greens (`--g0` / `--g1`) for "OK / saved / done" success surfaces. Gray scale is **cool/neutral** (Tailwind-derived `gray-50 → gray-900`). Semantic accents are sparing — red (`--r5`) for NG / delete, amber (`--a5`) for "saving / extra section / warn", blue (`--b6`) for scores and pack station.

The six **inspection rounds** each have their own accent color so they're distinguishable at a glance:
- รอบ1 เช้า — `#245233` (deep green, same as `--g7`)
- รอบ2 เช้า — `#1565c0` (blue)
- รอบ3 เช้า — `#b45309` (amber, same as `--a5`)
- รอบ1 บ่าย — `#6a1b9a` (purple)
- รอบ2 บ่าย — `#7b3f00` (brown)
- รอบ3 เย็น — `#2e4a5a` (slate)

### Typography
- **TH Sarabun** is the body face — the user's chosen brand font (Thai government / business standard, very legible at large sizes). Files in `fonts/`: `THSarabun.ttf` (Regular 400) + `THSarabun_Bold.ttf` (Bold 700). The CSS face-maps 500/600 → Bold and 300 → Regular since TH Sarabun only ships two weights.
- **IBM Plex Sans Thai** is kept as a fallback in the `--font` stack so the design still renders if the local .ttf files are unavailable.
- **IBM Plex Mono** is for codes, scores, time badges, and the big numeric counter on the LOT summary card. Weights 400 / 500 / 600. Loaded from Google Fonts.
- No display face. No serif (TH Sarabun is sans, despite the name). No decorative type.
- **TH Sarabun reads ~2-3 pt smaller per em than IBM Plex** — so all sizes were bumped up vs the original app: body **17 px** (was 14), controls **16 px** (was 13), labels **13 px** (was 11), headline numeric **40 px** mono (was 36). At these sizes the form is readable at arm's length on a phone screen on a noisy factory floor.

### Backgrounds
- **No imagery.** No photography, no full-bleed pictures, no patterns, no textures, no illustrations. Every screen is solid `--gr0` (`#f9fafb`) page + white cards.
- **No gradients** except the rare `0%→18%-alpha` round-color tint on the active round card.
- The dark topbar uses solid `--g8` with a 25%-opacity drop shadow underneath — the only "elevation" treatment that breaks the otherwise flat surface.

### Cards
- White (`--w`) background, `1 px solid --gr3` border, `14 px` radius (`--rlg`), `--s1` shadow (very subtle 1-3 px).
- Two-part: `.card-head` (12×16 padding, bottom border `--gr1`, bg `--gr0`) + `.card-body` (14×16 padding).
- Cards stack vertically with `12 px` gap.
- The single exception: the **LOT summary** card uses dark green `--g8` bg with white text + a giant `--g3`-colored mono number.

### Borders
- Default field/chip border is `1.5 px solid --gr3`. **The 1.5 px is intentional** — 1 px reads too thin against the bright white surface on phone screens; 2 px reads too heavy at 13-14 px type.
- Active state: same width, `--g5` border + `--s-focus` ring (`0 0 0 3px rgba(61,140,88,.12)`).
- Dashed borders (`2 px dashed`) signal "add" affordances (`.btn-add-lot`) and the optional "extra" section (`1.5 px dashed --a5`).

### Radii
- `6 px` (`--rsm`) — score grid squares (smallest)
- `10 px` (`--rmd`) — inputs, num pads, small cards, alerts
- `14 px` (`--rlg`) — primary cards, banners, history items
- `20 px` (`--rxl`) — reserved (not currently used)
- `100 px` (`--rpill`) — chips, status badges, time badges — always fully rounded

### Shadows
- `--s1` (subtle, default card) > `--s2` (used on hover-promoted surfaces — currently unused but defined) > `--s3` (toast, modal). The system **leans flat** — depth is communicated mostly by color and border, not elevation.
- The topbar drops a heavier `0 2px 8px rgba(0,0,0,.25)` shadow because it's sticky and needs visual separation from scrolling content below.
- Focus ring is **not a shadow but a 3-px outer glow** of the brand green at 12 % alpha. Re-used on every focusable input/select.

### Buttons + chips
- **Primary** = `--g6` bg, white text, 15 px / 700, 15 px padding, 52 px min-height. Always full-width inside its parent card.
- **Dark** = `--g9` bg (used for "Copy day summary → LINE")
- **Outline** = white bg + `2 px solid --g4` border, `--g7` text
- **Small pill** = 11 px label, `1 px solid --g4`, 36 px min-height
- **Chip** = 13 px / 600, 9×16 padding, **44 px min-height**, fully rounded (`--rpill`). State variants: `.ok` (green fill), `.ng` (red fill), `.warn` (amber fill), `.gray` (gray fill), `.blue` (blue fill). All filled chips use **white text** on the fill color.

### Hover / press states
- Most chip presses produce **no transform** — they swap fill color and that's the whole feedback. (The user is tapping on a moving production floor with gloved hands; subtle hover/press animations are wasted.)
- Buttons get a `:active` darker bg (`--g6` → `--g7` etc.) — no shrink, no shadow change.
- Tap highlight is suppressed globally: `-webkit-tap-highlight-color: transparent`.
- Section heads change bg `--w` → `--gr0` on hover (desktop), no effect on touch.

### Transitions
- One easing: default browser `ease`. One duration system: **0.15s** for color/border swaps, **0.2s** for rotation/transform (the section arrow chevron), **0.3s** for the toast opacity in/out.
- One keyframe animation: `@keyframes pulse` — the green status dot pulses 1 → 0.4 opacity over 2 s, infinitely. That's the entire motion language.

### Layout rules
- **Fixed content width: 680 px max** (`--bp-content`). The form is single-column at all sizes; on desktop the column is centered with gray-50 letterboxing on either side.
- **Sticky topbar** (`position: sticky; top: 0; z-index: 200`).
- Sticky **tab bar** sits directly under the topbar in the same `<header>`.
- Below 480 px (`--bp-narrow`), 2-column grids collapse to 1 column (the LOT builder grid, the two-col date+reporter row).
- All cards have **16 px horizontal padding** on the `.wrap` container — that's the bedrock margin.

### Transparency + blur
- **No backdrop-filter / no glass effects anywhere.** Every overlay is a solid color.
- The only transparencies in use:
  - Round-color tint backgrounds at **10–18 % alpha** for active/section-head fills (`r.cl+"18"`).
  - `rgba(255,255,255,.2)` on time badges sitting on a colored round banner.
  - `rgba(0,0,0,.6)` on the offline-overlay scrim.

### Imagery
- The app supports **photo uploads** (boiler color samples, expiry stamp proof, extra-section docs). Photos render as **72 × 72 px** square thumbnails with `2 px solid --g3` border, `10 px` radius, `object-fit: cover`. A red circular delete handle hangs off the top-right corner. No filters, no overlays. This is documentary photography — straight-from-camera, often phone-lit and warm/yellow.

### Density
The interface is **deliberately dense** — 12 px gaps between cards, 10–14 px padding inside cards, 5–7 px gaps inside chip clusters. There is no whitespace for breathing room; every scroll-screen needs to fit as many tappable controls as possible. The collapsible sections are the relief valve.

---

## Iconography

The brand uses **minimal, functional iconography** — the visual register is **formal, modern, text-first**.

### What's used
- **State glyphs only**: `✓` (Unicode check, U+2713) and `!` or `⚠` (warning) on state chips/buttons. Set in the current text color, no color emoji. This is the *only* place emoji appear in UI chrome.
- **Fruit emoji as data** in the LOT-code dropdown. These appear *inside the data row* (e.g. `B — 🍍 สับปะรด`), never as decoration in titles. The emoji is functional — it visually distinguishes one of 10 fruit codes at a glance.
- **Round identifier** is the round's **accent color** (full-width banner) plus the time-of-day emoji (🌅 🌤️ ☀️ 🌞 🌇 🌆) and the round label (`รอบ1 เช้า`). The emoji + color are the identifier — they let an operator pick the right round at a glance.

### What's **forbidden**
- ❌ Emoji on card titles, section headers, button labels, nav, page chrome
- ❌ Color emoji as section markers (📋 📁 📊 🫙 🔥 ⚙️ 📦)
- ❌ Icon fonts (no Material, no FontAwesome, no Lucide, no Heroicons)
- ❌ Outlined SVG icon sets
- ❌ Custom illustrations / mascots

### If you need an icon and `✓ / !` doesn't fit
**Add a short Thai noun label** instead of inventing an SVG or reaching for an emoji. Example: a calendar icon → write `วันที่`. A clock → write `เวลา`. The form is already heavily labelled — every input has an UPPERCASE label above it — so adding text where you'd reach for an icon is on-brand.

### Logo
**Per user direction: there is no logo file in this design system.** Brand identity in the topbar is the wordmark `บริษัท อัญชลี ฟรุ๊ต โปรดักส์ จำกัด` (12 px, color `--g3`) above the app-title `ระบบ QC ประจำวัน` (20 px / 700, white) — set in TH Sarabun. If a real logo is added later, it should sit to the **left** of the wordmark, no taller than 32 px.

---

## Caveats / known substitutions

- **Fonts**: TH Sarabun (Regular + Bold) supplied by user, in `fonts/`. IBM Plex Sans Thai kept as web-loaded fallback. IBM Plex Mono loaded from Google Fonts (no .ttf provided yet — flag if offline use is required).
- **No real logo** — placeholder generated. See above.
- **No Figma, no codebase** — the source-of-truth is the single shipped HTML file. Anything not in that file (production code paths, server schemas, edge-case copy) is unknown.

---

## How to use this design system

1. Start with `colors_and_type.css` — every design must `@import` it (or copy its `:root` block).
2. Treat the green scale + IBM Plex Sans Thai + emoji-as-icons as **non-negotiable** brand pillars.
3. Cards are the universal container. White, `--rlg`, `--s1`, `1 px solid --gr3`. Don't introduce other container styles.
4. Every interactive control is **at least 44 px tall**. No exceptions on the QC product.
5. Emoji are part of labels, not decoration — never strip them when localizing.
6. New screens must fit in a 680 px column and degrade to single-column under 480 px.

When in doubt, open `source/qc_anjali_original.html` and copy the pattern.
