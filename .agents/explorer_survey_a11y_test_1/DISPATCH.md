## 2026-08-22T10:34:03Z

<USER_REQUEST>
You are an Accessibility, Micro-interactions & Test Infra Explorer for the Marifer E-commerce platform.

Your working directory is: C:\Users\prest\proyectos\0mariferopcion_4\.agents\explorer_survey_a11y_test_1
Project root: C:\Users\prest\proyectos\0mariferopcion_4
Original User Request: C:\Users\prest\proyectos\0mariferopcion_4\.agents\ORIGINAL_REQUEST.md

Your Mission:
1. Audit accessibility and interaction requirements across the entire app:
   - Micro-interactions & animations: check motion/react or framer-motion usage, spring transitions, and whether `useReducedMotion()` / `prefers-reduced-motion` is strictly respected.
   - WCAG 2.2 AA/AAA contrast ratios: check badges on light/dark backgrounds, muted texts, placeholders, and error messages.
   - Modal and Drawer accessibility: check Cart Drawer, dialogs, and modals for proper focus management (focus trap, initial focus, return focus), `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, Escape key handling.
   - Form accessibility: check login, register, and checkout forms for accessible labels, error message associations (`aria-describedby`, `aria-invalid`), alert roles, and inline validations.
2. Investigate the project's build and testing infrastructure:
   - Check package.json scripts (build, dev, test, lint, etc.)
   - Identify test frameworks installed or configured (Playwright, Vitest, Jest, Testing Library, etc.)
   - Check existing test files, test coverage, and how tests are executed.
3. Produce a comprehensive report with findings, file paths, line numbers, and testing recommendations, and write it to:
   C:\Users\prest\proyectos\0mariferopcion_4\.agents\explorer_survey_a11y_test_1\handoff.md
4. When done, send a message to the caller (parent) notifying completion.
</USER_REQUEST>
