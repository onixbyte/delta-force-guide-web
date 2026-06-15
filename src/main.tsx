import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { App as AntApp, ConfigProvider as AntConfigProvider } from "antd"
import { StyleProvider as AntStyleProvider } from "@ant-design/cssinjs"
import AntSimplifiedChinese from "antd/locale/zh_CN"
import router from "@/router"
import store, { persistor } from "@/store"
import "./index.css"

/**
 * Main application entry point.
 * Sets up the React app with React Router.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AntStyleProvider layer>
          <AntConfigProvider
            locale={AntSimplifiedChinese}
            button={{
              autoInsertSpace: false,
            }}>
            <AntApp className="h-full w-full">
              <RouterProvider router={router} />
            </AntApp>
          </AntConfigProvider>
        </AntStyleProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
)
