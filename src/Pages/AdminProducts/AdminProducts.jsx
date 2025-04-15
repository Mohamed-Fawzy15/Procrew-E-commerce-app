import { useState } from "react";
import { useProducts } from "../../Hooks/useProducts";

// import productImage from "../../assets/product.jpg";
import { useTranslation } from "react-i18next";

export default function AdminProducts() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetData: resetProductData,
  } = useProducts();
  const [productForm, setProductForm] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    category: "",
    isAvailable: true,
    image: "",
  });

  const [showForm, setShowForm] = useState(false);
  const { t } = useTranslation();

  const categories = [
    "frozen",
    "canned",
    "juices",
    "spices",
    "pickles",
    "snacks",
  ];

  const handleProductSubmit = (e) => {
    e.preventDefault();
    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        category: productForm.category,
        isAvailable: productForm.isAvailable,
        image: productForm.image || "https://via.placeholder.com/150",
      };
      if (productForm.id) {
        updateProduct(productForm.id, productData);
      } else {
        addProduct(productData);
      }
      setShowForm(false);
      setProductForm({
        id: null,
        name: "",
        description: "",
        price: "",
        category: "",
        isAvailable: true,
        image: "",
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditProduct = (product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      isAvailable: product.isAvailable,
      image: product.image,
    });
    setShowForm(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm(t("dashboard.delete_product_confirm"))) {
      try {
        deleteProduct(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleResetData = () => {
    if (window.confirm(t("admin_orders.reset_confirm"))) {
      resetProductData();
    }
  };
  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col  gap-1 justify-center">
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-blue-800">
            {t("dashboard.products")}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-sm hover:bg-blue-700"
            >
              {t("dashboard.add_product")}
            </button>
            <button
              onClick={handleResetData}
              className="bg-red-600 text-white px-4 py-2 rounded-sm hover:bg-red-700"
            >
              {t("dashboard.reset_data")}
            </button>
          </div>
        </div>
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-blue-900">
                {productForm.id
                  ? t("dashboard.edit_product")
                  : t("dashboard.add_product")}
              </h3>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="input-label">
                    {t("products.name")}
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    className="input-style w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="input-label">
                    {t("products.description")}
                  </label>
                  <textarea
                    id="description"
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                    className="input-style w-full"
                    rows="4"
                  />
                </div>
                <div>
                  <label htmlFor="price" className="input-label">
                    {t("products.price")}
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    className="input-style w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category" className="input-label">
                    {t("products.category")}
                  </label>
                  <select
                    id="category"
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                      })
                    }
                    className="input-style w-full"
                    required
                  >
                    <option value="">{t("products.select_category")}</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {t(`products.categories.${cat}`)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={productForm.isAvailable}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          isAvailable: e.target.checked,
                        })
                      }
                    />
                    {t("products.available")}
                  </label>
                </div>
                <div>
                  <label htmlFor="image" className="input-label">
                    {t("products.image_url")}
                  </label>
                  <input
                    id="image"
                    type="text"
                    value={productForm.image}
                    onChange={(e) =>
                      setProductForm({ ...productForm, image: e.target.value })
                    }
                    className="input-style w-full"
                    placeholder="https://via.placeholder.com/150"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-sm hover:bg-indigo-700 flex-1"
                  >
                    {t("dashboard.save")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-sm hover:bg-gray-600 flex-1"
                  >
                    {t("dashboard.cancel")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.length ? (
            products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                <h3 className="text-lg font-semibold text-indigo-900">
                  {product.name}
                </h3>
                <p className="text-gray-600">
                  {t("products.price")}: ${Number(product.price).toFixed(2)}
                </p>
                <p className="text-gray-600">
                  {t("products.category")}:{" "}
                  {t(`products.categories.${product.category}`)}
                </p>
                <p
                  className={
                    product.isAvailable ? "text-green-500" : "text-red-500"
                  }
                >
                  {product.isAvailable
                    ? t("products.available")
                    : t("products.unavailable")}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded-sm hover:bg-indigo-700"
                  >
                    {t("dashboard.edit")}
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-sm hover:bg-red-700"
                  >
                    {t("dashboard.delete")}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">{t("dashboard.no_products")}</p>
          )}
        </div>
      </section>
    </div>
  );
}
