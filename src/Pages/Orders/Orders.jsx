import { useTranslation } from "react-i18next";
import { useOrders } from "../../Hooks/useOrders";
import { useUser } from "../../Hooks/useUser";

export default function Orders() {
  const { orders, error } = useOrders();
  const { user } = useUser();
  const { t } = useTranslation();
  console.log(orders);

  const userOrders = orders.filter((order) => order.userId === user.email);

  return (
    <div className="container mx-auto p-4 pt-20 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{t("orders.title")}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {userOrders.length ? (
        <div className="space-y-6">
          {userOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold">
                {t("orders.order_id", { id: order.id })}
              </h2>
              <p className="text-gray-600">
                {t("orders.placed_on", {
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
              <p className="text-gray-800 font-bold mt-4 flex items-center gap-2">
                {t("orders.total_price")}
                <p>${order.total.toFixed(2)}</p>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>{t("orders.no_orders_found")}</p>
      )}
    </div>
  );
}
