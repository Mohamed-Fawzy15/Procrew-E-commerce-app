import { useState } from "react";
import { useProducts } from "../../Hooks/useProducts";
import { useTranslation } from "react-i18next";

export default function AdminProducts() {
  const {
    products,
    addProducts,
    updateProduct,
    deleteProduct,
    resetProducts,
    saveData,
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
    t("categories.frozen"),
    t("categories.canned"),
    t("categories.juices"),
    t("categories.spices"),
    t("categories.pickles"),
    t("categories.snacks"),
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
        addProducts(productData);
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
      resetProducts();
    }
  };

  const handleSaveData = () => {
    saveData();
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
              {t("dashboard.product.add")}
            </button>
            <button
              onClick={handleResetData}
              className="bg-red-600 text-white px-4 py-2 rounded-sm hover:bg-red-700"
            >
              {t("dashboard.product.reset")}
            </button>
            <button
              onClick={handleSaveData}
              className="bg-green-600 text-white px-4 py-2 rounded-sm hover:bg-green-700"
            >
              {t("dashboard.product.save_data")}
            </button>
          </div>
        </div>
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4 text-blue-900">
                {productForm.id
                  ? t("dashboard.product.edit_product")
                  : t("dashboard.product.add")}
              </h3>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="input-label">
                    {t("dashboard.product.name")}
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
                    {t("dashboard.product.description")}
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
                    {t("dashboard.product.price")}
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
                    <option value="">
                      {t("dashboard.product.select_category")}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
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
                    {t("dashboard.product.available")}
                  </label>
                </div>
                <div>
                  <label htmlFor="image" className="input-label">
                    {t("dashboard.product.image")}
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
                    {t("dashboard.product.save")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-sm hover:bg-gray-600 flex-1"
                  >
                    {t("dashboard.product.cancel")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          {products.length ? (
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("dashboard.product.image")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("dashboard.product.name")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("dashboard.product.price")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("products.category")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("dashboard.product.status")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("dashboard.product.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${Number(product.price).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.isAvailable
                          ? t("dashboard.product.available")
                          : t("dashboard.product.unavailable")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {t("dashboard.product.edit")}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          {t("dashboard.product.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">
              {t("dashboard.product.no_products")}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
