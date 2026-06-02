/// <reference types="vite/client" />

// 擴充 Vite 內建的 ImportMetaEnv，補上專案自訂的環境變數型別。
// eslint-disable-next-line no-unused-vars
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
