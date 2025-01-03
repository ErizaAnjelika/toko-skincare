import { createBrowserRouter } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductPage } from "./pages/ProductPage";
import { AddProductPage } from "./pages/ProductPage/AddProductPage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./pages/AuthProvider";
import { UpdateProductPage } from "./pages/ProductPage/UpdateProductPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { UserPage } from "./pages/UserPage";
import { TransactionPage } from "./pages/TransactionPage";
import { AddTransactionPage } from "./pages/TransactionPage/AddTransactionPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/product",
    element: (
      <ProtectedRoute>
        <ProductPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/product/add",
    element: (
      <ProtectedRoute>
        <AddProductPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/product/update/:id",
    element: (
      <ProtectedRoute>
        <UpdateProductPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/categories",
    element: (
      <ProtectedRoute>
        <CategoriesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <UserPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/transaction",
    element: (
      <ProtectedRoute>
        <TransactionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/transaction/add-transaction",
    element: (
      <ProtectedRoute>
        <AddTransactionPage />
      </ProtectedRoute>
    ),
  },
]);

export default router;
