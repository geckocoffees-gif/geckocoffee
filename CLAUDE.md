# Gecko Coffee website

Online shop for Gecko Coffee, a specialty coffee micro-roastery in Ciudad del Este, Paraguay. Owner: Patrick.

- Live: https://geckocoffee.com.py (also geckocoffee.vercel.app)
- Hosting: Vercel, deploys automatically from `main` in about a minute
- Plain HTML, CSS and JavaScript. No build step, no framework, no folders: every file sits in the repo root.
- The site is in Spanish (Paraguay). Talk to Patrick in English.

## How Patrick wants to work

- Show the change before it goes live, unless it is a verified one-line fix. Commit only after he says go.
- Preview visual changes on the live pages in the browser pane first. An injected preview vanishes on reload: say so.
- After pushing, check the live site (prices, layout, phone width), not just the code.
- Never change the header's look or the nav without being asked.
- Prices are written `60.000 Gs`: dot as thousands separator, " Gs" after.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Home. Keeps the Google Search Console meta tag: do not remove it. |
| `cafes.html` | Catalogue. Two sections, each a `.catalogue-label-row` above a `<section class="catalogue">`: **Micro-lotes** first, then **Nano-lotes**. |
| `producto-*.html` | One page per coffee (see below). |
| `cart.html` | Cart and order form. |
| `guia-del-cafe.html` | Coffee guide: Molienda, Agua, Preparación, Reposo, Conservación. |
| `informacion.html` | Envíos, Tueste, Cambios, Preguntas. |
| `script.js` | Shared on every page: side menu, footer, WhatsApp button, favicon, cart, order email, sale. |
| `style.css` | All styles. |
| `sitemap.xml`, `robots.txt` | SEO. Add every new product page to the sitemap. |

`script.js` injects the side menu, the footer (into the empty `<footer></footer>`), the WhatsApp bubble and the favicon. Never hand-write those into a page.

## Orders

There is no payment gateway. `submitOrder()` posts the cart to FormSubmit, which emails geckocoffees@gmail.com; Patrick follows up on WhatsApp (+595 981 197 868). The cart lives in `localStorage` under `geckoOrder`. `addToOrder(product, grind, size, unitPrice, quantity)` is what product pages call.

## Product pages

Adding or changing a coffee: follow the `gecko-nuevo-cafe` skill. The essentials:

- Template: copy `producto-tropical.html`.
- The carousel's thumbnails call `showProductImage(0)`, `(1)`, `(2)` … contiguous from 0, in the same order as the `productImages` array. Skipping a number breaks it.
- Image filenames must match the repo exactly, including spaces and case (`java -01.png` has a space).
- A price lives in five places, which must agree: the size button's `data-price`, `#selected-price`, `let selectedSizePrice` and `let selectedSize` in the page script, and the card on `cafes.html`. The card shows the smallest size.
- Sizes are 250 g and 1 kg (Tropical: 250 g only). "Molido" stays shown but disabled.

Current full prices (250 g / 1 kg, Gs):

| Coffee | Section | 250 g | 1 kg |
| --- | --- | --- | --- |
| Encanto | Micro-lotes | 60.000 | 220.000 |
| Imperial | Micro-lotes | 70.000 | 260.000 |
| Paraíso | Micro-lotes | 60.000 | 220.000 |
| Dorado | Micro-lotes | 50.000 | 180.000 |
| Regio | Micro-lotes | 75.000 | 280.000 |
| Esencia | Nano-lotes | 90.000 | 340.000 |
| Tropical | Nano-lotes | 120.000 | — |

Update this table when a price changes.

## Sales

`SALE` at the top of the sale section in `script.js` sets the name, percent, start and end (Paraguay time, UTC−3). While it is active, the script shows the old price crossed out with the new one on cards and product pages, adds a "−20%" badge, puts a bar on the home page, and tags cart items. The HTML always keeps the **full** price; the discount is worked out on page load, so a sale needs no revert. To run another sale, edit `SALE`.

Black Friday 2026: 20% off, 19–30 November.

## Design

- Colors: background `#fbf9f5`, header cream `#f5f1e8`, text `#24211d`, gold `#b68235`, dark gold `#7d5411`, footer `#1d1b18`.
- Fonts: Cormorant Garamond for headings, Lora for body (Google Fonts).
- Buttons: 2px radius, gold outline; primary filled `#7d5411`.
- Section label + line: `.catalogue-label-row` / `.catalogue-label` / `.catalogue-rule`.

## Known loose ends

- `sitemap.xml` is missing `producto-encanto.html`, `producto-regio.html` and `producto-tropical.html`.
- The footer's Facebook link points to `https://www.facebook.com`, not a Gecko Coffee page.
