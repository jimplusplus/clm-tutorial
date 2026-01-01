<!-- Copilot / AI agent instructions for the clm-tutorial repository -->
# clm-tutorial — AI coding assistant guide

Purpose: short, actionable guidance to help an AI agent be productive in this repository.

**Big Picture:**
- **Type:** Single-page React application built with Vite. Entry: `index.html` -> `src/main.jsx` -> `src/App.jsx` (main component `ContractManagementSystem`).
- **No backend:** All contract data is seeded in `src/App.jsx` as `initialContracts`. There is no API layer in the repo — any persistence or integration must be implemented explicitly.
- **Styling & icons:** Uses Tailwind CSS (`tailwind.config.js`, `postcss.config.js`, `src/index.css`) and `lucide-react` for icons.

**Where to look for core logic:**
- `src/App.jsx` — primary UI, state (React `useState`), handlers (`handleCreateNew`, `handleEdit`, `handleSaveContract`, etc.), `statusConfig` mapping. Most feature work will touch this file.
- `src/main.jsx` — app bootstrap and mount point.
- `index.html` — Vite entry; adjust script path or root markup here.
- `vite.config.js` — Vite plugins and dev server tweaks.

**Data flow & patterns (examples):**
- Local state only: components read/write `contracts` via `useState`. To add remote data, replace `initialContracts` with a fetch in `useEffect` (or lift to a context/provider).
- Status mapping: add a new contract status by updating `statusConfig` in `src/App.jsx` and it will automatically appear in the status `<select>` because the options are generated from `Object.keys(statusConfig)`.
- Icon imports: icons are imported from `lucide-react`; prefer re-using `statusConfig` icons rather than importing ad-hoc in components.

**Developer workflows (commands):**
```bash
# Start dev server with HMR
npm run dev

# Build production bundle
npm run build

# Preview the production build locally
npm run preview

# Run linter over the repo
npm run lint
```

Notes: `package.json` uses `type: "module"` and modern Vite tooling. Expect React 19 features; check `@vitejs/plugin-react` in `vite.config.js`.

**Project-specific conventions:**
- CSS: use Tailwind utility classes directly in JSX (no CSS modules by default). Keep layout in `src/App.jsx` consistent with existing grid/utility patterns.
- Handler naming: event handlers follow `handleXxx` convention (e.g., `handleDocumentUpload`). Keep this convention when adding new handlers.
- Minimal componentization: this template places most UI in a single file. When extracting components, keep props explicit and avoid implicit coupling to the top-level `contracts` state — prefer passing handlers and minimal data.

**When modifying behavior:**
- Searching/filtering: `filteredContracts` is computed with `useMemo` — keep pure computation there and avoid side effects.
- Adding persistence: create a small service (e.g., `src/services/api.js`) and call it from `useEffect` or action handlers. Replace the `initialContracts` constant with an async loader.

**Linting & formatting:**
- ESLint config at repo root (`eslint.config.js`) and scripts use `eslint .`. Run `npm run lint` before opening PRs.

**What I won't assume:**
- There are no tests or CI workflows in the repo; do not add test-related changes without the user's approval.
- No authentication/services configured — any API integration is out-of-scope unless requested.

If anything here is unclear or you want the instructions tuned (more examples, coding style rules, or a preferred component extraction strategy), tell me which area to expand.
