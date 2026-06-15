# Delta Force Firearm Modification Codes

Delta Force Firearm Modification Codes is a lightweight web app for browsing and filtering firearm modification codes for Delta Force.

The site is built with Vite, React, TypeScript, Tailwind CSS, and React Router. It presents a searchable code library with filtering by weapon, mode, and tag, and includes quick copy support for each modification code.

## Features

- Browse a curated list of firearm modification codes.
- Filter results by weapon, mode, and tag.
- Copy modification codes directly from the interface.
- Render large lists efficiently with window virtualisation.
- Deploy as a static site.

## Tech Stack

- Vite
- React 19
- TypeScript
- Tailwind CSS 4
- React Router 7
- @tanstack/react-virtual
- Day.js

## Getting Started

### Prerequisites

- Node.js 20 or later is recommended.
- pnpm is required for dependency management and scripts.

### Install dependencies

```bash
pnpm install
```

### Start the development server

```bash
pnpm dev
```

### Build for production

```bash
pnpm build
```

### Preview the production build locally

```bash
pnpm preview
```

## Available Scripts

- `pnpm dev`: start the Vite development server.
- `pnpm build`: run TypeScript compilation and create a production build.
- `pnpm preview`: preview the production bundle locally.
- `pnpm lint`: run project linting.
- `pnpm deploy`: build and publish the site with `gh-pages`.

## Project Structure

```text
src/
	components/       Shared UI components
	layout/           Route layouts
	page/             Route pages
	router/           Router configuration
```

The current dataset is stored in `src/data/modification-codes.json`.

## Deployment

The repository is configured for static deployment. The `public/CNAME` file indicates the site is intended to be served on `onixbyte.dev`.

To deploy:

```bash
pnpm deploy
```

## Contributing

Contributions are welcome. If you want to improve the dataset, refine the filtering experience, or fix UI issues, open an issue or submit a pull request.

When contributing, please keep documentation and user-facing copy in British English.

## Licence

This project is released under the MIT Licence. See `LICENCE` for details.