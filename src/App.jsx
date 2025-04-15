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
          path: "admin/products",
          element: (
            <ProtectedRoute adminOnly>
              <AdminProducts />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin/orders",
          element: (
            <ProtectedRoute adminOnly>
              <AdminOrder />
            </ProtectedRoute>
          ),
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
      ],
    },
  ]);
  return (
    <>
      <UserContextProvider>
        <ProductContextProvider>
          <OrderContextProvider>
            <RouterProvider router={router}></RouterProvider>
          </OrderContextProvider>
        </ProductContextProvider>
      </UserContextProvider>
    </>
  );
}

export default App;
