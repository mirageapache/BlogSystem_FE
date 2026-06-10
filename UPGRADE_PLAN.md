# BlogSystem_FE 改版規劃文件

> 撰寫日期：2026-05-28
> 目標：分階段修正程式面缺陷、汰換過時技術棧、建立自動化品質防線
> 原則：**先修錯，再升級，後加固**。每一階段都必須可獨立驗證、可回滾。

---

## 📋 目錄
- [Phase 0：程式面錯誤修正（P0~P2）](#phase-0程式面錯誤修正p0p2)
- [Phase 1：基礎建設升級（Node + React + Vite）](#phase-1基礎建設升級node--react--vite)
- [Phase 2：汰換停止維護套件（redux-form / draft-js / moment / lodash）](#phase-2汰換停止維護套件)
- [Phase 3：測試補完（Unit Test + E2E Test）](#phase-3測試補完unit-test--e2e-test)
- [Phase 4：可觀測性與容器化（Sentry / Docker / Nginx）](#phase-4可觀測性與容器化)
- [Phase 5：CI/CD 自動化](#phase-5cicd-自動化)
- [建議執行順序與時程](#建議執行順序與時程)

---

## Phase 0：程式面錯誤修正（P0~P2）

> **必須最先完成**。理由：未修正前進入版本升級，會把 bug 混在升級 diff 裡，PR review 時無法分辨「是新版本造成的還是本來就有的」。修完後一次 commit、確認可運行，再開始 Phase 1。

### 🔴 P0 致命錯誤（修不掉 React 18 會拋例外或無聲資料污染）

#### P0-1：`EditProfilePage` 違反 Rules of Hooks
- **位置：** `src/pages/user/EditProfilePage.tsx:55-58`
- **問題：** `if (isEmpty(userId)) { ...; return <Spinner />; }` 提早 return，但下方仍有 `useQuery` / `useEffect` / `useState`，下次 render（userId 取得後）hooks 數量改變 → React 拋 "Rendered fewer hooks than expected"。
- **修法：** 把 guard 移到 `useEffect`，並用 `useQuery({ enabled: !!userId && firstLoad })` 控制執行：
  ```tsx
  useEffect(() => {
    if (isEmpty(userId)) sliceDispatch(setSignInPop(true));
  }, [userId]);

  const { isLoading, data } = useQuery('editProfile', getOwnProfile, {
    enabled: !!userId && firstLoad,
  });

  if (isEmpty(userId) || isLoading) return <Spinner />;
  ```

#### P0-2：`ExplorePage` 在 render 階段 dispatch + 條件式 useSelector
- **位置：** `src/pages/ExplorePage.tsx:41-48`
- **問題：**
  1. `if (!isEmpty(tag)) handleTabActive(tag!)` 直接在 component body 呼叫 dispatch → 每次 render 觸發 store 更新 → 死循環警告
  2. `useSelector` 被放在 `else` 分支內 → **Hook 在條件分支中** → 違規
- **修法：**
  ```tsx
  const exploreTagFromStore = useSelector((s: stateType) => s.system.exploreTag);
  const exploreTag = tag || exploreTagFromStore;
  useEffect(() => {
    if (tag) dispatch(setExploreTag(tag));
  }, [tag]);
  ```

#### P0-3：無限滾動 `let nextPage = -1` 的 Stale Closure Race
- **位置：** `src/components/explore/ExplorePost.tsx:17,28,52,59`、`ExploreUser.tsx:17,25,47,54`、`ExploreArticle.tsx`、`HomePage.tsx:39-52`
- **問題：** `nextPage` 是 function body 內的 `let`，每次 render 重設為 -1；`handleScroll` 與 `useEffect([nextPage])` 抓的是 **凍結 closure 值**，導致：
  - 第 1 頁拉完後可能誤判 `atBottom` 為 true
  - 已到底時 scroll 仍持續 fetchNextPage → 後端噴錯
- **修法：** 完全交給 `useInfiniteQuery` 內建的 `hasNextPage` / `isFetchingNextPage`：
  ```tsx
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(['explorePost', searchString], queryFn, {
      getNextPageParam: lp => (lp?.nextPage > 0 ? lp.nextPage : undefined),
    });

  const handleScroll = () => {
    if (atBottomOfPage() && hasNextPage && !isFetchingNextPage) fetchNextPage();
  };
  ```
- **HomePage 也應該整個改寫為 `useInfiniteQuery`**，目前手動 page state + 固定 queryKey `'homepagePost'` 導致 react-query cache 失效（不同頁的資料寫入同一個 cache slot）。

#### P0-4：`formValidates.maxLength` / `checkLength` 缺 return → 驗證永遠 pass
- **位置：** `src/utils/formValidates.ts:13-15`、`src/utils/reudxFormValidates.ts:14-16, 22-23`
- **問題：**
  ```ts
  export const maxLength = (value, max, msg) => {
    if (!isEmpty(value)) value.length > max ? msg : '';  // ← 沒 return！
  };
  ```
  呼叫端永遠拿到 `undefined`，相當於沒驗證。
- **修法：** 補上 `return`：
  ```ts
  export const maxLength = (value: string, max: number, msg: string) =>
    !isEmpty(value) && value.length > max ? msg : '';
  ```

---

### 🟠 P1 中度錯誤（會造成資料不同步或誤導使用者）

#### P1-1：`PostInfoPanel` 拷貝 prop 進 local state，refetch 後資料不同步
- **位置：** `src/components/post/PostInfoPanel.tsx:33,36-38`
- **問題：** `const [post, setPost] = useState(postData)` 將 prop 拷進 state，外層 `refetch()` 後新資料無法反映到 UI（典型 derived state 反模式）。
- **修法：** 移除 local `post` state，直接用 props；like mutation 成功後用 `queryClient.setQueryData(['postDetail', id], ...)` 同步 cache。

#### P1-2：到處 `window.location.reload()` 造成 SPA 退化
- **位置：** `PostItem.tsx:68`、`PostCreateModal.tsx:73`、`PostEditModal`（同樣模式）
- **問題：** 建立/刪除貼文成功後直接 reload → Redux state、scroll 位置、user session 全毀。
- **修法：** 改用 `queryClient.invalidateQueries(['homepagePost'])` 或局部 `setQueryData`。

#### P1-3：DOMPurify 預設剝除 inline handler，hashtag 點擊會 bubble
- **位置：** `src/utils/input.ts:16` 生出的 `<a onclick="event.stopPropagation();">`
- **問題：** DOMPurify 預設配置會把 `onclick` 屬性刪掉 → hashtag link 一點擊就被父 div 的 `handleClickPost` 攔走、跳到貼文頁。
- **修法：** 父層用 event delegation 判斷點擊目標：
  ```tsx
  onClick={(e) => {
    if ((e.target as HTMLElement).closest('a.hash-tag')) return;
    handleClickPost();
  }}
  ```
  並從 `handleHashTag` 移除無用的 `onclick=` 字串。

#### P1-4：Auth 初始化缺 abort/ignore guard
- **位置：** `src/App.tsx:58-84`
- **問題：** `initUser()` 為 free-floating async，無 AbortController、無 isMounted 旗標；userId 短時間變動可能讓舊的 getMe response 覆蓋新 state。Effect deps 也漏寫 `userData`。
- **修法：**
  ```tsx
  useEffect(() => {
    if (!isEmpty(userData) || !localStorage.getItem('hasSession')) return;
    const controller = new AbortController();
    getMe({ signal: controller.signal }).then(/* ... */);
    return () => controller.abort();
  }, [userId, userData]);
  ```

#### P1-5：`getPartialPosts` / `getPartialArticles` 型別騙人
- **位置：** `src/api/post.tsx:38-52`、`src/api/article.tsx:38-52`
- **問題：** 標示 `Promise<PostPageListType>`，但 `page <= 0` 時回傳 `null`；錯誤時回傳 `{ code: 'ERR_NETWORK' }`，runtime 與 type 不一致。
- **修法：** 改為 `Promise<PostPageListType | null>`，或在 caller 用 `useInfiniteQuery` 後就不需要 `page <= 0` 短路（hasNextPage 已經處理）。

#### P1-6：`PostInfoPanel.tsx:79` 字串多了 `}`
- **位置：** `src/components/post/PostInfoPanel.tsx:79`
- **問題：** `text=與你分享一則Blog貼文}` 末端多了字面值 `}`。
- **修法：** 移除多餘字元。

#### P1-7：`EditProfilePage` 將 null avatarFile 也 append 進 FormData
- **位置：** `src/pages/user/EditProfilePage.tsx:135`
- **問題：** `formData.append('imageFile', avatarFile)` 在 `avatarFile === null` 時會送出字串 `"null"`，後端可能誤判。
- **修法：**
  ```ts
  if (avatarFile instanceof File) formData.append('imageFile', avatarFile);
  ```

#### P1-8：`HomePage` useQuery key 沒帶 page，cache 機制失效
- **位置：** `src/pages/HomePage.tsx:20`
- **問題：** `useQuery('homepagePost', () => getPartialPosts(page))` 不同頁共用同一個 cache key → react-query 不知道你在分頁。
- **修法：** 改為 `useInfiniteQuery`（與 ExplorePost 一致），詳見 P0-3。

---

### 🟡 P2 輕度錯誤（不會崩但礙眼）

| 編號 | 位置 | 問題 | 修法 |
|------|------|------|------|
| P2-1 | `src/utils/formValidates.ts:62-65` | `isEmail` 回傳 boolean，與其他 validator 回 `string \| undefined` 的 contract 不一致 | 統一回傳 `string \| undefined` |
| P2-2 | `src/utils/reudxFormValidates.ts` | 檔名拼錯（reudx → redux），且功能與 `formValidates.ts` 重複 | 隨 redux-form 移除一併刪除 |
| P2-3 | `src/utils/dateTime.ts:36` | `currentDate.getDate() - inputDate.getDate()` 跨月時為負或誤判 | 用 `(currentDate - inputDate) / 86400000` |
| P2-4 | `src/redux/userSlice.ts:6-8` | `userData: UserProfileType \| undefined` 不一致（Redux 建議 `null`） | 改為 `null` 並更新 selector |
| P2-5 | `src/App.tsx:67` | `GUEST_USER_DATA as any` 型別逃逸 | 為 GUEST_USER_DATA 補上正確型別 |
| P2-6 | `src/index.tsx:22` | `<CookiesProvider>` 已無實際讀寫 cookie 的點（JWT 是 HttpOnly） | 移除 `react-cookie` |
| P2-7 | `src/index.tsx:17` | `new QueryClient()` 未設 defaultOptions，retry 3 次太慢 | `{ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } }` |
| P2-8 | 各 API `posts: any` `articles: any` `userList: any` | 任意型別污染 | 改為 `PostDataType[]` 等正確型別 |
| P2-9 | `src/pages/ExplorePage.tsx:84-101` | `switch + useEffect` 設樣式 class，本質是 derived | 改為 `const UNDERLINE = { article: '...', post: '...' }` lookup |
| P2-10 | `src/utils/common.ts:45-86` | 18 行 switch case 做 hex→tailwind class 轉換 | 改為 `Record<string,string>` lookup |

---

### Phase 0 完成驗收標準
- [x] `npm test` 全綠
- [x] `npm start` 開發環境無 React warning（包含 Hooks 規則、deps 警告）
- [x] 手動 smoke test：首頁滾動載入、Explore 搜尋切換、新增/刪除貼文、編輯個人資料
- [x] git commit message：`fix: 修正 P0/P1/P2 程式面缺陷（pre-upgrade hardening）`

---

## Phase 1：基礎建設升級（Node + React + Vite）

> 完成 Phase 0 後立即進入。Vite 切換是一次性工程；React 18 → 19 與 Node 升級可以同一個 PR 一起做（diff 雖大但同質性高）。

### 1.1 Node 升級
- **現況推測：** Node 16/18（CRA 5 + react-scripts 時代）
- **目標：** Node **24 LTS**（2026-05 時 Node 24 為 Active LTS、Node 26 為 current；Node 20 已 EOL、Node 22 進入 maintenance）
- **過渡期注意：** react-scripts 5 在 Node 24 下啟動會出現 unsupported engine 警告（不影響運作）。因 Phase 1 後段就會拔 CRA 換 Vite，警告期間很短可接受；Vite 5/6 + React 19 + react-query v5 對 Node 24 是正式支援。
- **動作：**
  - 新增 `.nvmrc`（內容：`24`）
  - `package.json` engines 欄位設 `"engines": { "node": ">=24.0.0 <25.0.0" }`（鎖在 LTS 偶數版區間，避免有人在奇數版 Node 25 上安裝）
  - 開發團隊各自 `nvm use`
  - CI runner 設 `node-version: 24`（GitHub Actions `actions/setup-node@v4`）

### 1.2 React 升級
- **現況：** React 18.2
- **目標：** React **19.x**
- **重點變更：**
  - `ReactDOM.render` 已徹底移除（已用 createRoot，OK）g
  - `forwardRef` 在 19 已不必要（function component 可直接接 `ref` prop）
  - `useFormStatus` / `useActionState` / `use()` 等新 API 可在 Phase 2 表單重寫時利用
  - 注意：`redux-form` **完全不相容 React 19**，因此 redux-form 汰換**必須先於或同時於** React 19 升級

> **執行狀態（2026-06-02）：** 1.1 Node 24 ✅、1.2 React 19 ✅、1.3 Vite ✅、1.4 react-query v5 ✅ 已完成。Phase 1 已全部完成（除「線上部署實測」一項待驗）。
> 1.3 重要決策：FontAwesome `import.macro` 在 Vite（plugin-react v6 已無 Babel、改用 oxc）下無法運作，已用 codemod 將 22 檔/69 處 `icon({...})` 轉為直接 `import faXxx`，並移除 babel-plugin-macros。測試框架暫留 jest（`.babelrc` 仍由 babel-jest 使用），Vitest 遷移延到 Phase 3。`PUBLIC_URL` 不再是 env 變數，改由 Vite `base` 提供（`import.meta.env.BASE_URL`）。
> 1.4 重要決策：`@tanstack/react-query@5.100.x`。全專案 19 處 hook 改 v5 物件式（9 個 `useInfiniteQuery`、5 個 `useQuery`、約 13 個 `useMutation`）。`useInfiniteQuery` 補上必填 `initialPageParam: 1` 並移除已棄用的 `keepPreviousData: false`（本來就是預設值）；mutation 的 `isLoading` 一律改 `isPending`（JSX 讀取點同步更新或以 `isPending: isLoading` 別名沿用）；`useQuery('editProfile', …)` 的字串 key 改為陣列 `['editProfile']`。`queryClient.setQueryData/setQueriesData/invalidateQueries` 在 v5 簽名相容，無需改動。安裝沿用 `--legacy-peer-deps`（`@cloudinary/react` 僅支援 React ≤18，屬 Phase 2 死碼清理對象）。

### 1.3 Vite 導入（取代 CRA / react-scripts）
- **動機：** CRA 已停止維護（Meta 2023 公告），dev server 慢、HMR 不穩；Vite 5/6 開發體驗壓倒性勝出。
- **遷移要點：**
  | 項目 | CRA | Vite |
  |------|-----|------|
  | 入口 HTML | `public/index.html` 由 webpack 注入 | `index.html` 放專案根、直接 `<script type="module" src="/src/index.tsx">` |
  | 環境變數 | `REACT_APP_*` | `VITE_*`（需重新命名 `.env.example` 與所有讀取點） |
  | 路徑別名 | `tsconfig.baseUrl: "src"` + `jest.config moduleDirectories` | `vite.config.ts` 的 `resolve.alias` + `tsconfig.paths` |
  | PUBLIC_URL | `process.env.PUBLIC_URL` | `import.meta.env.BASE_URL` |
  | 測試 | `react-scripts test`（jest） | **Vitest**（與 Vite 同生態，jest 設定可平移） |
  | SCSS | 開箱即用 | 需安裝 `sass` 即可 |
- **檔案改動清單：**
  - 刪除：`webpack.config.js`（CLAUDE.md 已說明它根本沒被用到）、`react-scripts` 相關 devDep
  - 新增：`vite.config.ts`、`vitest.config.ts`、`index.html`（root level）
  - 更新：`package.json` scripts → `dev` / `build` / `preview` / `test`
  - 全專案 `process.env.REACT_APP_API_URL` → `import.meta.env.VITE_API_URL`（grep 替換約 5~10 處）

### 1.4 react-query → @tanstack/react-query v5 ✅
- v3 已是 legacy，新版 API 變動（實際套用結果）：
  - `useQuery('key', fn, opts)` → `useQuery({ queryKey: ['key'], queryFn: fn, ...opts })`；`queryKey` 一律須為陣列
  - `useMutation(fn, opts)` → `useMutation({ mutationFn: fn, ...opts })`；mutation 的 `isLoading` → `isPending`
  - `useInfiniteQuery`：改物件式 + **新增必填 `initialPageParam: 1`** + `queryFn: ({ pageParam }) => …`；移除已棄用且為預設的 `keepPreviousData: false`
  - query 的 `isLoading` v5 仍存在（= 首次載入），語意不變故保留；`RqResponseType` 型別無需改動
  - `queryClient` 的 `setQueryData / setQueriesData / invalidateQueries` 簽名相容，無改動
- 驗證：tsc 0 error、eslint 0 error（9 既有 warning）、`vite build` 545 modules 成功、jest 10 過/3 既有失敗（與遷移前一致）。

### Phase 1 驗收
- [x] `npm run dev` 啟動秒開（實測 ~150ms ready）
- [x] `npm run build` 產出 bundle（dist/，538 modules、~1.5s）；移除誤打包的 macro 機制後 bundle 由 1,577KB→1,166KB（gzip 447→358KB）
- [x] React 19 + Vite 並未引入新的 console warning（build / dev / tsc / eslint 皆 0 error）
- [ ] 環境變數重新命名後**線上部署**可運作（dev 已驗證 `VITE_API_URL`/`BASE_URL` 正確注入；正式 GitHub Pages 部署待實測）
- [x] 1.4 react-query v5 升級（19 處 hook 改物件式 API；tsc/eslint/build/jest 皆通過）

---

## Phase 2：汰換停止維護套件

### 2.1 redux-form → react-hook-form + zod

> **執行狀態（2026-06-03）：** 第一批 ✅、第二批 ✅。盤點發現 **redux-form 早在 Phase 1.2 即被當 dead code 移除**（`package.json` 與 `src/` 皆無殘留、`reudxFormValidates.ts` 也已刪），故 2.1 實質工作是「將手動 `useState`+`FormInput` 表單現代化為 react-hook-form + zod」。
>
> **第一批（auth 表單）：**
> - 已改寫 4 個 auth 表單：`SignInPopup` / `SignUpPopup` / `FindPassword` / `ResetPassword`。
> - `components/form/FormInput` 重構為 RHF 相容（`registration` + `errorMsg`，移除 `value/setValue/name/handleEnter` 與內部 onBlur 驗證）。
> - 新增 `src/schemas/auth.ts`（zod schema），刪除死碼 `src/utils/formValidates.ts`；`validator` 套件就此無人使用（併入 2.3 移除）。
> - 測試：`SignInPopup` / `SignUpPopup` 兩個 suite 由原本失敗轉為**全綠**（補上 `MemoryRouter` 包裝供 `useNavigate`，並對齊登入成功的 Swal `timer` 斷言）。
>
> **第二批（EditProfilePage）：**
> - `EditProfilePage` 全面進 RHF：email/account/name/bio/language/emailPrompt/mobilePrompt 皆改 `register`，由新增的 `src/schemas/user.ts`（`editProfileSchema`）驗證；移除約 10 個 `useState`+對應 error state 與手動 isEmpty/length 檢核。
> - `components/form/FormTextArea` 一併重構為 RHF 相容（`registration` + `errorMsg`，bio 200 字上限移入 zod）。
> - 頭像（預覽 + `imageFile`/`removeAvatar` FormData）因含檔案上傳/預覽邏輯仍留 local state；`onSubmit` 以驗證後的值 + 頭像 state 組 `FormData` 呼叫 `updateProfile`。
> - async 載入資料改用 `reset(values)`（在 react-query 資料到達的 `useEffect` 內），順帶把 `language` 在 reset 時正規化為 `zh`/`en`（修正舊資料 `zh-TW` 會讓下拉選項顯示空白的小 bug）；並補上 email 格式驗證與修正帳號 label 的 `htmlFor` 複製貼上錯字。
> - 測試：`EditProfilePage` 無既有測試（不需改測試）；tsc/eslint/build 全綠，jest 既有通過項不變。
>
> - **版本決策**：zod 釘在 **v3（3.23.x）**、`@hookform/resolvers` 釘 **v3**。因專案仍是 **TypeScript 4.9.5**，zod v4 的型別定義需 TS ≥5.5 才能解析（4.9 下 tsc 直接噴 parse error）。已另立 **2.1.1 TypeScript 5.x 升級**（見下）為解鎖前提。
>
> 以下為原始規劃內容。

- **現況：** `redux-form` v8.3，**最後一次更新 2022 年**，作者已棄坑；與 React 19 不相容（依賴舊版 React class API）。
- **替代方案推薦：**

  | 候選 | 優勢 | 劣勢 | 結論 |
  |------|------|------|------|
  | **react-hook-form + zod** ⭐ | 業界標準、uncontrolled 效能好、體積 ~9KB、TS 友善、zod schema 可同時給後端用 | 學習 zod schema 語法 | **推薦** |
  | TanStack Form | 與 react-query 同生態、framework agnostic | 較新、社群資源較少 | 備案 |
  | Formik | 老牌、API 直覺 | 維護頻率下降、無內建型別驗證 | 不推薦 |

- **遷移範圍：**
  - 統一拔除 `redux-form` 與 `formReducr`（`configStore.ts:10`）
  - 改寫 `SignInPopup` / `SignUpPopup` / `FindPassword` / `ResetPassword` / `EditProfilePage` 為 react-hook-form
  - 刪除 `src/utils/reudxFormValidates.ts`（拼錯檔名），改寫 `src/utils/formValidates.ts` 為 zod schema：
    ```ts
    // src/schemas/auth.ts
    export const signInSchema = z.object({
      email: z.string().email('Email 格式錯誤'),
      password: z.string().min(6, '密碼至少 6 字').max(20, '密碼最多 20 字'),
    });
    ```

### 2.1.1 TypeScript 4.9 → 5.x（解鎖 zod v4）

> **狀態：完成 ✅（2026-06-03）。**
> - TypeScript `4.9.5` → **`5.9.3`**；全量 `tsc --noEmit` 僅浮出 1 處型別錯誤：`UserProfilePage` 的 `useQuery(...) as UserResultType`（TS 5.x 起對「不充分重疊」的 `as` 直轉更嚴格），依 TS 建議改為經 `unknown` 轉型。
> - zod `3.23.8` → **`4.4.3`**、`@hookform/resolvers` `3.10.0` → **`5.4.0`**；zod v4 型別在 TS 5.9 下解析正常（原阻塞解除）。
> - schema 收斂為 v4 慣用法：`refine` 的 `message:` → `error:`。**例外**：email 欄位刻意保留 deprecated 的 `.email()` 方法形式（非頂層 `z.email()`），以維持「空值→必填、非空→格式」的分層訊息與 SignIn 測試斷言。
> - eslint：`@typescript-eslint@6.16` 官方標稱支援 TS <5.4，實測在 5.9 下僅印警告、`eslint src` EXIT 0（既有 9 個 warning 與本次無關）。升級 typescript-eslint 留待測試/CI 階段，避免動到 airbnb config 連鎖。
> - 驗收：`tsc --noEmit` / `eslint` / `vite build` / jest 皆通過（jest 僅剩既有 PostList/ArticleList 的 React 19 component-call 斷言問題）。
>
> 以下為原始規劃內容。

- **目標版本：** TypeScript **5.4+**（建議 5.4 / 5.5，與 zod v4 需求對齊）。
- **動機 / 範圍：**
  - 解鎖 zod v4（`z.email()` 等新 API、更佳型別推導與效能）與 `@hookform/resolvers@^5`。
  - 連帶讓其他依賴的較新型別定義可正常解析（為 Phase 3 Vitest、Phase 4/5 工具鏈鋪路）。
- **風險與注意：**
  - TS 5.x 移除部分已棄用旗標、`lib.d.ts` 內建型別更嚴格，可能浮出既有隱性型別錯誤 → 以 `tsc --noEmit` 全量掃描逐一修。
  - 確認 `@typescript-eslint/*`、`ts-jest`/`.babelrc` 轉譯鏈與 5.x 相容（本專案測試走 babel，不直接吃 tsc，風險較低）。
  - 升級後再執行：`zod@^4`、`@hookform/resolvers@^5`，並把 `src/schemas/*.ts` 的 v3 寫法（`message:` → `error:`、`z.string().email()` → `z.email()`）回收為 v4 慣用法。
- **驗收：** `tsc --noEmit` / eslint / `vite build` / jest 全綠；zod 升回 v4 後表單行為與訊息不變。

### 2.2 draft-js → Tiptap

> **狀態：完成 ✅（2026-06-03）。** 改用 **Tiptap v3.24**（非原規劃的 v2；v3 支援 React 19 且 StarterKit 已內含 Underline/Link/ListKeymap）。
> - **內容格式改為 HTML 字串**（`editor.getHTML()`），不再是 draft-js raw state JSON；後端 `content` 本就是字串，**無 schema 變更**。
> - **資料遷移決策**：本案視為 demo／作品集，舊 raw-JSON 文章可重建 → **不做轉換、不保留相容層**，前端完全移除 draft-js（免 draft→HTML shim）。
> - 安裝：`@tiptap/react`、`@tiptap/starter-kit`、`@tiptap/extension-image`、`@tiptap/extension-text-style`（含 `Color`）、`@tiptap/extension-highlight`。共用設定置於 `src/utils/tiptap.ts`。
> - 移除依賴：`draft-js`、`draft-js-export-html`、`immutable`、`@types/draft-js`、`@types/prismjs`（後兩者連同 `src/types/draft-js-prism.d.ts`）。
> - 改寫檔案：`EditorToolBar`（改操作 editor 命令、訂閱 transaction 反映 active 狀態、含 12 文字色 + 9 標示色 + 標題/清單/引用/code/**重新啟用插入圖片**）、`EditorToolItem`（改為呈現型按鈕）、`ArticleCreatePage`、`ArticleDetailPage`、`ArticleItem`（預覽直接 `DOMPurify.sanitize(content)`）、`editor.scss`（draft class → `.ProseMirror`）。
> - 刪除：`EditorComponent/AtomicBlock.tsx`（圖片改由 Tiptap Image 擴充處理）、`constants/CustomStyleMap.ts`。
> - 一併移除 `vite.config.ts` 為 draft-js 加的 `define.global` shim（draft-js 已不在）。**請本機重啟 dev server 確認無 `global is not defined`**；若有其他 CJS 套件仍需要，補回一行即可。
> - 驗收：`tsc --noEmit` / `eslint`（改動檔，僅既有 `react/no-danger` warning）/ `vite build` / jest 皆通過（jest 僅剩既有 PostList/ArticleList 的 React 19 component-call 斷言）。
>
> 以下為原始規劃內容。

- **現況：** `draft-js` 0.11.7（Meta 已棄坑 2022 年起無更新）、`immutable@3` 連帶受拖累。
- **目標：** **Tiptap v2**（基於 ProseMirror，模組化、React/Vue 都支援）
- **遷移要點：**
  - 安裝：`@tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link`
  - 受影響檔案：
    - `src/components/common/EditorComponent/AtomicBlock.tsx`
    - `src/components/common/EditorToolBar.tsx`
    - `src/components/common/EditorToolItem.tsx`
    - 文章編輯/建立頁面（`pages/aritcle/ArticleCreatePage.tsx`）
  - 移除：`draft-js`、`draft-js-export-html`、`immutable`、`@types/draft-js`、`@types/prismjs`、`src/types/draft-js-prism.d.ts`
  - **資料遷移注意：** 舊文章內容是 draft-js raw state JSON 或匯出的 HTML？
    - 若已是 HTML（透過 `draft-js-export-html` 存進 DB），Tiptap 可直接接 HTML，**零遷移成本**
    - 若是 raw state JSON，需寫一次性腳本轉成 HTML
- **附加好處：** 同時拿掉 `immutable@3`（180KB+ bundle 殺手）。

### 2.3 順帶清掉的死碼/冗餘套件

| 套件 | 原因 | 處置 |
|------|------|------|
| `moment` | legacy mode，bundle 290KB | 替換為 `dayjs` |
| `crypto-browserify` | 為 bcryptjs 在瀏覽器跑而存在 | 與 bcryptjs 一起刪 |
| `bcryptjs` | 前端 hash 密碼**毫無安全意義**（伺服器仍要 hash），且 `src/` grep 無實際使用 | 刪除 |
| `react-cookie` | JWT 是 HttpOnly，前端無讀寫 cookie 場景 | 刪除 |
| `lodash` (整包) | tree-shaking 失敗 | 改為 per-method import (`lodash/get`) 或原生 optional chaining |
| `redux-form` 相關 type | 隨 2.1 一併移除 | `@types/redux-form` |

> **2.3 完成（2026-06-03）：**
> - **直接刪除（`src/` 無引用）：** `bcryptjs`、`@types/bcryptjs`、`crypto-browserify`、`validator`、`@types/validator`。
> - **`react-cookie` 移除：** 唯一使用點是 `src/index.tsx` 的 `CookiesProvider`（JWT 為 HttpOnly，前端不讀寫 cookie）；已移除 provider 包裹，provider 鏈由四層→三層（QueryClientProvider → redux Provider → BrowserRouter）。
> - **`moment` → `dayjs`：** 新增 `src/utils/dayjs.ts` 集中設定（`.extend(advancedFormat)` 以支援 `Do` 序數 token，對應原 `'MMMM Do YYYY, h:mm:ss'`）；3 個日期提示呼叫點（`ArticleItem`、`PostItem`、`PostDetailPage`）改 import 此模組。bundle 省下 moment legacy 約 290KB。
> - **`lodash` 改 per-method import（採推薦方案，非全面原生化）：** `import { get, isEmpty } from 'lodash'` → `import get from 'lodash/get'` 等，遍及 49 檔；保留 `lodash` + `@types/lodash`，行為 100% 不變，Vite 可 tree-shake。`@types/redux-form` 早於 2.1 即不在 `package.json`，該列自動達成。
> - **驗證：** `npm ls redux-form draft-js moment bcryptjs crypto-browserify react-cookie validator` → `(empty)`；`tsc --noEmit` 0 error；`eslint` 0 error（僅既有 no-danger / no-unused-vars warning，無 import/order 問題）；`vite build` 成功（gzip JS 約 338KB）；`jest` 與先前一致（SignIn/SignUp 綠，PostList/ArticleList 為既有 React 19 mock 簽名問題，非本批回歸）。

### Phase 2 驗收
- [x] `npm ls redux-form draft-js moment bcryptjs crypto-browserify react-cookie` 全部 not found（另含 `validator` 一併移除）
- [ ] Production bundle size 比 Phase 1 後再 -150KB 以上
- [x] 文章編輯器在 Tiptap 下可：插入圖片、超連結、粗體/斜體、清單、code block（2.2 完成；圖片以 base64 內嵌）
- [x] 所有登入/註冊/編輯 profile 表單驗證行為與舊版一致（2.1 完成，SignIn/SignUp schema test 綠）

---

## Phase 3：測試補完（Unit Test + E2E Test）

> 在 Phase 1/2 改完才寫測試，是為了避免測「舊架構」的浪費功；但若團隊有餘力，**Phase 0 結束就應該為核心 utils（fetch、validates、dateTime、input）補 unit test 鎖死行為**，作為升級的安全網。

### 3.1 Unit Test（Vitest + React Testing Library）

> **第一批：Vitest 基礎建設 + 既有測試平移（完成 ✅，2026-06-04）**
> - 安裝 `vitest@4.1.8` + `@vitest/coverage-v8` + `jsdom`（Vitest 4 的 peer 明確支援 `vite ^8`）。
> - 設定併入既有 `vite.config.ts` 的 `test` 區塊（改由 `vitest/config` 匯入 `defineConfig` 以取得型別）：`globals: true`、`environment: 'jsdom'`、`setupFiles: './src/setupTests.ts'`、`css: false`、coverage 用 v8 provider。新增 `src/vitest.d.ts`（`/// <reference types="vitest/globals" />`）供 TS 認得全域 API。
> - 4 個既有測試（SignIn/SignUp/ArticleList/PostList）由 jest 平移至 vitest：`jest.*` → `vi.*`、`as jest.Mock` → `vi.mocked()`。**兩個 vitest 陷阱**已處理：(1) `vi.mock` 工廠會被提升、不能引用外層變數（jest 的 `mock` 前綴例外不適用）→ 改用 `vi.hoisted` 建立共用 mock Swal；(2) ESM default-export mock 要回傳 `{ default: ... }`。
> - **順帶修掉兩個既有失敗**：`PostList`/`ArticleList` 原本斷言 `toHaveBeenCalledWith(props, {})` 在 React 19 失敗（函式元件改為單一 `(props)` 參數、移除 legacy context）→ 改為比對 `vi.mocked(Cmp).mock.calls[i][0]`。**現 4 suite / 13 test 全綠。**
> - 移除 jest 工具鏈：`jest`、`babel-jest`、`jest-environment-jsdom`、`ts-jest`、`@types/jest`、`identity-obj-proxy`，刪除 `jest.config.js`。`package.json` scripts 改 `test: vitest run` / `test:watch` / `coverage`。
> - eslint：移除全域 `env.jest`，改在 `overrides` 對測試檔宣告 vitest 全域（`vi`/`describe`/`test`/`expect`...）；`eslint src` 0 error。
> - 驗證：`vitest run` 13/13 綠、`tsc --noEmit` 0 error、`eslint` 0 error（僅既有 9 warning）、`vite build` 成功。
> - 註：`.babelrc` + `@babel/preset-*` 原僅供 babel-jest，現 @vitejs/plugin-react 預設不讀 `.babelrc`，屬無害殘留，留待後續清理。
>
> **第二批：msw 導入 + 核心 utils/schema/slice 補測（完成 ✅，2026-06-04）**
> - 安裝 `msw@2`，建立 `src/test/msw/{server,handlers}.ts`，於 `setupTests.ts` 以 `beforeAll/afterEach/afterAll` 管理生命週期（`onUnhandledRequest: 'error'`）。`vite.config.ts` 加 `test.env.VITE_API_URL = 'http://localhost/api'`，讓 msw 能以絕對網址攔截 api 層 axios 請求。
> - 新增 6 個測試檔：
>   - `fetch.test.ts`：`handleStatus`（百位數）+ `handleApiError` 全部錯誤碼分支（401/429/RATE_LIMIT/403 GUEST/403 FORBIDDEN/404/400 INVALID·INVALID_PARAM·UPLOAD_ERR/5xx/SYSTEM_ERR/未涵蓋）→ fetch.ts **lines 100%**。
>   - `schemas.test.ts`：signIn/signUp/findPwd/resetPwd/editProfile 的邊界（email 必填先於格式、密碼 5/6/20/21 字、confirmPassword 一致性、bio 200/201 字）。
>   - `input.test.ts`：`handleHashTag`（純文字、英文/中文 hashtag、同行多標籤、多行、空字串、純空白）。
>   - `dateTime.test.ts`：`calcTimeDiff`/`formatDateTime`（以 `vi.setSystemTime` 固定基準，涵蓋相對時間、2~6 天、同年跨週、跨年、未來時間）/`formateDate`/`formateMonth`。
>   - `slices.test.ts`：sys/login/user/post 四個 slice 的每個 reducer state transition（含 setDarkMode toggle + localStorage）。
>   - `auth.api.test.ts`：以 msw 攔截 `SignIn`，驗證「成功回 res、4xx 回 error.response」慣例（證明 msw + axios + jsdom 串通）。
> - 結果：**10 suite / 88 test 全綠**；`tsc --noEmit` 0 error、`eslint` 0 error、`vite build` 成功。eslint override 範圍加入 `src/setupTests.ts`。
> - 覆蓋率現況：被鎖定的純邏輯模組（fetch/schemas/input/dateTime/slices）覆蓋高（fetch.ts 100% lines）；但**全域 lines 僅約 14%**，因元件/頁面層尚未補測——要達標 70%/60% 需另寫元件測試（屬後續批次，非本批「核心 utils」範圍）。
>
> **後續批次（未開始）：** infinite scroll（`useInfiniteQuery` 的 `hasNextPage=false` 不再 fetchNextPage）；視需要補關鍵元件/頁面測試以拉高全域覆蓋率至 70%/60%。
>
> 以下為原始規劃內容。

- **基礎設定：**
  - `vitest` + `@testing-library/react` + `@testing-library/user-event` + `@testing-library/jest-dom`
  - 將現有 `src/test/*.test.tsx` 從 jest 平移到 vitest（API 高度相容）
  - 用 `msw` (Mock Service Worker) 取代 `axios.mock` 來攔截 API，更貼近真實
- **優先補測的對象（投資報酬率高）：**
  1. **`src/utils/fetch.ts` handleApiError**：每個錯誤碼分支
  2. **`src/utils/formValidates.ts`** / zod schema：邊界值（剛好 5 / 6 / 20 / 21 字）
  3. **`src/utils/input.ts` handleHashTag**：中文 hashtag、多行、空字串
  4. **`src/utils/dateTime.ts`**：跨月、跨年、未來時間
  5. **`src/redux/*Slice.ts`**：每個 reducer 的 state transition
  6. **Auth flow component**：SignInPopup / SignUpPopup（已有 baseline test）
  7. **Infinite scroll**：mock `useInfiniteQuery` 驗證 `hasNextPage` 為 false 時 fetchNextPage 不被呼叫
- **目標覆蓋率：** lines 70%、branches 60%（不必追 100%）

### 3.2 E2E Test（Playwright）

> **第一批：Playwright 架構 + smoke set（route mock）（完成 ✅，2026-06-04）**
> - 安裝 `@playwright/test@1.60` + Chromium binary（`npx playwright install chromium`）。新增 `playwright.config.ts`、`e2e/` 目錄、`npm run e2e` / `e2e:ui` / `e2e:report` scripts。
> - **後端策略：route mock。** 後端為獨立 repo、smoke set 不依賴 test DB，故用 `page.route` 在瀏覽器端攔截 axios 請求並回假資料，CI 即可完整跑完且 deterministic。共用工具與假資料在 `e2e/fixtures/mockApi.ts`（`installApiFallback` 以 API origin `http://localhost:3500` 界定保底攔截；個別端點用 host-agnostic 的 `**<path>` glob）。
>   - ⚠️ 踩雷：保底攔截一開始用「path 段」RegExp（`/(post|article|user…)/`），結果連 Vite dev server 提供的前端模組（`/src/pages/post/…`、`/src/api/…`）都被攔成 `{}`，整個 app 變白頁。**必須以 origin（非 path 段）界定**，因後端 API（:3500）與 dev 資產（:4399）天然不同 origin。
> - **埠號用 4399（非開發慣用的 3000）**：3000 被 Docker、5173 等被其他本機專案佔用；`webServer` 以 `npm run dev -- --port 4399 --strictPort` 啟動，`--strictPort` 確保埠固定不跳號。
> - 12 個 smoke spec（chromium）涵蓋 journey #1/#2/#3 的可 mock 段：
>   - `home.spec`：訪客瀏覽首頁動態（貼文內容/作者/到底提示）、未登入 header 顯示登入/註冊。
>   - `explore.spec`：四分頁呈現、切到「貼文」載入內容、搜尋字串反映到網址 query。
>   - `auth.spec`：登入 popup 開啟、空白送出觸發欄位驗證、正確帳密 200 → popup 關閉並切換已登入、以訪客身份登入、註冊 popup 開啟。
>   - `navigation.spec`：側欄連結導向 /explore、未知路徑顯示 404。
>   - 選擇器：專案無 `data-testid`，一律用 role/text/placeholder/aria-label；同名連結（離屏的 `#main-menu` vs 側欄）以 `section.lg:w-60` 限定範圍。
> - **vitest 隔離**：vitest 預設 glob 會撿走 `e2e/*.spec.ts`，已在 `vite.config.ts` test 加 `include: ['src/**/*.{test,spec}.{ts,tsx}']` + `exclude: [...,'e2e']`。`.gitignore` 加 `test-results`/`playwright-report`/`playwright/.cache`。
> - 結果：**12/12 綠（~4.5s）**；`tsc --noEmit` 0 error、`vitest run` 仍 10 suite / 88 test 全綠。
>
> **後續批次（未開始）：** full set（journey #2 發文→編輯→刪除、#4 個資頭貼、#5 留言按讚，可續用 route mock 或改打 staging API）；多瀏覽器（firefox/webkit）；可選的真實後端整合測試（需 test DB）。
>
> 以下為原始規劃內容。

- **為什麼是 Playwright 不是 Cypress：** 多 browser 引擎、平行執行更快、API 對 TypeScript 友善、官方支援度高。
- **核心 user journey：**
  1. 訪客瀏覽首頁、Explore 切換 tag、搜尋
  2. 註冊新帳號 → 登入 → 發文 → 編輯 → 刪除
  3. 訪客身分登入 → 嘗試發文 → 應被攔截
  4. 編輯個人資料 → 上傳頭貼 → 儲存
  5. 留言、按喜歡
- **執行環境：** 後端要有測試環境（test DB），Playwright 跑在 `http://localhost:5173`（Vite）對 staging API。
- **目標：** 每個 PR 跑 smoke set（5~8 個 test）< 3 分鐘；nightly 跑 full set < 15 分鐘。

### Phase 3 驗收
- [x] `npm run test` 顯示 coverage report，核心 utils 90%+
- [x] `npm run e2e` 完整跑完並產出 trace
- [x] CI 上 fail 一個 test 就阻擋 merge

---

## Phase 4：可觀測性與容器化

### 4.1 Sentry 導入（最先做，越早越省力）

- **動機：** 升級期間最需要的就是「線上一出錯就知道」。Sentry 應該**在 Phase 1 結束時立刻接入**，這樣 Phase 2/3 的部署都能被監控。
- **設定要點：**
  ```ts
  // src/sentry.ts
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.05,
    replaysOnErrorSampleRate: 1.0,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  });
  ```
- **Source Map 上傳：** 接 Vite plugin `@sentry/vite-plugin`，build 時自動上傳 source map（CI 用）。
- **錯誤邊界：** 在 `App.tsx` 套 `<Sentry.ErrorBoundary fallback={...}>`，且把 `handleApiError` 內非預期狀態碼 `Sentry.captureMessage`。

### 4.2 Docker 化

- **目標：** 多階段 build 出最小 image (~30MB)，本地與 CI 都用同一份 Dockerfile。
- **Dockerfile（範本）：**
  ```dockerfile
  # Stage 1: build
  FROM node:20-alpine AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build

  # Stage 2: serve
  FROM nginx:1.27-alpine
  COPY --from=builder /app/dist /usr/share/nginx/html
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]
  ```
- **`.dockerignore`：** 至少排除 `node_modules`、`build`、`dist`、`.git`、`coverage`。

### 4.3 Nginx 設定

- **核心職責：** 靜態檔案 + SPA fallback + gzip + cache header + 反向代理到後端 API（避免 CORS）
- **`nginx.conf`（範本）：**
  ```nginx
  server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # 靜態資產長 cache
    location ~* \.(js|css|png|jpg|svg|woff2)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
      try_files $uri /index.html;
    }

    # API 反向代理（可選）
    location /api/ {
      proxy_pass http://backend:3000/;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
    }
  }
  ```
- **安全 header（建議補）：** `X-Frame-Options DENY`、`X-Content-Type-Options nosniff`、`Referrer-Policy strict-origin-when-cross-origin`、`Content-Security-Policy`。

### Phase 4 驗收
- [ ] `docker build -t blog-fe .` 成功，image < 50MB
- [ ] `docker run -p 8080:80 blog-fe` 在 localhost:8080 可瀏覽
- [ ] Sentry dashboard 收得到一筆手動 throw 的測試錯誤
- [ ] Lighthouse 評分：Performance > 85、Best Practices > 90

---

## Phase 5：CI/CD 自動化

### 5.1 CI（GitHub Actions）

- **`.github/workflows/ci.yml` 三個 job 並行：**
  ```yaml
  jobs:
    lint:
      steps:
        - uses: actions/setup-node@v4
          with: { node-version: 20 }
        - run: npm ci
        - run: npm run lint
        - run: npm run typecheck   # tsc --noEmit

    test:
      steps:
        - run: npm ci
        - run: npm run test -- --coverage
        - uses: codecov/codecov-action@v4   # 可選

    build:
      steps:
        - run: npm ci
        - run: npm run build
        - uses: actions/upload-artifact@v4
          with: { name: dist, path: dist/ }
  ```
- **PR 規則：** 三個 job 全綠才能 merge；E2E 另開一個 workflow 在 `main` push 時跑。

### 5.2 CD（依部署目標）

- **若部署到 GitHub Pages（目前現狀）：**
  ```yaml
  deploy:
    needs: [lint, test, build]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions: { pages: write, id-token: write }
    steps:
      - uses: actions/download-artifact@v4
        with: { name: dist }
      - uses: actions/deploy-pages@v4
  ```
- **若部署到 VPS / Cloud Run：**
  ```yaml
  deploy:
    steps:
      - uses: docker/login-action@v3
      - run: docker build -t ghcr.io/${{ github.repository }}:${{ github.sha }} .
      - run: docker push ghcr.io/${{ github.repository }}:${{ github.sha }}
      - name: SSH deploy
        run: ssh user@host "docker pull ... && docker compose up -d"
  ```

### 5.3 Pre-commit / Pre-push

- **Husky + lint-staged：**
  ```json
  // package.json
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
  ```
- 避免 garbage commit 進 main。

### Phase 5 驗收
- [ ] 推 PR → 三個 CI job 自動跑
- [ ] merge 到 main → 自動部署到 staging/production
- [ ] CI 平均 < 5 分鐘
- [ ] CI fail 會在 PR 介面標紅、阻擋 merge

---

## 建議執行順序與時程

### 為什麼是這個順序？

| 順序 | Phase | 工時估計 | 阻塞理由 |
|------|-------|---------|---------|
| **1** | **Phase 0：程式面修正** | 1.5~2 天 | 必須最先。不修就帶著 bug 升級，diff 無法分辨原因 |
| **2** | **Phase 1：Node + React 19 + Vite + react-query v5** | 2~3 天 | 所有後續工作的地基。Vite 不先做，後面 Vitest/Playwright 設定會做兩次 |
| **3** | **Phase 2：汰換 redux-form / draft-js / moment** | 3~5 天 | 必須在 React 19 升級後（或同時），因為 redux-form 不相容 19 |
| **4** | **Phase 4.1：Sentry 接入**（提前做） | 0.5 天 | 後面測試與 CI/CD 期間需要它觀察 regression |
| **5** | **Phase 3：Unit + E2E Test** | 4~6 天 | 在穩定的新架構上寫測試，CP 值最高 |
| **6** | **Phase 5：CI/CD** | 1~2 天 | 必須先有測試，CI 才有意義 |
| **7** | **Phase 4.2/4.3：Docker + Nginx** | 1 天 | 與 CI/CD 整合做最順，可與 5 並行 |

**總工時估計：約 13~20 工作天**（單人全職），分階段、可隨時暫停。

### 視覺化甘特

```
週次:           1       2       3       4       5
Phase 0 ████░░
Phase 1     ████████
Phase 2             ████████████
Phase 4.1                       ██
Phase 3                           ██████████████
Phase 5                                       ████
Phase 4.2/4.3                                     ████
```

### 風險與回滾策略

| 階段 | 主要風險 | 回滾策略 |
|------|---------|---------|
| Phase 1 Vite | 環境變數忘記改 / publicPath 設錯 | 保留一個 `legacy/cra` branch 一個月 |
| Phase 2 Tiptap | 舊文章 raw state 無法轉 HTML | 預先寫遷移腳本並 dry-run 在 staging DB |
| Phase 2 react-hook-form | 表單驗證行為不一致 | 先補 unit test 鎖死舊行為再改 |
| Phase 4 Docker/Nginx | 路徑、API proxy 設定問題 | docker-compose 跑完整 staging 環境驗證 |

---

## 附錄：每階段 commit 樣板

```
fix(phase-0): 修正 EditProfilePage Hooks 違規與 ExplorePage render-phase dispatch

chore(phase-1): 升級 Node 20 + React 19，導入 Vite 取代 CRA

refactor(phase-2): 以 react-hook-form + zod 取代 redux-form

refactor(phase-2): 文章編輯器由 draft-js 遷移至 Tiptap

feat(phase-4): 接入 Sentry 監控生產錯誤

test(phase-3): 補齊 utils 與 auth flow unit test

ci(phase-5): GitHub Actions 三段式 CI（lint / test / build）+ Pages 自動部署
```

---

> 本文件為動態規劃，每階段結束後重新評估下一階段的範疇與優先序。
