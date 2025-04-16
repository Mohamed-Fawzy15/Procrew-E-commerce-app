// i was using localStorage here but the product data should not be in the localStorage

import { createContext, useEffect, useState } from "react";
import initialProducts from "../data/products.json";
import { downloadJSON } from "../utils/downloadJSON";

export const ProductContext = createContext();

export default function ProductContextProvider({ children }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [error, setError] = useState(null);

  // Download products.json when products change
  useEffect(() => {
    if (products.length) {
      downloadJSON(products, "products.json");
    }
  }, [products]);

  //   handle add products
  const addProducts = (values) => {
    setError(null);
    try {
      if (!values.name || !values.category || !values.price) {
        throw new Error("Name, category, and price are required");
      }

      const newProduct = {
        id: Date.now(),
        name: values.name,
        category: values.category,
        price: Number(values.price),
        isAvailable: values.isAvailable !== false,
        description: values.description || "",
        image: values.image || "https://via.placeholder.com/150",
      };

      setProducts((prev) => [...prev, newProduct]); // to get the old the products and the new ones
      return newProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  //   update specific product
  const updateProduct = (id, values) => {
    setError(null);
    try {
      if (!values.name || !values.category || !values.price) {
        throw new Error("Name, category, and price are required");
      }
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id
            ? {
                ...product,
                name: values.name,
                category: values.category,
                price: Number(values.price),
                isAvailable: values.isAvailable !== false,
                description: values.description || "",
                image:
                  values.image ||
                  product.image ||
                  "https://via.placeholder.com/150",
              }
            : product
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  //   remove specific product
  const removeProduct = (id) => {
    setError(null);
    try {
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Reset all products
  const resetProducts = () => {
    setError(null);
    try {
      setProducts([]);
      downloadJSON([], "products.json");
    } catch (err) {
      setError(err.message);
      throw err;
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

  // Manual save
  const saveData = () => {
    downloadJSON(products, "products.json");
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
        saveData,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
