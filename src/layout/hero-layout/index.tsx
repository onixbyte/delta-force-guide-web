import { Outlet, Link, NavLink, useNavigate } from "react-router-dom"
import { useEffect, useMemo } from "react"
import dayjs from "dayjs"
import { Dropdown } from "antd"
import {
  FileTextOutlined,
  GithubOutlined,
  LockOutlined,
  LoginOutlined,
} from "@ant-design/icons"
import { AuthApi } from "@/api"
import { useAppDispatch, useAppSelector } from "@/hooks/store"
import { clearCurrentUser } from "@/store/auth-slice"
import { useState } from "react"
import { clearAutoLogout, scheduleAutoLogout } from "@/utils/autoLogout";
import DisplayBoard from '@/components/DisplayBoard';
/**
 * Main application component that serves as the root layout.
 * Uses React Router's Outlet to render child routes.
 */



export default function HeroLayout() {




  const today = useMemo(() => dayjs(), [])
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // 统一登出函数：清除定时器、清除 Redux、跳转登录页
  const performLogout = () => {
    clearAutoLogout();
    dispatch(clearCurrentUser());
  };

  async function handleLogout() {
    try {
      await AuthApi.logout()
    } finally {
      dispatch(clearCurrentUser())
    }
  }

  useEffect(() => {
    if (user?.expiration) {
      const localDate = new Date(user.expiration.replace(' ', 'T'));
      const targetTimestamp = localDate.getTime();
      if (targetTimestamp > Date.now()) {
        console.log("未到自动登出时间");
        
        scheduleAutoLogout(targetTimestamp, performLogout);
      } else {
        // 已过期立即登出
        performLogout();
      }
    } else {
      clearAutoLogout();
    }
  }, [user]);
  return (
    <div className="bg-[#1b252a] flex flex-col min-h-screen">
      {/* Navigation Header */}
      <header className="bg-[#0b0f14] shadow-sm border-b">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 h-full">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">《三角洲》指南</h1>
            </div>
            <div>
              <DisplayBoard />
            </div>
            <nav className="flex h-full">
              <NavLink
                to="/firearms"
                className={({ isActive }) =>
                  `nav-item inline-flex items-center px-10 h-full text-base font-medium transition-all duration-200 ${isActive ? "active" : ""
                  } text-gray-500 hover:text-white`
                }>
                武器列表
              </NavLink>
              {/* <NavLink
                to="/mod-codes"
                className={({ isActive }) =>
                  `nav-item inline-flex items-center px-10 h-full text-base font-medium transition-all duration-200 ${
                    isActive ? "active" : ""
                  } text-gray-500 hover:text-white`
                }>
                改枪码
              </NavLink> */}
            </nav>
          </div>
        </div>

      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto py-6 sm:px-6 lg:px-10">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-10 text-sm">
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}>
              <button
                className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
                aria-label="GitHub 仓库">
                <GithubOutlined className="text-base opacity-80" />
                <span>GitHub</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-2/3 -translate-x-1/2 w-18 bg-gray-950 border border-gray-700 rounded-lg shadow-xl py-1 z-20 opacity-60">
                  <a
                    href="https://github.com/zihluwang/delta-force-guide-web"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                    Web
                  </a>
                  <a
                    href="https://github.com/zihluwang/delta-force-guide-server"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                    Server
                  </a>
                </div>
              )}
            </div>

            <span className="text-gray-700 select-none">•</span>
            <Link
              to="/legal?tab=eula"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors duration-200">
              <FileTextOutlined className="text-lg opacity-80" />
              EULA
            </Link>
            <span className="text-gray-700 select-none">•</span>
            <Link
              to="/legal?tab=privacy"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors duration-200">
              <LockOutlined className="text-lg opacity-80" />
              隐私政策
            </Link>
            <span className="text-gray-700 select-none">•</span>
            {user ? (
              <Dropdown
                trigger={["hover"]}
                menu={{
                  items: [
                    {
                      key: "logout",
                      label: "退出登录",
                      danger: true,
                      onClick: handleLogout,
                    },
                  ],
                }}>
                <span className="inline-flex items-center px-10 h-full text-base font-medium text-gray-500 hover:text-white cursor-pointer">
                  {user.username}
                </span>
              </Dropdown>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors duration-200">
                <LoginOutlined className="text-lg opacity-80" />
                登录
              </Link>
            )}
          </div>

          <div className="border-t border-gray-800 my-6" />
          <div className="text-center text-xs text-gray-500">
            <p>© 2024-{today.year()} OnixByte。湘ICP备2026000274号-1</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
