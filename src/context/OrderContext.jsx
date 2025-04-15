import { createContext, useEffect, useState } from "react";

export const OrderContext = createContext();

export default function OrderContextProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      return storedCart && storedCart !== "undefined"
        ? JSON.parse(storedCart)
        : [];
    } catch (err) {
      console.error("Error parsing cart from localStorage:", err);
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const storedOrders = localStorage.getItem("orders");
      return storedOrders && storedOrders !== "undefined"
        ? JSON.parse(storedOrders)
        : [];
    } catch (err) {
      console.error("Error parsing orders from localStorage:", err);
      return [];
    }
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Error saving cart to localStorage:", err);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("orders", JSON.stringify(orders));
    } catch (err) {
      console.error("Error saving orders to localStorage:", err);
    }
  }, [orders]);

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
      //   setCart((prev) => {
      //     prev.filter((item) => item.product.id !== productId);
      //   });

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
      //   setCart((prev) => {
      //     prev.map((item) =>
      //       item.product.id === productId ? { ...item, quantity } : item
      //     );
      //   });

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
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
