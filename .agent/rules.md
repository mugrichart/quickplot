# QuickPlot — Project Rules

> This file is always read at the start of every conversation in this workspace.

---

## UI Component Library

- **Always use [shadcn/ui](https://ui.shadcn.com/)** for all UI components across the monorepo.
- Do **not** hand-roll UI primitives (buttons, inputs, dialogs, etc.) that shadcn/ui already provides.
- When adding a new component, prefer the shadcn/ui CLI:
  ```bash
  pnpm dlx shadcn@latest add <component>
  ```
  Run this from the `apps/client` directory (or whichever app houses the Next.js frontend).
- shadcn/ui components live in `apps/client/components/ui/`. Never move or rename this directory.
- Extend shadcn/ui components via `className` props and Tailwind utilities — do **not** modify the generated component source directly unless strictly necessary.
- Keep the `components.json` configuration file up to date with each new component addition.

---

## Modular Development

- **Always prefer small, focused components** over large, bloated page files.
- Pages (`app/**/page.tsx`) should be thin orchestrators — they import and compose feature components, they do not contain business logic or large JSX trees directly.
- Each distinct UI concept (a chart, a panel, a timeline, a control bar, etc.) gets its own component file under `src/components/`.
- Group related components in sub-folders (e.g., `src/components/story-visualize/`).
- Shared/generic components (buttons, cards, etc.) live in `src/components/ui/` (managed by shadcn/ui).
- Keep a component's responsibility to **one thing** — if a component is doing two unrelated things, split it.
