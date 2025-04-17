import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login/Login";
import MainLayout from "./Component/MainLayout/MainLayout";
import Register from "./Pages/Register/Register";
import UserContextProvider from "./context/UserContext";
import Products from "./Pages/Products/Products";
import ProductContextProvider from "./context/ProductContext";
import ProtectedRoute from "./Component/ProtectedRoutes/ProtectedRoute";
import AdminProducts from "./Pages/AdminProducts/AdminProducts";
import OrderContextProvider from "./context/OrderContext";
import Cart from "./Pages/Cart/Cart";
import Orders from "./Pages/Orders/Orders";
import AdminOrder from "./Pages/AdminOrder/AdminOrder";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { Toaster } from "react-hot-toast";
import AdminDashboard from "./Component/AdminDashboard/AdminDashboard";
import AdminLayout from "./Pages/AdminLayout/AdminLayout";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
// fix importing error
import NotFound from "./Pages/NotFound/NotFound";

function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          ),
        },
        {
          path: "products",
          element: (
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          ),
        },
        {
          path: "productdetails/:productId",
          element: (
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin",
          element: (
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "dashboard",
              element: (
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              ),
            },
            {
              path: "products",
              element: (
                <ProtectedRoute adminOnly>
                  <AdminProducts />
                </ProtectedRoute>
              ),
            },
            {
              path: "orders",
              element: (
                <ProtectedRoute adminOnly>
                  <AdminOrder />
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          path: "cart",
          element: (
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          ),
        },
        {
          path: "orders",
          element: (
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          ),
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);
  return (
    <>
      <I18nextProvider i18n={i18n}>
        <UserContextProvider>
          <ProductContextProvider>
            <OrderContextProvider>
              <Toaster position="top-right" />
              <RouterProvider router={router}></RouterProvider>
            </OrderContextProvider>
          </ProductContextProvider>
        </UserContextProvider>
      </I18nextProvider>
    </>
  );
}

export default App;
