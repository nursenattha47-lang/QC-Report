# Anjali QC — UI Kit

High-fidelity React/JSX recreation of **ระบบ QC ประจำวัน** (Daily QC System) from `source/qc_anjali_original.html`.

## What's here

`index.html` boots a clickable prototype of the entire QC entry flow. All components live as `.jsx` files at this folder's root, loaded via inline Babel.

| File              | Component(s)                                            |
|-------------------|---------------------------------------------------------|
| `App.jsx`         | Page shell + state store + tab routing                  |
| `TopBar.jsx`      | Sticky green header with company name + sync status     |
| `Banners.jsx`     | Recovery banner, sync banner, toast                     |
| `TabBar.jsx`      | 2-tab switcher (กรอก QC / ประวัติ)                       |
| `Card.jsx`        | White card container w/ head + body slots               |
| `Chip.jsx`        | 44 px chip — variants ok / ng / warn / gray / blue      |
| `Button.jsx`      | Primary / dark / outline / add-dashed / btn-sm          |
| `Field.jsx`       | Label + input/textarea/select                           |
| `NumPad.jsx`      | num-btn grid (regular + sm) + score row                 |
| `Section.jsx`     | Collapsible section with chevron                        |
| `Alert.jsx`       | ok / warn / note / info alert boxes                     |
| `RoundGrid.jsx`   | 6-tile round selector                                   |
| `RoundBanner.jsx` | Active-round header banner with time badge              |
| `LotItem.jsx`     | LOT builder + sensory criteria chips                    |
| `Stations.jsx`    | Boiler / Stir / Mill / Pack collapsible station forms   |
| `DoneBox.jsx`     | Round-finish confirm box                                |

## Scope

This is a **visual + interaction recreation** of the production app, not a re-engineered version. State is held in React + persisted to `localStorage` so a refresh round-trips the form, matching the original behaviour. The Supabase/IndexedDB layers are stubbed (logs to console).

## Run

Open `index.html` — no build step.
