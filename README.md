# Next.js + Tailwind + daisyUI Starter

This repository contains a Next.js App Router project bootstrapped with TypeScript and pre-configured tooling for Tailwind CSS, daisyUI, ESLint, Prettier, and JSCPD. It provides an opinionated starting point for building modern React applications with a consistent developer experience.

## Prerequisites

- Node.js >= 18.18 (an `.nvmrc` file pinned to version 20 is included)
- npm  (bundled with Node.js)

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The app is served at [http://localhost:3000](http://localhost:3000). The home page includes a daisyUI button to verify that Tailwind CSS is working correctly.

## Available Scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Start the Next.js development server (Turbopack). |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Start the production server. Run `npm run build` first. |
| `npm run lint` | Lint the entire project using ESLint. |
| `npm run typecheck` | Run `tsc --noEmit` to type-check the project. |
| `npm run format` | Format the codebase with Prettier. |
| `npm run format:check` | Verify formatting without making changes. |
| `npm run jscpd` | Detect duplicated code and produce an HTML report in `reports/jscpd`. |

## Project Structure

- `app/` – App Router routes, layouts, and global styles.
- `app/page.tsx` – Example homepage with a Tailwind/daisyUI UI element.
- `tailwind.config.js` – Tailwind configuration with daisyUI enabled.
- `.jscpd.json` – JSCPD configuration for duplicate code detection.
- `.prettierrc` / `.prettierignore` – Prettier formatting rules and exclusions.
- `eslint.config.mjs` / `.eslintignore` – ESLint configuration and ignore patterns.

## Code Quality & Reporting

- **Formatting**: Run `npm run format` before committing to keep consistency.
- **Linting**: `npm run lint` ensures code quality using ESLint with TypeScript and Prettier integration.
- **Duplicate Detection**: `npm run jscpd` checks for code duplication and generates an HTML report in `reports/jscpd` in addition to console output.

Feel free to extend the configuration to suit your project's needs.
