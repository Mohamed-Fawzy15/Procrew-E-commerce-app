import { createContext, useEffect, useState } from "react";
import initialOrders from "../Data/orders.json";
import initialCart from "../Data/cart.json";
import { downloadJSON } from "../utils/downloadJSON";
import { useUser } from "../Hooks/useUser";

export const OrderContext = createContext();

export default function OrderContextProvider({ children }) {
  const { user } = useUser();

  const [cart, setCart] = useState(() => {
    return user && initialCart[user.email] ? initialCart[user.email] : [];
  });

  const [orders, setOrders] = useState(initialOrders || []);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && cart.length) {
      const updatedCart = { ...initialCart, [user.email]: cart };
      downloadJSON(updatedCart, "cart.json");
    }
  }, [cart, user]);

  useEffect(() => {
    if (orders.length) {
      downloadJSON(orders, "orders.json");
    }
  }, [orders]);

  // Update cart when user changes
  useEffect(() => {
    if (user) {
      setCart(initialCart[user.email] || []);
    } else {
      setCart([]);
    }
  }, [user]);

  //   add product to cart
  const addToCart = (product, quantity = 1) => {
    setError(null);
    try {
      if (!product.isAvailable) {
        throw new Error("Product is out of stock");
      }

      setCart((prev) => {
        const productExisting = prev.find(
          (item) => item.product.id === product.id
        );
        if (productExisting) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { product, quantity }];
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  //   remove product from the cart
  const removeFromCart = (productId) => {
    setError(null);
    try {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  //   update product quantity on cart
  const updateCartQuantity = (productId, quantity) => {
    setError(null);
    try {
      if (quantity < 1) {
        throw new Error("Quantity cannot be less than 1");
      }

      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  //   place order
  const placeOrder = (user) => {
    setError(null);
    try {
      if (!cart.length) {
        throw new Error("Cart is empty");
      }

      const order = {
        id: Date.now(),
        userId: user.email,
        items: [...cart],
        total: cart.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      setOrders((prev) => [...prev, order]);
      setCart([]);
      return order;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  //   update order status for admin
  const updateOrderStatus = (orderId, status) => {
    setError(null);
    try {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  //   filter orders for admin
  const filterOrders = (filter = {}) => {
    let filteredOrders = [...orders];
    if (filter.status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === filter.status
      );
    }
    if (filter.userId) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.userId.toLowerCase().includes(filter.userId.toLowerCase()) // we make it lower case becuase the userId is the email
      );
    }

    if (filter.date) {
      const targetDate = new Date(filter.date).toISOString().split("T")[0];
      filteredOrders = filteredOrders.filter(
        (order) => order.createdAt.split("T")[0] === targetDate
      );
    }
    return filteredOrders;
  };

  // reset order data
  const resetOrders = () => {
    setError(null);
    try {
      setOrders([]);
      downloadJSON([], "orders.json");
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Reset cart
  const resetCart = () => {
    setError(null);
    try {
      setCart([]);
      if (user) {
        downloadJSON({ ...initialCart, [user.email]: [] }, "cart.json");
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  // Manual save
  const saveData = () => {
    downloadJSON(orders, "orders.json");
    downloadJSON(
      user ? { ...initialCart, [user.email]: cart } : initialCart,
      "cart.json"
    );
  };

  return (
    <OrderContext.Provider
      value={{
        cart,
        orders,
        error,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        placeOrder,
        updateOrderStatus,
        filterOrders,
        resetOrders,
        resetCart,
        saveData,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
