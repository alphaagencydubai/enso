# ENSO Cafe & Bakery — PWA preview

An installable preview of an app for ENSO (کافه بیکری اِن سو), Valiasr, Tabriz:
their cold-brew film as the hero, the whole bake with their photographs, order
ahead with a live order in the island, gatherings for ceremonies and parties
(12 to 500 pieces), a circle stamp card, and a CRM for ENSO's team. English and
Persian (RTL, Persian digits, Jalali dates). Built by Alpha Agency in Alpha's
**Island** design system, dressed in ENSO's own identity.

- Live: https://alphaagencydubai.github.io/enso/
- Local: `python3 -m http.server 8181` → http://localhost:8181 (the worker is off on localhost)
- Build: `python3 build.py` before every deploy (preloads, worker lists, cache stamp)
- Assets: `python3 -I scripts/build_assets.py <uploads> <jost300.ttf> <manrope.woff2>`

## Pages

| Place | What's there |
|---|---|
| Home | Greeting by time of day, open/closed, the film, today's pick, the three New York rolls, from the oven, gatherings, "circle of togetherness", Instagram, visit |
| Menu | Seven sections on sticky chips that follow the scroll, search in both languages, item sheet with choices (milk, cup, warmed), favourites |
| Gatherings | Occasion → guests (10–500) → day & time (24 h notice, 48 h over 100) → sets that scale with guests → pieces by the dozen → gift boxes & printed card → pickup/delivery → details. Volume pricing 5/10/15 %, 30 % deposit, request code and timeline |
| Profile | Join the circle, live order tracker, stamp card (every tenth coffee), saved, gatherings, orders with "again", language, install, CRM link |
| CRM | Today (takings, week chart, live counter queue you can advance, best sellers) · Customers (segments, search, customer sheet with notes and offer) · Gatherings pipeline (move stages) · Campaigns (birthdays, drifting regulars, Yalda boxes, pistachio lovers → compose and send) |
| Bag | Pick up / at my table / delivery via Snappfood, when, place order → the island becomes a live activity |

The island is the navigation: one black pill with the page and the bag; it folds
on scroll, becomes the live order (their broken circle filling arc by arc), and
opens into a panel of every place plus the language switch.

## What is ENSO's, what is ours

**ENSO's:** the name and line "Circle of togetherness", the broken-circle mark
(measured off their film's end card: three 12° cuts at 90°, 210°, 330°), their
sage `#9EA99B`, the concentric lines of their bags and boxes, the address, phone,
Instagram, Snappfood shop, the film, and every product photographed in their posts
(NY rolls, croissant, swirl, twist, cinnamon roll, chocolate bow, strawberry cube,
tart, piña colada, San Sebastián, breakfast nests, sesame loaf, cheese & parsley
bread, cold brew).

**Ours, placeholder until ENSO confirms:** every price, opening hours, the coffee
and cold-drink list beyond cold brew, the gathering sets, volume tiers, deposit
and delivery fee, and the whole CRM book (seeded, made-up guests). The ENSO
wordmark is rebuilt in Jost Light as the closest open face to theirs.

## Island × ENSO

White, ink `#0A0A0A`, grey `#6E6E73`, line `#EDEDED`, paper `#F4F3EF`; ENSO's sage is
the one live colour (open dot, progress arcs, stamps). Manrope 300/500/700, big
light headings, small-caps labels, 6 px photographs; Vazirmatn for Persian.

## Map

```
js/data.js        ENSO's facts, the card, gathering pieces, sets, tiers
js/crmdata.js     seeded CRM book (customers, week, queue, gatherings)
js/store.js       bag, orders (live), gatherings, profile, stamps — localStorage
js/i18n.js fa.js  English/Persian, digits, Toman, Jalali
js/island.js      the navigation pill / live activity / panel
js/views/*.js     home, menu, gather, profile, crm, bag
css/app.css       the whole system
```

Powered by Alpha Agency.
