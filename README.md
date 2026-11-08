# day0ops

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Welcome to my personal blog.

## Run locally

Install Node.js 24 and npm, then clone the repository and start the development server:

```sh
git clone https://github.com/day0ops/day0ops.github.io.git
cd day0ops.github.io
npm ci
npm run dev
```

Open the local URL printed by Astro, usually <http://127.0.0.1:4321/>. Changes to source files refresh the preview automatically.

## Check and build

```sh
npm run format:check
npm run check
npm run build
npm run verify
```

The static site is generated in `dist/`. Run `npm run preview` to view the production build locally.

Run `npm run format` to apply consistent formatting to source files. CI checks formatting, Astro/TypeScript diagnostics, the production build, and brand assets on pull requests and pushes to `main`. Deployment runs only after all checks pass on `main`.

## Write a post

Add a Markdown (`.md`) or MDX (`.mdx`) file under `src/content/blog/`. Use an existing post as a starting point for its title, date, description, and tags. Set `draft: true` to exclude a post from the published site, or `comments: false` to disable Giscus for that post.

Post tags populate the tag pages and determine related articles automatically.

## Deployment

The GitHub Actions workflow builds and deploys pushes to `main` using GitHub Pages. In the repository's **Settings → Pages**, select **GitHub Actions** as the publishing source.

Before using a custom domain, update the site URL in `astro.config.mjs`, `src/config/site.ts`, and `public/robots.txt`, and configure the domain in GitHub Pages and your DNS provider.

## Brand assets

To regenerate the favicon and social image, install Puppeteer's browser if needed, then run:

```sh
npx puppeteer browsers install chrome
npm run generate
npm run verify
```

## License

Licensed under the [MIT License](LICENSE).
