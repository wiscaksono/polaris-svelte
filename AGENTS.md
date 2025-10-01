# AGENTS

## Commands

- `pnpm run dev`, `pnpm run build` / `pnpm run build:prod`, `pnpm run preview` / `pnpm run preview:prod`
- `pnpm run lint`, `pnpm run format`, `pnpm run check` / `pnpm run check:watch`
- `pnpm run test:e2e`, `pnpm dlx vitest --run` / `pnpm dlx vitest <file>`

## Formatting & Linting

- Prettier: tabs, single quotes, no trailing commas, printWidth=160
- ESLint: JS/TS/Svelte recommended + plugin-prettier + plugin-boundaries

## TypeScript

- strict mode enabled (strict, noImplicitAny); explicit return/types

## Imports & Boundaries

- Follow plugin-boundaries: shared → feature → routes
- Use `$lib` alias or absolute `src/lib` imports; avoid deep relatives

## Naming Conventions

- Components: kebab-case.svelte; files: kebab-case.{ts,js}; stores/hooks: kebab-case

## Error Handling

- Wrap async calls in `try/catch`; throw descriptive `Error` instances

## Svelte Docs

Use the `mcp-svelte-docs_svelte_definition` tool to lookup Svelte 5 runtime definitions.

- Supported identifiers: `$state`, `$derived`, `$props`, `$effect`, `snippets`, `onclick`, `component-events`
- Available formats: `syntax`, `quick`, `full`
