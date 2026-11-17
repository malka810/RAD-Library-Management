import type { User } from "../types/User"
import apiClient, { setHeaders } from "./apiClient"

export interface SignUpResponse {
    name: string
    email: string
    _id: string
}

export interface LoginResponse {
    name: string
    email: string
    accessToken: string
    _id: string
}

export interface LogoutResponse {
    message: string
}

export const signUp = async (userData: User): Promise<SignUpResponse> => {
    const response = await apiClient.post("/auth/signup", userData)
    return response.data
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post("/auth/login", { email, password })
    const { accessToken } = response.data
    setHeaders(accessToken)
    return response.data
}

export const logout = async (): Promise<LogoutResponse> => {
    const response = await apiClient.post("/auth/logout")
    return response.data
}
