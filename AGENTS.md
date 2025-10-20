# Agent Guidelines

This is a Next.js project. Where possible, please follow best practices for Next.js apps.

## Scripts

Use `pnpm` to run any package scripts or install dependencies.

## Development

Avoid starting the dev server while making changes (i.e. do not run `pnpm dev`)

## File Structure & Organization

- Structure your project for clarity and scalability (e.g., group components, pages, and utilities logically).

## Components

- Use functional components and React hooks.
- Keep components small and focused—prefer composition over monolithic components.
- Place reusable components in a `components/` folder.
- Prefer existing ShadCN components to writing your own. If you have to, then your custom component should make use of any existing ShadCN components where possible

## Localization

- For any visible text, use localizations in a localization folder
- All text should be in a types file in the localization folder
- Whatever languages are present in this folder should have an entry added to it

## Styling

- Use TailwindCSS for styles
- Avoid plain CSS, CSS Modules, or CSS-in-JS where possible
- Use themed colors (e.g. primary, secondary, background, foreground, etc.) instead of direct colors. If a new color is needed, prefer to create a new category of color, and add it to both light and dark themes

## Images and Icons

- Optimize images with the built-in `<Image />` component.
- Icons should make use of Lucide where possible. Don't generate SVGs for icons

## Type Safety

- When defining new types, use 'type' instead of 'interface'

## Testing

- Write unit tests for any new feature you develop using Vitest
- Place unit tests in the same folder as the component being tested in a \*.spec.ts(x) file
- **Run `pnpm test:coverage`** after finishing your task to verify overall code coverage remains at or above **60%**
- Ensure new code includes adequate test coverage to maintain the 60% threshold
- Do not adjust code coverage thresholds unless explicitly stated

## Linting

- Check to make sure linting passes after each code change by running `pnpm lint`
