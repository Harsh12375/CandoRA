"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Users,
  Warehouse,
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: Warehouse, label: "Inventory", href: "/admin/inventory" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)

    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem("adminTheme")
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    const shouldUseDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark)

    setDarkMode(shouldUseDark)

    if (shouldUseDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Basic admin auth guard
    try {
      const token = localStorage.getItem("token")
      const userRaw = localStorage.getItem("user")
      const user = userRaw ? JSON.parse(userRaw) : null
      if (!token || !user || user.role !== "admin") {
        router.push("/admin")
      }
    } catch {
      router.push("/admin")
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/admin")
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)

    // Save preference to localStorage
    localStorage.setItem("adminTheme", newDarkMode ? "dark" : "light")

    // Apply theme to document
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const getCurrentPath = () => {
    if (typeof window !== "undefined") {
      return window.location.pathname
    }
    return ""
  }

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-orange-600 dark:text-orange-400">CandoRA Admin</h1>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = getCurrentPath() === item.href
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  className={`w-full justify-start transition-colors ${
                    isActive
                      ? "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400"
                  }`}
                  onClick={() => {
                    router.push(item.href)
                    setSidebarOpen(false)
                  }}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white dark:bg-gray-800 px-6 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <div className="relative w-4 h-4">
                <Sun
                  className={`h-4 w-4 absolute transition-all duration-300 ${darkMode ? "rotate-90 scale-0" : "rotate-0 scale-100"}`}
                />
                <Moon
                  className={`h-4 w-4 absolute transition-all duration-300 ${darkMode ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`}
                />
              </div>
            </Button>

            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                H
              </div>
              <span className="hidden sm:block">Admin</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
