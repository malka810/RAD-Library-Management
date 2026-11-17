import React, { useEffect, useState } from "react"
import type { Reader } from "../../types/Reader"

interface ReaderFormProps {
    reader?: Reader | null
    onSubmit: (readerData: Omit<Reader, "_id">) => void
}

interface FormErrors {
    name?: string
    email?: string
    phone?: string
    address?: string
    password?: string
}

const ReaderForm = ({ reader, onSubmit }: ReaderFormProps) => {
    const [formData, setFormData] = useState<Omit<Reader, "_id">>({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: ""
    })

    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => {
        if (reader) {
            setFormData({
                name: reader.name,
                email: reader.email,
                phone: reader.phone,
                address: reader.address,
                password: "" // Do not prefill password
            })
        } else {
            setFormData({
                name: "",
                email: "",
                phone: "",
                address: "",
                password: ""
            })
        }
        setErrors({})
    }, [reader])

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format"
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone is required"
        } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
            newErrors.phone = "Enter a valid phone number"
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required"
        } else if (formData.address.length < 5) {
            newErrors.address = "Address must be at least 5 characters"
        }

        if (!reader && !formData.password.trim()) {
            newErrors.password = "Password is required"
        } else if (!reader && formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            onSubmit(formData)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined
            }))
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.name ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter reader name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter email address"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.phone ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter phone number"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                </label>
                <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.address ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter address"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            {!reader && (
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            errors.password ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="Enter password"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>
            )}
        </form>
    )
}

export default ReaderForm
