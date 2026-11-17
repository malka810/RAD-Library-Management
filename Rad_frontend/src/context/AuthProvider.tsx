import { useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import apiClient, { setHeaders } from "../services/apiClient"
import router from "../router"

interface AuthProviderProps {
    children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [accessToken, setAccessTokenState] = useState<string>("")
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true)

    const login = (token: string) => {
        setIsLoggedIn(true)
        setAccessTokenState(token)
    }

    const logout = () => setIsLoggedIn(false)

    useEffect(() => {
        setHeaders(accessToken)  // ✅ use the correct function
    }, [accessToken])

    useEffect(() => {
        const tryRefresh = async () => {
            try {
                const result = await apiClient.post("/auth/refresh-token")
                setAccessTokenState(result.data.accessToken)
                // setReaders(readersData);
                // setBooks(booksData);
                // setLendings(lendingsData);
                setIsLoggedIn(true)

                const currentPath = window.location.pathname
                if (["/login", "/signup", "/"].includes(currentPath)) {
                    router.navigate("/dashboard")
                }
            } catch (error) {
                setAccessTokenState("")
                setIsLoggedIn(false)
            } finally {
                setIsAuthenticating(false)
            }
        }

        tryRefresh()
    }, [])

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, isAuthenticating }}>
            {children}
        </AuthContext.Provider>
    )
}
