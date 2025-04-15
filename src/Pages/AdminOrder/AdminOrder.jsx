import { useState } from "react";
import { useOrders } from "../../Hooks/useOrders";
import { useTranslation } from "react-i18next";

export default function AdminOrder() {
  const {
    filterOrders,
    updateOrderStatus,
    resetData: resetOrderData,
  } = useOrders();
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    status: "",
    userId: "",
    date: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (orderId, status) => {
    try {
      updateOrderStatus(orderId, status);
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredOrders = filterOrders(filters);

  const statuses = [
    t("admin_orders.pending"),
    t("admin_orders.processing"),
    t("admin_orders.shipped"),
    t("admin_orders.delivered"),
    t("admin_orders.cancelled"),
  ];

  const handleResetData = () => {
    if (window.confirm(t("admin_orders.reset_confirm"))) {
      resetOrderData();
    }
  };

  return (
    <div className="container mx-auto p-4 pt-20 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-4">{t("admin_orders.title")}</h1>
        <button
          onClick={handleResetData}
          className="bg-red-600 text-white px-4 py-2 rounded-sm hover:bg-red-700"
        >
          {t("admin_orders.reset_data")}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div>
          <label htmlFor="status" className="input-label">
            {t("admin_orders.status")}
          </label>
          <select
            id="status"
            name="status"
            className="input-style"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">{t("admin_orders.all_statuses")}</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="userId" className="input-label">
            {t("admin_orders.user_email")}
          </label>
          <input
            id="userId"
            name="userId"
            type="text"
            className="input-style"
            value={filters.userId}
            onChange={handleFilterChange}
            placeholder={t("admin_orders.user_email")}
          />
        </div>
        <div>
          <label htmlFor="date" className="input-label">
            {t("admin_orders.date")}
          </label>
          <input
            id="date"
            name="date"
            type="date"
            className="input-style"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredOrders.length ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold">
                {t("admin_orders.order_id", { id: order.id })} - {order.userId}
              </h2>
              <p className="text-gray-600">
                {t("admin_orders.placed_on", {
                  date: new Date(order.createdAt).toLocaleDateString(),
                })}
              </p>
              <div className="mt-4">
                {order.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-4 mb-2"
                  >
                    {item.product.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <p>{item.product.name}</p>
                      <p className="text-gray-600">
                        ${Number(item.product.price).toFixed(2)} x{" "}
                        {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-800 font-bold mt-4">
                {t("admin_orders.total_price", {
                  price: Number(order.total).toFixed(2),
                })}
              </p>
              <div className="mt-4">
                <label htmlFor={`status-${order.id}`} className="input-label">
                  {t("admin_orders.status")}
                </label>
                <select
                  id={`status-${order.id}`}
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="input-style"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))
        ) : (
          <p>{t("admin_orders.no_orders")}</p>
        )}
      </div>
    </div>
  );
}
