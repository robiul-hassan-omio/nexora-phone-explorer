# NEXORA — Phone Explorer

A responsive front-end phone catalogue made with HTML, CSS, and plain JavaScript. The live API integration follows the endpoints in the course reference project (`js/store.js`).

## Teacher API endpoints (kept unchanged)

- Search: `https://openapi.programming-hero.com/api/phones?search=QUERY`
- Details: `https://openapi.programming-hero.com/api/phone/PHONE_SLUG`

The teacher's `store.js` reads search results from `data.data`, uses each result's `phone_name`, `brand`, `slug`, and `image`, and loads details by `slug` from `data.data`. NEXORA keeps those fields and routes. It also accepts common alternate image keys (`image_url`, `thumbnail`, `img`) so images still render if an API payload varies.

## About HTTP 404

If the browser receives HTTP 404 from the exact teacher API URL, the API server has returned a Not Found response. Front-end JavaScript cannot restore a route that the API server does not serve. In that case, NEXORA displays preview entries instead, and the status banner provides an **Inspect API response** link. The retry button is intentionally hidden for HTTP 404 because repeatedly requesting the same missing route will not fix it. For network errors, timeouts, and retryable server errors, the retry option remains available.

Preview entries are not live API records. Their sample product images are direct image URLs from retailer product listings and may be unavailable in some regions or be changed by the hosting site. If a preview image cannot load, the local SVG illustration is used. Live cards always prefer the `image` field returned by the teacher API.

## Features

- Search by phone name or brand using Fetch API and `async`/`await`.
- Dynamic phone cards and details modal using DOM manipulation.
- CSS Grid, Flexbox, transitions, and responsive layout.
- Dark/light mode with saved preference.
- Loading, empty, timeout, API error, and image fallback states.

## Run locally

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173/`).

## Project structure

```text
nexora-phone-explorer/
├── assets/
│   ├── favicon.svg
│   └── phone-placeholder.svg
├── css/
│   └── style.css
├── js/
│   └── app.js
├── index.html
└── package.json
```
