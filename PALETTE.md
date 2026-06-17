# 調色盤 — Editorial Magazine（ink + 暖橘）

設計系統色彩，定義於 [src/index.css](src/index.css)（CSS 變數），由 Tailwind 以語意 token 對應（[tailwind.config.js](tailwind.config.js)）。深色模式由 `.dark` 覆寫。

主視覺三色：暖橘 `#F97316` + 墨黑 `#1C1917` + 暖白 `#FAF8F4` —「暖白紙 + 墨字 + 橘色點綴」的雜誌感。

## 主色（品牌色）— 暖橘

| Token | 淺色 | 深色 | 用途 |
|---|---|---|---|
| `brand` | `#F97316` | `#FB923C` | 主色／重點 |
| `brand-strong` | `#EA580C` | `#FDBA74` | hover／按壓 |
| `brand-soft` | `#FFF1E6` | `#2A1D12` | 主色淡底 |

## 中性色 — ink（暖黑/灰）

| Token | 淺色 | 深色 | 用途 |
|---|---|---|---|
| `ink` | `#1C1917` | `#F5F1EA` | 主要文字 |
| `ink-soft` | `#57534E` | `#B8B0A6` | 次要文字 |
| `muted` | `#78716C` | `#8A8278` | 輔助／說明 |

## 底色與線條 — 暖白紙感

| Token | 淺色 | 深色 | 用途 |
|---|---|---|---|
| `paper` | `#FAF8F4` | `#14110F` | 頁面底 |
| `surface` | `#FFFFFF` | `#1C1815` | 卡片／浮起面 |
| `surface-2` | `#F4F1EB` | `#26211D` | 次級填色 |
| `line` | `#E7E2D9` | `#312B26` | 細線分隔 |
| `line-strong` | `#D6CFC4` | `#3D362F` | 較明顯邊框 |

## 字體

| 用途 | 字體 |
|---|---|
| 品牌字樣（wordmark） | Akaya Kanadaka |
| 標題（serif） | Libre Bodoni |
| 內文／介面（sans） | Public Sans |
| 程式碼（mono） | Source Code Pro |

## 陰影

暖調分層柔和陰影，基於 `rgb(28 25 23)`（非純黑）。icon 若需陰影建議跟著走暖色。
