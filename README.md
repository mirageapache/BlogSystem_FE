# React Blog (frontend)

[Live Demo Website](https://blog-system-fe.vercel.app/)

概念源自 [Substack](https://substack.com/home)
以此為系統設計主軸做出一個"部落格系統"的 SideProject
使用者在不登入的狀態下即可瀏覽貼文及文章，也可以註冊登入發表貼文及文章
除了瀏覽外也可以對貼文及文章進行"按讚"、"留言"等功能

## 開始使用

1. Clone Repository

```
git clone https://github.com/mirageapache/BlogSystem_FE.git
```

2. 安裝套件

```
npm install
```

3. 設定環境變數

複製 `.env.example` 為 `.env.local` 並填入對應值：

```
VITE_API_URL=後端 API 網址
```

4. 啟動程式

```
npm run dev
```

5. 瀏覽網頁

```
瀏覽器將自動開啟網頁，如未正常開啟請輸入 http://localhost:3000/，即可使用
```

6. 終止程式

```
在終端機按下 ctrl + C 即可終止程式
```

## 常用指令

```bash
npm run dev          # 啟動開發伺服器 (http://localhost:3000)
npm run build        # 生產環境建置 (輸出至 dist/)
npm test             # 執行單元測試 (Vitest)
npm run test:watch   # 單元測試監聽模式
npm run e2e          # 執行 E2E 測試 (Playwright)
```

## 專案環境

- node - 24.x
- react - 19.x
- react-router-dom - 6.x
- typescript - 5.9.x
- vite - 8.x（建置工具）
- @tanstack/react-query - 5.x（伺服器狀態管理）
- react-hook-form - 7.x + zod - 4.x（表單驗證）
- @tiptap/react - 3.x（富文字編輯器）
- tailwindcss - 3.x + sass（樣式）
- vitest - 4.x（單元測試）
- @playwright/test - 1.x（E2E 測試）
