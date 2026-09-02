# DOCUMENT.md

> Rules for any AI agent (or human) that creates or updates documentation in this repository.
> This is the single source of truth. Follow it strictly. Do not invent extra tools or pipelines.

## Goal

Keep the docs in `docs/` accurate and useful for new developers.
Docs are written and maintained by reading the actual source code.
There is no automated generation step — the agent _is_ the generator.

## Where docs live

| Path                      | Purpose                                      | Who may edit  |
| ------------------------- | -------------------------------------------- | ------------- |
| `docs/README.md`          | Index / onboarding entry point               | Agent + human |
| `docs/GETTING-STARTED.md` | Setup, env, run, build, lint                 | Agent + human |
| `docs/ARCHITECTURE.md`    | Folder structure, routing, layouts, aliases  | Agent + human |
| `docs/AUTHENTICATION.md`  | JWT flow, roles, guards, Axios interceptors  | Agent + human |
| `docs/FEATURES.md`        | Feature modules, service pattern, how to add | Agent + human |
| `docs/STYLING.md`         | Tailwind, Radix/shadcn, fonts, UI system     | Agent + human |
| `docs/CONVENTIONS.md`     | Naming, ESLint/Prettier, Git, deployment     | Agent + human |
| Root `README.md`          | Short project description + link to `docs/`  | Prefer human  |

Do **not** create new top-level doc files unless the user explicitly asks.

## Required workflow (every docs task)

1. **Read first**
   - Scan the relevant source under `src/` (especially `src/features/`, `src/components/`, `src/routes/`, `src/service/`, `src/config/`, `src/layouts/`).
   - Read the current contents of the affected `docs/*.md` files.
   - Never invent structure, routes, services, or components that do not exist in the code.

2. **Decide what changed**
   - New/removed/renamed feature, component, layout, or folder?
   - New public service, route, or auth behavior?
   - Change to project structure, path aliases, or styling system?

3. **Update only what is necessary**
   - Prefer editing the existing section over rewriting the whole file.
   - Keep the same section numbering and tone as the current docs.
   - Use real path aliases (`@/features/...`, `@/components/ui/...`).
   - Use tables and checklists the same way the existing docs do.

4. **Stay faithful to the code**
   - Document the service-layer pattern that actually exists.
   - Document the real feature skeleton: `*.type.ts`, `index.ts`, `components/`, `services/`.
   - Do not mention libraries or patterns that are not present.

5. **Finish**
   - Make sure relative links between docs still work.
   - Do not leave “TODO” or “update me” placeholders.
   - Summarize what you changed when you report back.

## Do’s

- Base every statement on code you can see.
- Mirror the existing writing style (practical, onboarding-oriented, numbered sections, tables).
- When a new feature appears, update the feature inventory and the “Adding a new feature” checklist in FEATURES.md.
- When routes, guards, layouts, or project structure change, update ARCHITECTURE.md (and AUTHENTICATION.md if auth-related).
- When UI primitives or styling approach changes, update STYLING.md.
- Keep examples copy-pasteable and consistent with real imports.

## Don’ts

- Do **not** introduce TypeDoc, Docusaurus, custom scripts, or any generation tooling.
- Do **not** create generated files.
- Do **not** invent features, routes, services, components, or folders.
- Do **not** rewrite an entire doc file when only one section needs updating.
- Do **not** add speculative “future” architecture.
- Do **not** put secrets, real tokens, or environment values in docs.
- Do **not** change the meaning of existing conventions unless the code has already changed.

## Quick reference — what to touch when code changes

| Code change                               | Docs to update                     |
| ----------------------------------------- | ---------------------------------- |
| New/changed feature under `src/features/` | FEATURES.md                        |
| New/changed component or layout           | ARCHITECTURE.md + STYLING.md if UI |
| Project structure / folder reorganization | ARCHITECTURE.md                    |
| Routing, guards, path aliases             | ARCHITECTURE.md                    |
| Auth flow, roles, Axios interceptors      | AUTHENTICATION.md                  |
| Tailwind / Radix / shadcn / fonts         | STYLING.md                         |
| Naming, lint, Git, deploy process         | CONVENTIONS.md                     |
| Setup steps, env vars, scripts            | GETTING-STARTED.md                 |

## Tone and format rules

- Match the voice already used in `docs/`.
- Prefer short paragraphs + tables + checklists.
- Use real file paths and real component/service names.
- Keep the docs useful for a new developer joining the project.

## Final checklist (agent must confirm)

- [ ] I read the current source and the current docs before editing
- [ ] Every claim is backed by code that exists
- [ ] I only touched the files that needed changes
- [ ] Links still work
- [ ] No new tooling or generated artifacts were introduced
- [ ] Style and structure stay consistent with the rest of `docs/`
