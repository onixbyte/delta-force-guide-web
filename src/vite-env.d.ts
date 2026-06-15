/// <reference types="vite/client" />
interface ImportMetaEnv {
  /**
   * Redux persistent storage location, use `local` for local storage and `session` for
   * session storage
   */
  readonly VITE_REDUX_STORAGE: "local" | "session"

  /**
   * Backend API Base URL
   */
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}