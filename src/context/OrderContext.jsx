import { createContext, useEffect, useState } from "react";
import { useUser } from "../Hooks/useUser";
import axios from "axios";

export const OrderContext = createContext();

export default function OrderContextProvider({ children }) {
  const { user } = useUser();
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  // Load cart and orders when user changes
  useEffect(() => {
    getCartData();
    getOrdersData();
  }, [user]);

  // Method to get the cart data
  const getCartData = async () => {
    try {
      if (user?.email) {
        const res = await axios.get(
          `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/cart?email=${user.email}`
        );
        const cartData = res.data;
        setCart(cartData.length > 0 ? cartData[0].items : []);
      } else {
        setCart([]);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Method to get the orders data
  const getOrdersData = async () => {
    try {
      const res = await axios.get(
        `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/orders`
      );
      setOrders(res.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Add product to cart
  const addToCart = async (product, quantity = 1) => {
    setError(null);
    try {
      // Check if user is logged in
      if (!user) {
        throw new Error("Please login to add items to cart");
      }

      // Update cart state
      const updatedCart = [...cart];
      const item = updatedCart.find((i) => i.product.id === product.id);
      if (item) {
        item.quantity += quantity;
      } else {
        updatedCart.push({ product, quantity });
      }

      // it contain the users cart
      const cartRes = await axios.get(
        `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/cart?email=${user.email}`
      );
      console.log(cartRes);

      const cartPayload = { userId: user.email, items: updatedCart };

      // the problem for the refresh and navigate to the login page
      if (cartRes.data.length) {
        await axios.patch(
          `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/cart/${cartRes.data[0].id}`,
          cartPayload
        );
        console.log("hello");
      } else {
        await axios.post(
          `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/cart`,
          cartPayload
        );
      }

      setCart(updatedCart);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Remove product from the cart
  const removeFromCart = async (productId) => {
    setError(null);
    try {
      const updatedCart = cart.filter((item) => item.product.id !== productId);

      if (user) {
        const cartRes = await axios.get(
          `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/cart?email=${user.email}`
        );
        const cartData = cartRes.data;

        if (cartData.length) {
          await axios.patch(
            `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/cart/${cartData[0].id}`,
            {
              items: updatedCart,
            }
          );
        }
      }

      setCart(updatedCart);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update product quantity in cart
  const updateCartQuantity = async (productId, quantity) => {
    setError(null);
    try {
      if (quantity < 1) {
        throw new Error("Quantity cannot be less than 1");
      }

      const updatedCart = cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );

      if (user?.email) {
        const cartRes = await axios.get(
          `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/cart?email=${user.email}`
        );

        const cartData = cartRes.data;

        if (cartData.length) {
          await axios.patch(
            `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/cart/${cartData[0].id}`,
            {
              items: updatedCart,
            }
          );
        } else {
          await axios.post(
            `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/cart`,
            {
              userId: user.email,
              items: updatedCart,
            }
          );
        }
      }

      setCart(updatedCart);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Place order
  const placeOrder = async () => {
    setError(null);
    try {
      if (!user?.email) {
        throw new Error("Please login to place an order");
      }
      if (!cart.length) {
        throw new Error("Cart is empty");
      }

      const order = {
        userId: user.email,
        items: [...cart],
        total: cart.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const orderRes = await axios.post(
        `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/orders`,
        order
      );
      const savedOrder = orderRes.data;
      setOrders((prev) => [...prev, savedOrder]);

      // Clear cart
      if (user?.email) {
        const cartRes = await axios.get(
          `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/cart?email=${user.email}`
        );

        const cartData = cartRes.data;

        if (cartData.length) {
          await axios.patch(
            `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/cart/${cartData[0].id}`,
            {
              items: [],
            }
          );
        }
      }
      setCart([]);
      return savedOrder;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update order status for admin
  const updateOrderStatus = async (orderId, status) => {
    setError(null);
    try {
      const res = await axios.patch(
        `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/orders/${orderId}`,
        {
          status,
        }
      );
      const updatedOrder = res.data;
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updatedOrder : o))
      );
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Filter orders for admin
  const filterOrders = (filter = {}) => {
    let filteredOrders = [...orders];
    if (filter.status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === filter.status
      );
    }
    if (filter.userId) {
      filteredOrders = filteredOrders.filter((order) =>
        order.userId.toLowerCase().includes(filter.userId.toLowerCase())
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

  // Reset orders
  const resetOrders = async () => {
    setError(null);
    try {
      const res = await axios.get(
        `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/orders`
      );
      const orders = res.data;

      await Promise.all(
        orders.map((o) =>
          axios.delete(
            `https://my-json-server.typicode.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db/orders/${o.id}`
          )
        )
      );

      setOrders([]);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
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
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
