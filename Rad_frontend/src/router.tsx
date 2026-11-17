import { createBrowserRouter } from "react-router-dom"
import Layout from "./pages/Layout"
import Login from "./pages/LoginPage"
import Signup from "./pages/SignUpPage"
import AdminRoutes from "./pages/AdminRoutes"
import Dashboard from "./pages/Dashboard.tsx"
import ReadersPage from "./pages/ReadersPage"
import BooksPage from "./pages/BooksPage"
import LendingPage from "./pages/LendingsPage.tsx"
import OverDuePage from "./pages/OverDuePage.tsx"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      {
        element: <AdminRoutes />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/dashboard/readers", element: <ReadersPage /> },
          { path: "/dashboard/books", element: <BooksPage /> }, 
          { path: "/dashboard/lendings", element: <LendingPage /> }, 
          { path: "/dashboard/overdue", element: <OverDuePage /> },

        ],
      },
    ],
  },
])

export default router
