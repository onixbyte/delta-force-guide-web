import { ComponentType } from "react"
import { createBrowserRouter } from "react-router-dom"
import ErrorPage from "@/components/error-page"
import EmptyLayout from "@/layout/empty-layout"
import HeroLayout from "@/layout/hero-layout"

function lazy<T extends { default: ComponentType<unknown> }>(importer: () => Promise<T>) {
  return async () => {
    const module = await importer()
    return {
      Component: module.default,
    }
  }
}

const hydrateFallbackElement = <div className="px-4 py-6 text-gray-500">页面加载中...</div>

/**
 * Main application router configuration using React Router v6.
 * Defines all routes and their corresponding components.
 */
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <HeroLayout />,
      hydrateFallbackElement,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          lazy: lazy(() => import("@/page/firearms")),

        },
        {
          path: "firearms",
          lazy: lazy(() => import("@/page/firearms")),
        },
        {
          path: "mod-codes",
          lazy: lazy(() => import("@/page/mod-codes")),
        },
        {
          path: "legal",
          lazy: lazy(() => import("@/page/legal"))
        }
      ],
    },
    {
      element: <EmptyLayout />,
      hydrateFallbackElement,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "login",
          lazy: lazy(() => import("@/page/login")),
        },
      ],
    },
  ],
  {
    basename: "/",
  }
)

export default router
