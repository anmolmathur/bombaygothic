# Journal sync — bombaygothic.com ↔ shop.bombaygothic.com

The `journal.html` page on this site mirrors the **live** articles on
`shop.bombaygothic.com/blogs/news`. Shopify is the canonical source of
truth — every "read more" link on `journal.html` routes there. This
file should match shop exactly: same number of cards, same images,
same order.

---

## When does this need updating?

| Trigger on shop side | What to do here |
|---|---|
| Publish a new article | Add a card to `journal.html` |
| Unpublish / delete an article | Remove the matching card |
| Change an article's title, excerpt, or featured image on Shopify | Update those fields on the card |
| No change (article body edited, but title/image/excerpt unchanged) | Nothing — only listing-level fields are mirrored here |

---

## How to add a new card (5-minute workflow)

### Step 1 — gather the article details

Open the article in Shopify Admin:
`https://admin.shopify.com/store/e7a704-3c/articles/<article-id>`

Note down:
- **Slug** (the URL handle, e.g. `gothic-revival`)
- **Title** (used as card heading)
- **Featured image URL** — right-click the image → "Copy image address". It'll be a `https://cdn.shopify.com/...` URL.
- **Date** (the published date, in human format e.g. `May 24, 2026`)
- **Excerpt** (the summary field on the Shopify article — keep to 2 lines max for visual parity)

### Step 2 — open `journal.html` in your editor

Inside the file, find the `<!-- TEMPLATE BLOCK -->` comment near the top of the
cards section. Copy the entire block between `─── TEMPLATE BLOCK ──────` and
`─── END TEMPLATE ─────`.

### Step 3 — paste as a new card

Paste your copy inside the `<div class="grid ...">` container, ideally at
the TOP (newest first ordering).

### Step 4 — fill in the 5 placeholders

Replace these 5 strings in your pasted block:

| Placeholder | Replace with | Example |
|---|---|---|
| `SLUG` | The article handle | `the-master-masons-of-gothic-architecture` |
| `IMAGE_URL` | Full Shopify CDN URL of the featured image | `https://cdn.shopify.com/s/files/.../Canterbury_Cathedral_002.jpg?v=1779634315` |
| `ALT_TEXT` | Short image description | `The Master Masons of Gothic Architecture` |
| `TITLE` | Article title | `The Master Masons of Gothic Architecture` |
| `DATE` | Published date in human format | `May 24, 2026` |
| `EXCERPT` | Short summary (Shopify "summary" field) | `From the 11th century...` |

### Step 5 — commit + push

```bash
cd ~/Documents/GitHub/bombaygothic
git add journal.html
git commit -m "Journal: add <title> card"
git push
```

GitHub Pages auto-deploys in ~1 min. Verify at `https://bombaygothic.com/journal.html`.

---

## How to remove a card

1. Open `journal.html`.
2. Find the `<!-- Card N: <title> -->` comment matching the article you unpublished.
3. Delete the entire `<div class="group overflow-hidden ...">` block (and its
   matching `</div>` closing tag — the outer one with the `group` class).
4. Commit + push (same as Step 5 above).

---

## How to change an image on an existing card

If Kruti updates a featured image on Shopify, the CDN URL changes (Shopify
appends a new `?v=...` cache buster). To pick up the new image here:

1. In Shopify Admin → article → right-click new featured image → Copy image address.
2. In `journal.html`, find the matching `<img src="..." ...>` line.
3. Replace the entire URL (including the `?v=...` part).
4. Commit + push.

---

## Optional: fully-automated sync (future enhancement)

The manual workflow above is fine for the current cadence (~1 new article
per month). If publishing speeds up — e.g. Kruti starts publishing weekly —
consider one of these:

### Option A — Node.js sync script (recommended)

A small script that:
1. Queries Shopify Admin API for all published articles in the `news` blog
2. Regenerates the cards section of `journal.html` automatically
3. Run with one command: `node scripts/sync-journal.js`

Effort: ~1 hour to build. Maintenance: zero — just run the script after each
publish, commit, push.

### Option B — GitHub Actions auto-sync

The same script above, run on a daily cron via GitHub Actions. Commits any
changes to `main` automatically. Anmol does nothing — articles published on
Shopify show up here within 24 hours.

Effort: ~2 hours to build. Maintenance: zero. Requires a Shopify Admin API
token stored in GitHub Secrets.

### Option C — Client-side fetch from Shopify Storefront API

`journal.html` becomes a thin shell that fetches articles from Shopify's
public Storefront API in the browser on page load. Always in sync, no
deployment needed.

Effort: ~3 hours to build (requires Shopify Storefront API token + CORS
verification). Trade-off: more JavaScript on the page, slight delay before
cards render, harder for search engines to index.

**Default recommendation:** stick with manual updates for now. If/when we're
publishing >2 articles per month, switch to Option A.

---

## Visual parity with shop

The card design here intentionally mirrors `shop.bombaygothic.com/blogs/news`:

- **Background:** brand-beige `#F9F8F2` (matches page bg — no white-card contrast)
- **Image:** 24rem fixed height, `object-cover` so all images fill consistently
- **Title:** Playfair Display, 2rem, clamped to 2 lines
- **Date:** Raleway uppercase, tracking-wide, terracotta `#AA4837`
- **Excerpt:** Raleway extralight, gray-600, clamped to 2 lines
- **Read more:** Raleway, terracotta, underlines on hover
- **Hover:** card shadow deepens, image scales 105%

If you change any of these on the Shopify side (theme edit), please mirror
the change here too — or vice versa — to keep both sites looking like
siblings rather than cousins.
