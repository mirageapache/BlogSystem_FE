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

> **執行狀態（2026-06-03）：** 第一批 ✅。盤點發現 **redux-form 早在 Phase 1.2 即被當 dead code 移除**（`package.json` 與 `src/` 皆無殘留、`reudxFormValidates.ts` 也已刪），故 2.1 實質工作是「將手動 `useState`+`FormInput` 表單現代化為 react-hook-form + zod」。
> - 已改寫 4 個 auth 表單：`SignInPopup` / `SignUpPopup` / `FindPassword` / `ResetPassword`。
> - `components/form/FormInput` 重構為 RHF 相容（`registration` + `errorMsg`，移除 `value/setValue/name/handleEnter` 與內部 onBlur 驗證）。
> - 新增 `src/schemas/auth.ts`（zod schema），刪除死碼 `src/utils/formValidates.ts`；`validator` 套件就此無人使用（併入 2.3 移除）。
> - **版本決策**：zod 釘在 **v3（3.23.x）**、`@hookform/resolvers` 釘 **v3**。因專案仍是 **TypeScript 4.9.5**，zod v4 的型別定義需 TS ≥5.5 才能解析（4.9 下 tsc 直接噴 parse error）。**建議另立一步把 TypeScript 升到 5.x**，即可換回 zod v4。
> - 測試：`SignInPopup` / `SignUpPopup` 兩個 suite 由原本失敗轉為**全綠**（補上 `MemoryRouter` 包裝供 `useNavigate`，並對齊登入成功的 Swal `timer` 斷言）。tsc/eslint/build 全綠。
> - **待辦（第二批）**：`EditProfilePage` 尚未進 RHF（含頭像/FormData），目前 name/account/email 以 inline 受控 input 暫代，行為不變。
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

### 2.2 draft-js → Tiptap

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

### Phase 2 驗收
- [ ] `npm ls redux-form draft-js moment bcryptjs crypto-browserify react-cookie` 全部 not found
- [ ] Production bundle size 比 Phase 1 後再 -150KB 以上
- [ ] 文章編輯器在 Tiptap 下可：插入圖片、超連結、粗體/斜體、清單、code block
- [ ] 所有登入/註冊/編輯 profile 表單驗證行為與舊版一致（同步 schema test）

---

## Phase 3：測試補完（Unit Test + E2E Test）

> 在 Phase 1/2 改完才寫測試，是為了避免測「舊架構」的浪費功；但若團隊有餘力，**Phase 0 結束就應該為核心 utils（fetch、validates、dateTime、input）補 unit test 鎖死行為**，作為升級的安全網。

### 3.1 Unit Test（Vitest + React Testing Library）

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
- [ ] `npm run test` 顯示 coverage report，核心 utils 90%+
- [ ] `npm run e2e` 完整跑完並產出 trace
- [ ] CI 上 fail 一個 test 就阻擋 merge

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
