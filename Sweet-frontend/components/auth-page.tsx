"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { api } from "@/lib/api"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (isLogin) {
        const res = await api.auth.login({ email, password })
        localStorage.setItem("token", res.token)
        localStorage.setItem("user", JSON.stringify(res.user))
      } else {
        if (!name.trim()) {
          setError("Name is required for sign up")
          return
        }
        const res = await api.auth.register({ name: name.trim(), email, password, role: "user" })
        localStorage.setItem("token", res.token)
        localStorage.setItem("user", JSON.stringify(res.user))
      }
      router.push("/showcase")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="font-display text-4xl font-bold text-gray-900">
              {isLogin ? "Welcome Back to Sweet Shop" : "Join the Sweet Community"}
            </h1>
            <p className="text-gray-600 font-sans">
              {isLogin ? "Let's get started with your 30 days trial" : "Create your account to explore our sweets"}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <Input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 px-4 text-base border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400"
                  required
                />
              </div>
            )}
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 px-4 text-base border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400"
                required
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 px-4 pr-12 text-base border-gray-200 rounded-xl focus:border-rose-400 focus:ring-rose-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-sm text-gray-500 hover:text-rose-600 font-sans">
                  Recovery Password
                </button>
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600" role="alert">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-rose-400 hover:bg-rose-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-rose-200 disabled:opacity-50"
            >
              {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-gray-500 font-sans mb-6">Or continue with</p>
            <div className="flex justify-center space-x-4">
              <button className="w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:shadow-md transition-shadow">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </button>
              <button className="w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:shadow-md transition-shadow">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#000"
                    d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"
                  />
                </svg>
              </button>
              <button className="w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:shadow-md transition-shadow">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#1877F2"
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 font-sans">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-rose-600 hover:text-rose-700 font-semibold">
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Sweet Shop Illustration */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-orange-200 via-rose-200 to-amber-100">
        <SweetShopIllustration />
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="font-display text-2xl font-bold mb-2">Finally, You Are Here!</h2>
          <div className="flex space-x-2">
            <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SweetShopIllustration() {
  return (
    <svg
      className="absolute inset-0 w-full h-full object-cover"
      viewBox="0 0 400 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Gradient */}
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="50%" stopColor="#FECACA" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
        <radialGradient id="sun-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
      </defs>

      <rect width="400" height="600" fill="url(#bg-gradient)" />

      {/* Sun */}
      <circle cx="320" cy="80" r="40" fill="url(#sun-gradient)" opacity="0.8" />

      {/* Sweet Shop Display Counter */}
      <rect x="50" y="400" width="300" height="120" rx="15" fill="#8B4513" />
      <rect x="60" y="390" width="280" height="20" rx="10" fill="#A0522D" />

      {/* Glass Display Cases */}
      <rect x="70" y="350" width="80" height="60" rx="8" fill="#E5E7EB" opacity="0.3" />
      <rect x="170" y="350" width="80" height="60" rx="8" fill="#E5E7EB" opacity="0.3" />
      <rect x="270" y="350" width="80" height="60" rx="8" fill="#E5E7EB" opacity="0.3" />

      {/* Laddus */}
      <circle cx="90" cy="370" r="8" fill="#F59E0B" />
      <circle cx="110" cy="375" r="8" fill="#F59E0B" />
      <circle cx="130" cy="370" r="8" fill="#F59E0B" />

      {/* Jalebi Swirls */}
      <path
        d="M180 365 Q190 355 200 365 Q210 375 220 365 Q230 355 240 365"
        stroke="#F97316"
        strokeWidth="4"
        fill="none"
      />
      <path
        d="M185 375 Q195 365 205 375 Q215 385 225 375 Q235 365 245 375"
        stroke="#F97316"
        strokeWidth="4"
        fill="none"
      />

      {/* Mithai Squares */}
      <rect x="280" y="365" width="12" height="12" rx="2" fill="#EC4899" />
      <rect x="295" y="365" width="12" height="12" rx="2" fill="#10B981" />
      <rect x="310" y="365" width="12" height="12" rx="2" fill="#F59E0B" />
      <rect x="325" y="365" width="12" height="12" rx="2" fill="#8B5CF6" />

      {/* Decorative Elements */}
      <circle cx="100" cy="200" r="30" fill="#FECACA" opacity="0.6" />
      <circle cx="300" cy="250" r="25" fill="#FEF3C7" opacity="0.6" />
      <circle cx="150" cy="150" r="20" fill="#DBEAFE" opacity="0.6" />

      {/* Sweet Shop Sign */}
      <rect x="120" y="280" width="160" height="40" rx="20" fill="#8B4513" />
      <text x="200" y="305" textAnchor="middle" fill="#FEF3C7" fontSize="16" fontFamily="serif">
        Sweet Shop
      </text>

      {/* Decorative Swirls */}
      <path d="M80 120 Q100 100 120 120 Q140 140 160 120" stroke="#F97316" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M240 180 Q260 160 280 180 Q300 200 320 180" stroke="#EC4899" strokeWidth="2" fill="none" opacity="0.7" />
    </svg>
  )
}
