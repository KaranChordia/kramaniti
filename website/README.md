This is the [Next.js](https://nextjs.org) portfolio website for Kramaniti.

## Getting Started

First, make sure Node.js (version 20+) is installed, then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000/kramaniti/](http://localhost:3000/kramaniti/) with your browser to see the result. Note that the site is configured with a custom `basePath: '/kramaniti'`.

## Project Structure

- `src/app`: Page routing and dynamic layout templates.
- `src/components`: Reusable layout and UI elements, including custom infographics.
- `src/data`: Insights essays and portfolio datasets.

## Deployment on GitHub Pages

This project is configured for static export (`output: 'export'`) and automatically deploys to GitHub Pages via GitHub Actions:

- The build script is `npm run build`, which outputs static assets to the `website/out` directory.
- The pipeline workflow is configured in `.github/workflows/nextjs.yml` and triggers on pushes to the `main` or `master` branch.
