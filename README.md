# Honey Acres Ranch — Website

A complete redesign of the Honey Acres Ranch website — a charming ranch and
wedding venue in DeLand, Florida, owned and operated by David & Sherry.

## Stack

Vanilla HTML, CSS and JavaScript. No build step, no dependencies, no
environment variables. Open `index.html` in a browser or serve the folder
statically.

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Single-page site: hero, venue, offerings, gallery, testimonial, about, contact |
| `styles.css` | Design system (forest green / honey / bone palette), layout, responsive rules |
| `script.js` | Sticky header, mobile nav, scroll reveals, active-link tracking, gallery lightbox |
| `assets/favicon.svg` | Favicon |

## Content

All copy, photography and contact details come from the business itself:

- **Address:** 4179 Marsh Road, DeLand, FL 32724
- **Phone:** 386.717.7413
- **Email:** honeyacresranch@yahoo.com
- **Current offer:** Remaining 2026 dates are $1,000 off

Photography is served from the venue's existing image CDN — these are real
photographs of the ranch, its events and its owners.

## Accessibility & SEO

- Semantic landmarks, skip link, focus-visible styles, keyboard-navigable
  lightbox (arrows, Escape, focus trap) and `prefers-reduced-motion` support.
- Descriptive alt text on every image.
- Open Graph / Twitter meta tags and `EventVenue` JSON-LD structured data.
