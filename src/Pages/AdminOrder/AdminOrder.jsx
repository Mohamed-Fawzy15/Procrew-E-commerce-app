import { useState } from "react";
import { useOrders } from "../../Hooks/useOrders";

export default function AdminOrder() {
  const { orders, filterOrders, updateOrderStatus, error } = useOrders();

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
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="container mx-auto p-4 pt-20">
      <h1 className="text-3xl font-bold mb-4">Manage Orders</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div>
          <label htmlFor="status" className="input-label">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="input-style"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="userId" className="input-label">
            User Email
          </label>
          <input
            id="userId"
            name="userId"
            type="text"
            className="input-style"
            value={filters.userId}
            onChange={handleFilterChange}
            placeholder="Search by email"
          />
        </div>
        <div>
          <label htmlFor="date" className="input-label">
            Date
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

      {/* Orders */}
      <div className="space-y-6">
        {filteredOrders.length ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold">
                Order #{order.id} - {order.userId}
              </h2>
              <p className="text-gray-600">
                Placed on: {new Date(order.createdAt).toLocaleDateString()}
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
                Total: ${Number(order.total).toFixed(2)}
              </p>
              <div className="mt-4">
                <label htmlFor={`status-${order.id}`} className="input-label">
                  Status
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
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}
