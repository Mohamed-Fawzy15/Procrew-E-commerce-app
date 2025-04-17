import { useState } from "react";
import { useOrders } from "../../Hooks/useOrders";
import { useTranslation } from "react-i18next";

export default function AdminOrder() {
  const { filterOrders, updateOrderStatus, resetOrders } = useOrders();
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
      resetOrders();
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
          {t("dashboard.product.reset")}
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
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left  rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("admin_orders.order_id")}
                  </th>
                  <th className="px-6 py-3 text-left  rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("admin_orders.user_email")}
                  </th>
                  <th className="px-6 py-3 text-left  rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("admin_orders.date")}
                  </th>
                  <th className="px-6 py-3 text-left  rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("admin_orders.items")}
                  </th>
                  <th className="px-6 py-3 text-left  rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("admin_orders.total_price")}
                  </th>
                  <th className="px-6 py-3 text-left  rtl:text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("admin_orders.status")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.userId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex items-center gap-2"
                          >
                            {item.product.image && (
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.product.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                ${Number(item.product.price).toFixed(2)} x{" "}
                                {item.quantity}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${Number(order.total).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="input-style text-sm"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>{t("admin_orders.no_orders")}</p>
        )}
      </div>
    </div>
  );
}
