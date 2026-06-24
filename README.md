# nova — the default Tanqory storefront theme

The **default theme** every new Tanqory store starts from. A fully standalone
React theme with the complete storefront — home, **product, collection, cart,
search, blog, contact, 404** — plus **SSR** (`entry-server.tsx`). The model:
**React component = block**, **content = JSON tree** (not HTML), edited by the
visual editor.

Depends only on [`@tanqory/theme-kit`](https://github.com/tanqory/tanqory-platform-studio-new/tree/main/packages/theme-kit)
(published to GitHub Packages).

```bash
# @tanqory/theme-kit is on GitHub Packages → set a token with read:packages once.
export NODE_AUTH_TOKEN=<your-github-token>      # e.g. `gh auth token`

npm install
npm run dev        # → http://localhost:4321  (offline, mock data — no store needed)
npm run build
npm run typecheck
```

## Data: mock (default) or live — the theme is store-agnostic

Data is injected at runtime, never hardcoded, so one theme serves every store:

| mode | data source | how |
| --- | --- | --- |
| **mock** (default) | `lib/collections.json` | just `npm run dev` — fully offline |
| **live** | a store's Storefront API | `cp .env.example .env`, set `VITE_TANQORY_BACKEND` + `VITE_TANQORY_STORE_ID` |
| **production** | resolved by hostname | `<slug>.mytanqory.com` → the edge storefront worker injects the right store |

`main.tsx` (CSR) and `entry-server.tsx` (SSG) both pick `createLiveData` vs
`createMockData` automatically from those env vars, with graceful fallback to mock.

## One rule to read the whole repo

> **`.ts` / `.tsx` = code (dev writes) · `.json` = data (editor/merchant edits)**

## Structure

```
assets/styles.css     styling + design tokens                  [static]
sections/             editor sections — React + schema         [.tsx]  code
  Hero · Button · ProductGrid                                    (top-level, placeable units)
components/           reusable pieces (no schema, not sections) [.tsx]  code
  Price
layouts/layout.tsx    site shell: header / footer              [.tsx]  code
templates/            per-page composition                      [.json] editor data
  index.json
config/
  settings.ts         global settings — schema (typed)          [.ts]   code
  settings.json       global settings — values                  [.json] editor data
locales/en.json       storefront translations                   [.json] translator data
tanqory.config.ts     project config (data mode/endpoint)       [.ts]   dev
package.json          manifest + deps
─ build wiring (moves into the `tanqory dev` CLI later):
  index.html · main.tsx · vite.config.ts · lib/collections.json (mock)
```

## Where do I edit…?

| Want to | Go to |
| --- | --- |
| add / edit a section | `sections/*.tsx` |
| reusable piece (price, stars…) | `components/*.tsx` |
| arrange a page (order / section settings) | `templates/*.json` |
| header / footer | `layouts/layout.tsx` |
| colors / fonts / shop name (site-wide) | `config/settings.json` (schema in `settings.ts`) |
| text / translations | `locales/*.json` |
| styling | `assets/styles.css` |
| data source / mode | `tanqory.config.ts` |

## How it works
- A **section** (`sections/*.tsx`) is one definition serving three consumers: dev writes
  the React component + `attributes` schema; the editor auto-builds settings UI from
  the schema; the storefront renders it. Content stays a **JSON tree** the editor edits.
- `@tanqory/theme-kit` auto-discovers `sections/`, `templates/`, `layouts/` and mounts.
- vs Shopify: Liquid → typed React; reusable bits are plain **components/** (not a
  separate `snippets/`); schema/values split by file extension (`.ts` vs `.json`).
