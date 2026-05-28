---
name: anjali-qc-design
description: Use this skill to generate well-branded interfaces and assets for บริษัท อัญชลี ฟรุ๊ต โปรดักส์ จำกัด (Anjali Fruit Products) — a Thai fruit-processing factory — including the QC daily-reporting product and any new interfaces in the same visual system. Contains essential design guidelines (Thai-first copy, IBM Plex Sans Thai type, sap-green color system, 44 px tap targets, emoji-as-icons), color/type/spacing tokens, logo + asset placeholders, and a complete React UI kit for the QC product.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts or production code, depending on the need.

## Where things live in this skill

- `README.md` — high-level product context, content fundamentals, visual foundations, iconography
- `colors_and_type.css` — every CSS variable: green scale, neutrals, semantic accents, 6 round-accent colors, type system, spacing, radii, shadows, tap-target tokens, breakpoints
- `source/qc_anjali_original.html` — verbatim copy of the production app. **Highest-fidelity source of truth** — grep it for exact patterns before inventing anything
- `assets/` — logo placeholders (flag for user-supplied real logo)
- `preview/` — design-system cards (one concept per file)
- `ui_kits/qc/` — React/JSX recreation broken into modular components (TopBar, Chip, NumPad, RoundGrid, LotItem, Stations, etc.) with a working `index.html` clickable prototype

## Critical brand rules (do not violate)

1. **Thai-first.** All UI copy is Thai. Latin tech terms (LOT, QC, LINE, Supabase) stay uppercase Latin inside Thai sentences.
2. **No personal pronouns.** Use bare imperative verbs (`บันทึก`, `ยืนยัน`, `ลบ`).
3. **Emoji are minimal and functional only.** `✓` / `!` state glyphs on chips, fruit emoji *as data* in the LOT dropdown only. No decorative emoji on card titles, section headers, button labels, or page chrome — this is a formal, modern brand.
4. **44 px minimum tap targets** on this product. No exceptions.
5. **Multi-layer auto-save is non-negotiable** for any data-entry surface — localStorage + sessionStorage + IndexedDB + remote.
6. **Single 680 px-max column** layout. Mobile-first, with desktop letterboxed.
7. **No gradients** (except the rare 10-18% alpha round-color tint). **No glass / backdrop-filter.** **No imagery.** **No display fonts.**
8. **Cards are the universal container.** White, `--rlg` (14 px), `--s1` shadow, `1 px solid --gr3`.
9. **Round-color accents are reserved** — only use the 6 round colors to identify which round (m1–a3) you're rendering against.
