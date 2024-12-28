import { createBrowserRouter } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductPage } from "./pages/ProductPage";
import { AddProductPage } from "./pages/ProductPage/AddProductPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />,
  },
  {
    path: "/product",
    element: <ProductPage />,
  },
  {
    path: "/product/add",
    element: <AddProductPage />,
  },
]);

export default router;
