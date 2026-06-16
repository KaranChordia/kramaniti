This is the [Next.js](https://nextjs.org) portfolio website for Kramaniti.

## Getting Started

First, make sure Node.js (version 20+) is installed, then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/) with your browser to see the result.

## Project Structure

- `src/app`: Page routing and dynamic layout templates.
- `src/components`: Reusable layout and UI elements, including custom infographics.
- `src/data`: Insights essays and portfolio datasets.

## Deployment on Vercel

This project deploys through Vercel from the repository root as a standard Next.js app:

- The root `vercel.json` installs dependencies in `website/` and runs `npm run build`.
- Route handlers under `src/app/api/` are part of the runtime surface and can be used for server-side integrations such as the Clarity Engine assistant.
- The site is intended to serve from the custom domain root, not the old GitHub Pages `/kramaniti` subpath.
