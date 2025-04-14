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
          <RouterProvider router={router}></RouterProvider>
        </ProductContextProvider>
      </UserContextProvider>
    </>
  );
}

export default App;
