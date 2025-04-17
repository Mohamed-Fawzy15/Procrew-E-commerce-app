// i was using localStorage here but the product data should not be in the localStorage

import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const ProductContext = createContext();

export default function ProductContextProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // to get the products from the server
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/products");
      setProducts(res.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
    }
  };

  //   handle add products
  const addProducts = async (values) => {
    setError(null);
    try {
      if (!values.name || !values.category || !values.price) {
        throw new Error("Name, category, and price are required");
      }

      const newProduct = {
        name: values.name,
        category: values.category,
        price: Number(values.price),
        isAvailable: values.isAvailable !== false,
        description: values.description || "",
        image: values.image || "https://placehold.co/600x400",
      };

      const res = await axios.post(
        "http://localhost:3001/products",
        newProduct
      );
      const savedProduct = res.data;
      setProducts((prev) => [...prev, savedProduct]);
      return savedProduct;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  //   update specific product
  const updateProduct = async (id, values) => {
    setError(null);
    try {
      if (!values.name || !values.category || !values.price) {
        throw new Error("Name, category, and price are required");
      }
      const updatedProduct = {
        name: values.name,
        category: values.category,
        price: Number(values.price),
        isAvailable: values.isAvailable !== false,
        description: values.description || "",
        image: values.image || "https://placehold.co/600x400",
      };

      const res = await axios.patch(
        `http://localhost:3001/products/${id}`,
        updatedProduct
      );
      const savedProduct = res.data;
      setProducts((prev) => prev.map((p) => (p.id === id ? savedProduct : p)));
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  //   remove specific product
  const removeProduct = async (id) => {
    setError(null);
    try {
      await axios.delete(`http://localhost:3001/products/${id}`);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Reset all products
  const resetProducts = async () => {
    setError(null);
    try {
      const res = await axios.get("http://localhost:3001/products");

      const products = res.data;

      await Promise.all(
        products.map((p) =>
          axios.delete(`http://localhost:3001/products/${p.id}`)
        )
      );
      setProducts([]);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  //   Implement advanced filtering
  const searchProducts = (query, filters = {}) => {
    let filteredProducts = [...products]; // making a copy of the products

    // filter by name
    if (query) {
      filteredProducts = filteredProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // filter by category
    if (filters.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === filters.category
      );
    }

    // Filter by price range
    if (filters.priceMin !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price >= filters.priceMin
      );
    }

    if (filters.priceMax !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.price <= filters.priceMax
      );
    }

    // Filter by availability
    if (filters.isAvailable !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.isAvailable === filters.isAvailable
      );
    }

    return filteredProducts;
  };

  const getProductById = (id) => {
    const product = products.find((p) => p.id === id || p.id.toString() === id);
    if (!product) {
      console.warn("Product not found:", id);
      return null;
    }
    return product;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        error,
        addProducts,
        updateProduct,
        removeProduct,
        searchProducts,
        resetProducts,
        getProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
