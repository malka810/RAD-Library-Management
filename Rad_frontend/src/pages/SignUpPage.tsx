import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signUp } from "../services/authService"
import toast from "react-hot-toast"
import axios from "axios"

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const Signup = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name) newErrors.name = "Name is required"
    else if (formData.name.length < 2) newErrors.name = "Name must be at least 2 characters"

    if (!formData.email) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email address"

    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 6) newErrors.password = "Minimum 6 characters"

    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      try {
        await signUp({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
        toast.success("Signup successful! Please login.")
        navigate("/login")
      } catch (error) {
        if (axios.isAxiosError(error)) toast.error(error.message)
        else toast.error("Something went wrong")
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-purple-800">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none focus:ring-purple-600 ${
                errors.name ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none focus:ring-purple-600 ${
                errors.email ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a strong password"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none focus:ring-purple-600 ${
                errors.password ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-type your password"
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none focus:ring-purple-600 ${
                errors.confirmPassword ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-md transition duration-200"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
