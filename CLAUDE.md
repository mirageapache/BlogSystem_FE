# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

React 19 + TypeScript frontend for a Substack-inspired blog system (concept: visitors browse posts/articles unauthenticated; registered users can publish, like, and comment). Built with **Vite 8** (migrated off Create React App in Phase 1; see `UPGRADE_PLAN.md`). Runs on Node 24 (see `.nvmrc` / `engines`). Backend is a separate repo consumed via `VITE_API_URL`. The live demo is deployed to GitHub Pages, though the README also mentions Vercel.

UI text and most code comments are in Traditional Chinese — preserve that convention when editing user-facing strings or adding comments.

## Commands

```bash
npm run dev          # Vite dev server on http://localhost:3000 (npm start is an alias)
npm run build        # Vite production build (output: dist/)
npm run preview      # Serve the production build locally
npm test             # vitest run (one-shot, jsdom)
npm run test:watch   # vitest watch mode
npm run coverage     # vitest run --coverage (v8 provider)
npm run test -- src/test/PostList.test.tsx   # Run a single test file
npm run deploy       # gh-pages publish of dist/ (runs predeploy build first)
npm run e2e          # Playwright E2E smoke set (chromium); auto-starts the dev server
npm run e2e:ui       # Playwright UI mode (watch/debug)
npm run e2e:report   # open the last HTML report
npm run e2e -- e2e/auth.spec.ts   # run a single E2E spec
```

Test note: tests run on **Vitest** (v4, migrated off jest in Phase 3.1), reusing `vite.config.ts` (the `test` block: `globals: true`, `environment: 'jsdom'`, `setupFiles: './src/setupTests.ts'`, `css: false`). `globals: true` provides `describe/test/expect/vi` without imports — `src/vitest.d.ts` (`/// <reference types="vitest/globals" />`) supplies the TS types, and `.eslintrc.json` declares them as globals in an `overrides` block scoped to test files. Use **`vi`** (not `jest`) for mocks: `vi.mock`, `vi.fn`, `vi.mocked(x)`. Two gotchas vs jest: (1) `vi.mock` factories are hoisted and **cannot** reference outer variables (jest's `mock`-prefix exception does not apply) — use `vi.hoisted(() => ({...}))`; (2) ESM default-export mocks must return `{ default: ... }` (e.g. `vi.mock('./Foo', () => ({ default: vi.fn() }))`). React 19 calls function components with a single `(props)` arg (no legacy context), so assert props via `vi.mocked(Cmp).mock.calls[i][0]` rather than `toHaveBeenCalledWith(props, {})`.

API-layer tests use **msw** (`src/test/msw/server.ts`, started/reset/closed in `setupTests.ts` with `onUnhandledRequest: 'error'`) to intercept real axios requests rather than mocking the api module. Because `API_URL = import.meta.env.VITE_API_URL` is empty in tests, `vite.config.ts` sets `test.env.VITE_API_URL = 'http://localhost/api'` so msw handlers match absolute URLs (e.g. `http.post('http://localhost/api/auth/signin', ...)`); add per-test handlers with `server.use(...)`. Pure-logic suites (`fetch`/`schemas`/`input`/`dateTime`/`slices`) need no msw — they don't issue requests. For `formatDateTime` (reads `new Date()`), fix "now" with `vi.useFakeTimers()` + `vi.setSystemTime(...)`.

E2E note: **Playwright** (`@playwright/test`, added Phase 3.2) lives in `e2e/`, configured by the root `playwright.config.ts` (NOT vitest). The smoke set is **route-mock-based** — `e2e/fixtures/mockApi.ts`'s `installApiFallback(page)` intercepts the backend API *origin* (`http://localhost:3500`, from `.env`'s `VITE_API_URL`) and individual endpoints are mocked with host-agnostic `**<path>` globs (later-registered routes win, so per-spec mocks override the fallback). **Scope the fallback by origin, never by path segment** — a path-segment matcher also swallows Vite's own dev module requests (`/src/pages/post/…`) and white-screens the app. The E2E dev server runs on a dedicated port **4399** (`--strictPort`), not the usual 3000 (Docker/other local apps squat on 3000/5173). The app exposes **no `data-testid`**, so specs use role/text/placeholder/aria-label; disambiguate the duplicate nav links (off-screen `#main-menu` vs the desktop sidebar) by scoping to `section.lg:w-60`. Vitest's default glob would pick up `e2e/*.spec.ts`, so `vite.config.ts` pins `test.include` to `src/**` and excludes `e2e`.

There is **no `npm run lint`** script — run ESLint directly if needed (`npx eslint src --ext .ts,.tsx,.jsx`). The config extends `airbnb` + `prettier` + `plugin:react/recommended` (`.eslintrc.json`).

Required env vars (see `.env.example`): `VITE_API_URL`. The deploy base path is controlled by Vite's `base` config (default `/`), surfaced at runtime as `import.meta.env.BASE_URL` — not an env var.

## Architecture

### Entry & providers
`src/index.tsx` wraps `<App/>` in this provider order (outer → inner): `QueryClientProvider` (`@tanstack/react-query` v5) → redux `Provider` → `BrowserRouter` (basename = `import.meta.env.BASE_URL`). All three are load-bearing; tests in `src/test/` use `redux-mock-store` and you must mirror this wrapping when adding new tests. (`CookiesProvider`/`react-cookie` was removed in Phase 2.3 — JWT is HttpOnly so the frontend never reads cookies.)

### Routing & layout
`src/App.tsx` is the single `<Routes>` table. Every page renders inside a fixed three-column layout: `SideBar` (desktop left rail), the routed page (center), and `BottomMenu` (mobile bottom nav). Layout class strings are centralized in `src/constants/LayoutConstants.ts` — reuse `SIDEBAR_FRAME` / `SIDEBAR_CONTAINER_FRAME` / `BOTTOM_MENU_FRAME` rather than re-deriving Tailwind classes.

Global modals (`ModalSection`, `SignInPopup`, `SignUpPopup`, `FindPassword`) are rendered from `App.tsx` and toggled via redux flags on `loginSlice` — pages should dispatch those flags rather than mounting their own login UI.

### State: Redux Toolkit + react-query coexist
Two independent state systems, used for different things:
- **Redux** (`src/redux/`, store in `configStore.ts`) holds cross-cutting UI/session state: `system` (dark mode, active page, explore tag, edit mode), `login` (popup visibility), `user` (current user profile), `post`. (`redux-form` was removed in Phase 1.2 — it was dead code; the misspelled `src/utils/reudxFormValidates.ts` it depended on has now been deleted.)
- **react-query** (`@tanstack/react-query` v5, migrated off `react-query` v3 in Phase 1.4) handles server data fetching/caching for lists and details. All hooks use the v5 object signature: `useQuery({ queryKey, queryFn, ...options })`, `useMutation({ mutationFn, onSuccess, onError })`, `useInfiniteQuery({ queryKey, queryFn, initialPageParam, getNextPageParam })`. `queryKey` must be an array; `useInfiniteQuery` requires an explicit `initialPageParam` (this project uses `1`) and its `queryFn` reads `{ pageParam }`. On mutations, the loading flag is `isPending` (v3's `isLoading`); queries still expose `isLoading` (= first load).

Auth flow lives in `App.tsx`: on mount, if redux has no `userData` and `localStorage.hasSession` is set, call `getMe()`. The backend issues JWT as an HttpOnly cookie and resolves the user from it server-side; `axios.defaults.withCredentials = true` (see `src/api/index.tsx`) so every request carries the cookie. The frontend never reads the JWT or user id from the browser — derive the current user from redux `state.user.userData`.

### API layer
All HTTP lives in `src/api/*.tsx`, one file per resource (`auth`, `user`, `post`, `article`, `comment`, `follow`). The base URL is `API_URL` exported from `src/api/index.tsx` (= `import.meta.env.VITE_API_URL`). Convention: each function `await axios.<verb>().then(res => res).catch(err => err.response)` and returns the raw response — callers then run `handleStatus(res.status)` from `src/utils/fetch.ts`, which collapses the status to its hundreds-digit (2 = success, 4 = auth/permission, etc.). Match this pattern when adding new endpoints; callers rely on it. `src/api/index.tsx` also installs a global axios response interceptor that handles `401 UN_AUTH` (clears user state + opens the sign-in popup).

Image uploads now go through the backend: create/edit forms send a `FormData` with an `imageFile` field (and `removeImage` flag) to the post/article endpoints. The old client-side Cloudinary `uploadImage` helper was removed.

### Path resolution
`tsconfig.json` sets `baseUrl: "src"` plus an explicit alias for `constants/*`. Vite resolves them natively via `resolve.tsconfigPaths: true` in `vite.config.ts`, and Vitest reuses that same `vite.config.ts` resolution — so there is now a single source of truth (the old `jest.config.js` `moduleDirectories`/`constants/*` mapper was removed with the Phase 3.1 Vitest migration). Imports like `components/post/PostItem` or `constants/LayoutConstants` resolve from `src/`.

### Forms (react-hook-form + zod)
Forms use **react-hook-form** v7 with **zod** schemas via `@hookform/resolvers/zod` (Phase 2.1). Validation schemas live in `src/schemas/` (`src/schemas/auth.ts` for sign-in/up, find/reset password; `src/schemas/user.ts` for the edit-profile form) — error message strings are kept in Traditional Chinese and matched to the existing test assertions. The shared `components/form/FormInput` and `components/form/FormTextArea` are RHF-compatible: pass `registration={register('field')}` and `errorMsg={errors.field?.message}` (they no longer take `value`/`setValue`/`name`/`handleEnter`). Submit via `<form onSubmit={handleSubmit(onSubmit)}>` with a `type="submit"` button; native Enter submits, so the old `handleEnter` prop is gone. For async-loaded forms (e.g. EditProfilePage fetches the profile via react-query), seed RHF with `reset(values)` inside the data-arrival `useEffect` rather than per-field `useState`.

zod is on **v4** (4.4.x) with `@hookform/resolvers` **v5**, unblocked by the **TypeScript 5.9** upgrade in Phase 2.1.1 (zod v4's `.d.cts` type defs require TS ≥5.5; they failed to parse on the old TS 4.9.5). zod-v4 idioms: error customization uses `{ error: '...' }` (the v3 `{ message: '...' }` is deprecated). One deliberate exception: the email fields keep the deprecated **`.email()` method form** (`z.string().min(1, '…必填').email('…格式錯誤')`) rather than the top-level `z.email()`, because top-level `z.email()` makes an empty string fail as a format error and loses the layered "required → format" message ordering (which the SignIn test asserts).

`EditProfilePage` is now migrated to RHF (Phase 2.1 batch 2): email/account/name/bio/language/emailPrompt/mobilePrompt are all `register`-ed and validated by `editProfileSchema`; only the avatar (preview + `imageFile`/`removeAvatar` FormData) remains in local `useState` because of its file-upload/preview logic, and `onSubmit` assembles the `FormData` from the validated values plus that avatar state. `src/utils/formValidates.ts` (the old manual-validation helpers) was deleted; the `validator` package was removed in Phase 2.3.

### Styling
Tailwind (config at `tailwind.config.js`) + SCSS in `src/styles/`. Dark mode is class-based: `App.tsx` puts `darkMode` (`''` or `'dark'`) on the root div, persisted in `localStorage` via `sysSlice.setDarkMode`. New components should use `dark:` variants rather than reading the redux flag directly.

### Rich text editor (Tiptap)
Article content uses **Tiptap v3** (`@tiptap/react` + `StarterKit`), migrated off draft-js in Phase 2.2. Shared extension config lives in `src/utils/tiptap.ts` (`editorExtensions`): StarterKit (which in v3 already bundles Bold/Italic/Underline/Strike/Code/CodeBlock/Blockquote/Heading/lists/Link) plus `TextStyle` + `Color` (both imported from `@tiptap/extension-text-style`), `Highlight` (multicolor), and `Image` (`allowBase64`, in-content images are inlined as base64). `EditorToolBar` takes the `editor` instance and drives `editor.chain().focus().…().run()` commands, reflecting active state via `editor.isActive(...)`; it subscribes to the editor's `transaction` event with a `forceUpdate` so the toolbar re-renders on every change (Tiptap v3's `useEditor` doesn't re-render the component per keystroke by default). `EditorToolItem` is now a presentational button (`onClick` + `isActive`).

**Content is stored as an HTML string** (`editor.getHTML()` on create/update; Tiptap loads it directly via `content` / `setContent`) — NOT draft-js raw-state JSON. There is no backend schema change (the `content` field was always a string). List previews (`ArticleItem`) render `DOMPurify.sanitize(content)` via `dangerouslySetInnerHTML`. Editor output styling is scoped to `.ProseMirror` in `src/styles/editor.scss` (headings, code blocks, lists, images; blockquote is global). Pre-2.2 articles stored as draft-js JSON are NOT auto-migrated (treated as disposable demo data per the Phase 2.2 decision).

### FontAwesome icons
Icons are imported directly, e.g. `import { faCircleLeft } from '@fortawesome/free-solid-svg-icons'` then `<FontAwesomeIcon icon={faCircleLeft} />`. The old `import.macro` (babel-plugin-macros) approach was removed in Phase 1.3 — it does not work under Vite's babel-free transform. Map by style: `solid` → `free-solid-svg-icons`, `regular` → `free-regular-svg-icons`, `brands` → `free-brands-svg-icons`.

### Notable quirks
- `src/pages/aritcle/` is misspelled (should be "article"); imports throughout reference this path — leave it unless doing a coordinated rename.
- Phase 2.3 removed the dead/redundant deps: `crypto-browserify` + `bcryptjs` (frontend password hashing is security-theatre; were unused in `src/`), `validator` (unused after the RHF/zod migration), and `react-cookie` (JWT is HttpOnly). `moment` was replaced by `dayjs` (configured in `src/utils/dayjs.ts` with the `advancedFormat` plugin for the `Do` token) — the 3 date-tooltip call sites (`ArticleItem`, `PostItem`, `PostDetailPage`) import `dayjs` from there. `lodash` is kept but imported per-method (`import get from 'lodash/get'`, `lodash/isEmpty`, `lodash/isString`) across `src/` so Vite can tree-shake it — do NOT reintroduce `import { get } from 'lodash'`. (`draft-js` / `draft-js-export-html` / `immutable` were removed in Phase 2.2 along with the Tiptap migration.)
- Vite entry is the root `index.html` (not `public/index.html`); `public/` is served at `/`. PostCSS/Tailwind run via `postcss.config.js`.
- Facebook share is intentionally paused (see commit `789992f`).
