# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

React 18 + TypeScript frontend for a Substack-inspired blog system (concept: visitors browse posts/articles unauthenticated; registered users can publish, like, and comment). Built on Create React App (`react-scripts` 5). Backend is a separate repo consumed via `REACT_APP_API_URL`. The live demo is deployed to GitHub Pages, though the README also mentions Vercel.

UI text and most code comments are in Traditional Chinese — preserve that convention when editing user-facing strings or adding comments.

## Commands

```bash
npm start            # CRA dev server on http://localhost:3000
npm run build        # Production build (output: build/)
npm test             # CRA / react-scripts test runner (watch mode, jsdom)
npm run jest         # Standalone jest using jest.config.js (one-shot)
npm run jest -- src/test/PostList.test.tsx   # Run a single test file
npm run deploy       # gh-pages publish of build/ (runs predeploy build first)
```

There is **no `npm run lint`** script — run ESLint directly if needed (`npx eslint src --ext .ts,.tsx`). The config extends `airbnb` + `prettier` + `plugin:react/recommended`.

Required env vars (see `.env.example`): `REACT_APP_PUBLIC_URL`, `REACT_APP_API_URL`.

## Architecture

### Entry & providers
`src/index.tsx` wraps `<App/>` in this provider order (outer → inner): `QueryClientProvider` (react-query) → redux `Provider` → `CookiesProvider` → `BrowserRouter` (basename = `PUBLIC_URL`). All four are load-bearing; tests in `src/test/` use `redux-mock-store` and you must mirror this wrapping when adding new tests.

### Routing & layout
`src/App.tsx` is the single `<Routes>` table. Every page renders inside a fixed three-column layout: `SideBar` (desktop left rail), the routed page (center), and `BottomMenu` (mobile bottom nav). Layout class strings are centralized in `src/constants/LayoutConstants.ts` — reuse `SIDEBAR_FRAME` / `SIDEBAR_CONTAINER_FRAME` / `BOTTOM_MENU_FRAME` rather than re-deriving Tailwind classes.

Global modals (`ModalSection`, `SignInPopup`, `SignUpPopup`, `FindPassword`) are rendered from `App.tsx` and toggled via redux flags on `loginSlice` — pages should dispatch those flags rather than mounting their own login UI.

### State: Redux Toolkit + react-query coexist
Two independent state systems, used for different things:
- **Redux** (`src/redux/`, store in `configStore.ts`) holds cross-cutting UI/session state: `system` (dark mode, active page, explore tag, edit mode), `login` (popup visibility), `user` (current user profile), `post`. Also includes `redux-form`'s reducer under the `form` key — `redux-form` is still used for some forms (see `src/utils/reudxFormValidates.ts` — note the misspelled filename, do not "fix" without grepping for imports).
- **react-query** handles server data fetching/caching for lists and details.

Auth flow lives in `App.tsx`: on mount, if redux has no `userData` and `localStorage.hasSession` is set, call `getMe()`. The backend issues JWT as an HttpOnly cookie and resolves the user from it server-side; `axios.defaults.withCredentials = true` (see `src/api/index.tsx`) so every request carries the cookie. The frontend never reads the JWT or user id from the browser — derive the current user from redux `state.user.userData`.

### API layer
All HTTP lives in `src/api/*.tsx`, one file per resource (`auth`, `user`, `post`, `article`, `comment`, `follow`). The base URL is `API_URL` exported from `src/api/index.tsx` (= `process.env.REACT_APP_API_URL`). Convention: each function `await axios.<verb>().then(res => res).catch(err => err.response)` and returns the raw response — callers then run `handleStatus(res.status)` from `src/utils/fetch.ts`, which collapses the status to its hundreds-digit (2 = success, 4 = auth/permission, etc.). Match this pattern when adding new endpoints; callers rely on it.

Image uploads go directly to Cloudinary (unsigned preset `blogSystem`, cloud `db9878jd4`) via `uploadImage` in `src/api/index.tsx` — not through the backend.

### Path resolution
`tsconfig.json` sets `baseUrl: "src"` plus an explicit alias for `constants/*`, and `jest.config.js` mirrors this with `moduleDirectories: ['node_modules', 'src']` plus a `constants/*` mapper. Imports like `components/post/PostItem` or `constants/LayoutConstants` resolve from `src/`. Keep both configs in sync when adding aliases.

### Styling
Tailwind (config at `tailwind.config.js`) + SCSS in `src/styles/`. Dark mode is class-based: `App.tsx` puts `darkMode` (`''` or `'dark'`) on the root div, persisted in `localStorage` via `sysSlice.setDarkMode`. New components should use `dark:` variants rather than reading the redux flag directly.

### Notable quirks
- `src/pages/aritcle/` is misspelled (should be "article"); imports throughout reference this path — leave it unless doing a coordinated rename.
- `webpack.config.js` exists at the repo root but is not used by `react-scripts`; CRA owns the real build config.
- `crypto-browserify` is a dependency for `bcryptjs` in-browser usage; do not remove without checking auth code.
- Facebook share is intentionally paused (see commit `789992f`).
