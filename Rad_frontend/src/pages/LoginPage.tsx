import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginUser } from "../services/authService"
import toast from "react-hot-toast"
import axios from "axios"
import { useAuth } from "../context/useAuth"

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState({ email: false, password: false })
  const navigate = useNavigate()
  const { login: authenticate } = useAuth()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      try {
        const user = await loginUser(formData.email, formData.password)
        toast.success(`Welcome, ${user.name}!`)
        authenticate(user.accessToken)
        navigate("/dashboard")
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || error.message)
        } else {
          toast.error("Something went wrong")
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleFocus = (field: string) => {
    setIsInputFocused(prev => ({ ...prev, [field]: true }))
  }

  const handleBlur = (field: string) => {
    setIsInputFocused(prev => ({ ...prev, [field]: false }))
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Branding & Features */}
            <div className="text-white space-y-8">
              {/* Logo & Branding */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                      <div className="text-2xl">📚</div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                      LibraryHub Pro
                    </h1>
                    <p className="text-gray-400 text-sm">Advanced Library Management</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-5xl font-bold leading-tight">
                    <span className="block">Next Generation</span>
                    <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                      Library Platform
                    </span>
                  </h2>
                  <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                    Experience the future of library management with AI-powered cataloging, 
                    real-time analytics, and seamless member engagement.
                  </p>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">AI-Powered Search</h3>
                  <p className="text-gray-400 text-sm">Smart book recommendations and intelligent cataloging system</p>
                </div>
                
                <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
                  <p className="text-gray-400 text-sm">Advanced reporting and insights dashboard</p>
                </div>
                
                <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">☁️</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Cloud Sync</h3>
                  <p className="text-gray-400 text-sm">Access your library from anywhere, anytime</p>
                </div>
                
                <div className="group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🔔</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Smart Notifications</h3>
                  <p className="text-gray-400 text-sm">Automated reminders and updates</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">50K+</div>
                  <div className="text-sm text-gray-400">Books Managed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">2.5K+</div>
                  <div className="text-sm text-gray-400">Active Libraries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                {/* Form Container */}
                <div className="relative">
                  {/* Glassmorphism container */}
                  <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                    {/* Form Header */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full text-sm font-medium text-white/80 border border-white/10 mb-6">
                        🚀 Welcome Back
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Sign in to continue</h3>
                      <p className="text-gray-300">Access your library dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Email Field */}
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-white/90">
                          Email address
                        </label>
                        <div className="relative group">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => handleFocus('email')}
                            onBlur={() => handleBlur('email')}
                            placeholder="Enter your email"
                            className={`w-full px-4 py-4 bg-white/5 backdrop-blur-sm border-2 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 ${
                              errors.email 
                                ? "border-red-400/50 focus:border-red-400" 
                                : isInputFocused.email
                                ? "border-purple-400/50 focus:border-purple-400 bg-white/10"
                                : "border-white/10 hover:border-white/20"
                            }`}
                          />
                          <div className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-all duration-300 ${
                            isInputFocused.email ? 'text-purple-400' : 'text-gray-400'
                          }`}>
                            <span className="text-lg">📧</span>
                          </div>
                          {/* Focus ring effect */}
                          {isInputFocused.email && (
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 -z-10 blur-xl"></div>
                          )}
                        </div>
                        {errors.email && (
                          <p className="text-sm text-red-400 flex items-center gap-2">
                            <span>⚠️</span> {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Password Field */}
                      <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-white/90">
                          Password
                        </label>
                        <div className="relative group">
                          <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            onFocus={() => handleFocus('password')}
                            onBlur={() => handleBlur('password')}
                            placeholder="Enter your password"
                            className={`w-full px-4 py-4 bg-white/5 backdrop-blur-sm border-2 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 ${
                              errors.password 
                                ? "border-red-400/50 focus:border-red-400" 
                                : isInputFocused.password
                                ? "border-purple-400/50 focus:border-purple-400 bg-white/10"
                                : "border-white/10 hover:border-white/20"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-all duration-300 hover:scale-110 ${
                              isInputFocused.password ? 'text-purple-400' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            <span className="text-lg">{showPassword ? "🙈" : "👁️"}</span>
                          </button>
                          {/* Focus ring effect */}
                          {isInputFocused.password && (
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 -z-10 blur-xl"></div>
                          )}
                        </div>
                        {errors.password && (
                          <p className="text-sm text-red-400 flex items-center gap-2">
                            <span>⚠️</span> {errors.password}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-8 rounded-2xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 disabled:cursor-not-allowed overflow-hidden"
                      >
                        {/* Button gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        
                        <div className="relative flex items-center justify-center gap-3">
                          {isLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Signing in...</span>
                            </>
                          ) : (
                            <>
                              <span>🚀</span>
                              <span>Sign in</span>
                              <div className="group-hover:translate-x-1 transition-transform duration-200">→</div>
                            </>
                          )}
                        </div>
                      </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <div className="text-center">
                        <p className="text-sm text-gray-300">
                          Don't have an account?{" "}
                          <Link 
                            to="/signup" 
                            className="font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-cyan-300 transition-all duration-200"
                          >
                            Create Account →
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-60"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-60"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login