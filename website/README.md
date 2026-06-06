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

This project is configured for static export (`output: 'export'`) and deploys through Vercel from the repository root:

- The root `vercel.json` installs dependencies in `website/`, runs `npm run build`, and publishes `website/out`.
- The site is intended to serve from the custom domain root, not the old GitHub Pages `/kramaniti` subpath.
