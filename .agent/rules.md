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
