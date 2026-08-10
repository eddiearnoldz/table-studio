# Tables London

Promotional website for Tables London built with Vue 3 + Vite.

## Setup

```sh
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the root:

```
VITE_SANITY_PROJECT_ID=cln5vehq
VITE_SANITY_DATASET=production
```

## Sanity CMS

Content is managed through [Sanity](https://www.sanity.io/) and fetched at runtime via the Sanity CDN. The studio lives in the sibling `tables-london-studio` directory.

### How it works

1. **Sanity Studio** (`../tables-london-studio`) provides the editing UI where content is created and published
2. **Sanity CDN** serves published content via a REST API using GROQ queries
3. **This site** fetches content on page load using `@sanity/client` (configured in `src/services/sanity.js`)

### Content types

| Type | Description | Used in |
|------|-------------|---------|
| `homePage` | About text, contact email, Instagram details | `HomeView.vue` |
| `eventsPage` | Events section title and description | `EventsView.vue` |
| `event` | Individual events with title, date, cover image and gallery | `EventsGrid.vue`, `EventLightbox.vue` |

### Updating content

1. Run the studio: `cd ../tables-london-studio && npx sanity dev`
2. Edit content in the studio UI at `http://localhost:3333`
3. Click **Publish** — changes appear on the site immediately (CDN cached)

### Images

Images uploaded to Sanity are served via their image CDN. The `urlFor()` helper in `src/services/sanity.js` generates optimised URLs with width, height, crop and format parameters.

## Build

```sh
npm run build    # Production build to /dist
npm run preview  # Preview production build locally
```

## Deployment

Hosted on Netlify. SPA routing handled by `public/_redirects`.
