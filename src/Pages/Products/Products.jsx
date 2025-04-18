import { useState } from "react";
import { useProducts } from "../../Hooks/useProducts";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useOrders } from "../../Hooks/useOrders";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useUser } from "../../Hooks/useUser";

export default function Products() {
  const { user } = useUser();
  const { searchProducts } = useProducts();
  const { addToCart } = useOrders();
  // const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

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
    { id: "frozen", name: t("products.frozen") },
    { id: "canned", name: t("products.canned") },
    { id: "juices", name: t("products.juices") },
    { id: "spices", name: t("products.spices") },
    { id: "pickles", name: t("products.pickles") },
    { id: "snacks", name: t("products.snacks") },
  ];

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? true : undefined) : value,
    }));
  };

  const handleAddToCart = async (product) => {
    try {
      if (user) {
        const success = await addToCart(product);
        console.log(success);
        if (success) {
          toast.success(t("products.product_added_to_cart"), {
            style: { fontWeight: 600 },
          });
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      throw new Error(errorMessage);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center gap-4">
        {filteredProducts.length ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <Link
                to={`/productdetails/${product.id}`}
                className="block"
                onClick={() => console.log(product.id)}
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-50 object-cover rounded mb-2"
                  />
                )}
                <h2 className="text-xl font-semibold hover:text-blue-600">
                  {product.name}
                </h2>
                <p className="text-gray-600 line-clamp-2">
                  {product.description}
                </p>
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
              </Link>
              {product.isAvailable ? (
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-2 bg-blue-700 text-white px-4 py-2 rounded-sm hover:bg-blue-800 cursor-pointer w-full"
                >
                  {t("products.add_to_cart")}
                </button>
              ) : (
                <button
                  className="mt-2 bg-blue-700 text-white px-4 py-2 rounded-sm disabled:bg-blue-200 w-full"
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
