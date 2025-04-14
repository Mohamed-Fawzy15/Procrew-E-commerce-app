import { createContext, useEffect, useState } from "react";

export const ProductContext = createContext();

export default function ProductContextProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const storedProducts = localStorage.getItem("products");
    return storedProducts ? JSON.parse(storedProducts) : [];
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
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
        image: values.image ? URL.createObjectURL(values.image) : "",
      };

      setProducts([...products, newProduct]); // to get the old the products and the new ones
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
      setProducts(
        products.map((product) =>
          product.id === id
            ? {
                ...product,
                name: values.name,
                category: values.category,
                price: Number(values.price),
                isAvailable: values.isAvailable !== false,
                description: values.description || "",
                image: values.image
                  ? URL.createObjectURL(values.image)
                  : product.image,
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
      setProducts(products.filter((product) => product.id !== id));
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

  return (
    <ProductContext.Provider
      value={{
        products,
        error,
        addProducts,
        updateProduct,
        removeProduct,
        searchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
