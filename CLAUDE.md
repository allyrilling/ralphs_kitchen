# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Ralph's Kitchen — a personal Hugo static blog with two content sections (recipes cooked at home, and restaurant notes), a custom hand-built theme (no external Hugo theme), Decap CMS for git-backed editing at `/admin`, and client-side Fuse.js search. See `README.md` for the original product spec.

## Commands

```bash
hugo server -D          # local dev server with drafts, live reload (http://localhost:1313)
hugo                    # production build -> public/ (gitignored, not committed)
hugo --minify           # matches the GitHub Actions build step exactly
```

There is no JS package.json / build step — all scripting is plain JS loaded from `static/js/` or CDN `<script>` tags in templates. There is no test suite or linter configured.

## Deployment

Push to `main` triggers `.github/workflows/hugo.yml`, which builds with Hugo `extended` and deploys `public/` to GitHub Pages. `netlify.toml` also exists (alternate/legacy Netlify build target at a different `baseURL`) — GitHub Actions → GitHub Pages is the active deploy path referenced by the CMS backend (`git-gateway` in `static/admin/config.yml`) and Netlify Identity widget loaded in `head.html`.

## Content architecture

Posts are Hugo page bundles under two sections:

```
content/dinner-party/<slug>/index.md
content/out-on-the-town/<slug>/index.md
```

Frontmatter fields (see `archetypes/posts/index.md` for the template, and `static/admin/config.yml` for the authoritative field list): `title`, `date`, `draft`, `description`, `image` (cover), `meal_type`, `food_genre`, plus `location`, `city`, `lat`, `lng` for `out-on-the-town` only. `slug` can override the folder-derived URL.

`data/sections.yaml` holds the section description blurbs shown on list pages — editable via Decap CMS's "Settings" collection.

Both `layouts/_default/list.html` and `layouts/index.html` derive filter/browse options (meal type, cuisine, city) **from whatever values actually appear in posts**, not from a fixed taxonomy — Hugo's `taxonomy`/`term` kinds are disabled in `hugo.toml` (`disableKinds`). Adding a new `meal_type` or `food_genre` value to a post is enough for it to show up as a filter; the full allowed option lists live in `static/admin/config.yml`'s `select` widgets and are mirrored (for ordering) in `list.html`.

## Templates

- `layouts/_default/baseof.html` — shared shell (header/main/footer), restores theme from `localStorage` before paint (dark mode support).
- `layouts/_default/list.html` — section index pages; Alpine.js (`x-data`) powers the client-side meal/genre/city filter buttons without a page reload.
- `layouts/_default/single.html` — post page; renders `medium-zoom` for inline image lightboxing and a table of contents when long enough.
- `layouts/index.html` — homepage, shows the 4 latest posts per section.
- `layouts/index.json` — build-time search index (title/url/summary) consumed by `static/js/search.js` + Fuse.js on the `/search` page (`layouts/_default/search.html`).
- `layouts/partials/head.html` — SEO/OG/Twitter meta, RSS `<link>`, Netlify Identity widget (redirects logged-in users to `/admin/`), Alpine.js CDN include.

Alpine.js and Fuse.js are loaded from CDN only on the pages that need them (header nav toggle uses Alpine everywhere; list/home filtering and search are additive).

## Decap CMS (`/admin`)

`static/admin/config.yml` defines four content collections (published + drafts, per section, split via a `draft` boolean filter) plus the `sections.yaml` settings file. Media uploads go to Cloudinary (`dgdmgrse0` / `ralphs kitchen` preset), not git.

`static/admin/index.html` loads Leaflet + Decap CMS + `geocode.js`. `geocode.js` is a MutationObserver-driven script that injects a "Geocode →" button next to the Location field on `out-on-the-town` entries: it calls the Nominatim (OpenStreetMap) API to fill `lat`/`lng`/`city` and renders a small Leaflet preview map, since Decap CMS has no native geocoding widget.

## Other

- `IOS_APP_PLAN.md` — design doc for a not-yet-built SwiftUI companion app that would write posts directly via the GitHub Contents API + Cloudinary, as an alternative to the `/admin` CMS.
- `TODO.md` — currently tracking mobile-responsive-design work.
