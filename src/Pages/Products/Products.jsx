import { useState } from "react";
import { useProducts } from "../../Hooks/useProducts";
import { useUser } from "../../Hooks/useUser";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import productImage from "../../assets/product.jpg";
import { useOrders } from "../../Hooks/useOrders";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

export default function Products() {
  const { searchProducts } = useProducts();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useOrders();
  const [filters, setFilters] = useState({
    category: "",
    priceMin: "",
    priceMax: "",
    isAvailable: undefined,
  });
  const { t } = useTranslation();

  // Process filters to ensure numeric values
  const processedFilters = {
    ...filters,
    priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
    priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
  };

  const filteredProducts = searchProducts(searchQuery, processedFilters);

  const categories = [
    { id: "frozen", name: "Frozen" },
    { id: "canned", name: "Canned Items" },
    { id: "juices", name: "Juices" },
    { id: "spices", name: "Spices" },
    { id: "pickles", name: "Pickles" },
    { id: "snacks", name: "Snacks" },
  ];

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? true : undefined) : value,
    }));
  };

  const handleAddToCart = (product) => {
    try {
      addToCart(product);
      toast.success(t("products.product_added_to_cart"), {
        style: {
          fontWeight: 600,
        },
      });
    } catch {
      toast.error(t("products.product_not_found"), {
        style: {
          fontWeight: 600,
        },
      });
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col justify-center">
      <h1 className="text-3xl font-bold mb-4">{t("products.title")}</h1>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label htmlFor="search" className="input-label">
            {t("products.search")}
          </label>
          <div className="relative">
            <IoSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              id="search"
              type="text"
              className="input-style w-full pl-10"
              placeholder={t("products.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div>
            <label htmlFor="category" className="input-label">
              {t("products.category")}
            </label>
            <select
              id="category"
              name="category"
              className="input-style"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">{t("products.all_categories")}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="priceMin" className="input-label">
              {t("products.min_price")}
            </label>
            <input
              id="priceMin"
              name="priceMin"
              type="number"
              step="0.01"
              className="input-style w-24"
              value={filters.priceMin}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label htmlFor="priceMax" className="input-label">
              {t("products.max_price")}
            </label>
            <input
              id="priceMax"
              name="priceMax"
              type="number"
              step="0.01"
              className="input-style w-24"
              value={filters.priceMax}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label className="input-label flex items-center gap-2">
              <input
                type="checkbox"
                name="isAvailable"
                checked={filters.isAvailable === true}
                onChange={handleFilterChange}
              />
              {t("products.available_only")}
            </label>
          </div>
        </div>
      </div>

      {user?.role === "admin" && (
        <Link
          to="/admin/products"
          className="text-blue-500 underline mb-4 inline-block"
        >
          {t("products.manage_products")}
        </Link>
      )}

      <div className="row justify-center gap-4">
        {filteredProducts.length ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition "
            >
              {productImage && (
                <img
                  src={productImage}
                  alt={product.name}
                  className="w-50 h-50 object-cover rounded mb-2"
                />
              )}
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-gray-800 font-bold">
                ${Number(product.price).toFixed(2)}
              </p>
              <p
                className={
                  product.isAvailable ? "text-green-500" : "text-red-500"
                }
              >
                {product.isAvailable
                  ? t("products.in_stock")
                  : t("products.out_of_stock")}
              </p>
              <p className="text-gray-500">
                {t("products.category")}: {product.category}
              </p>
              {product.isAvailable ? (
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-2 bg-blue-700 text-white px-4 py-2 rounded-sm hover:bg-blue-800 cursor-pointer "
                >
                  {t("products.add_to_cart")}
                </button>
              ) : (
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-2 bg-blue-700 text-white px-4 py-2 rounded-sm  disabled:bg-blue-200 "
                  disabled
                >
                  {t("products.add_to_cart")}
                </button>
              )}
            </div>
          ))
        ) : (
          <p>{t("products.no_products")}</p>
        )}
      </div>
    </div>
  );
}
