import { useNavigate } from "react-router-dom";
import { useOrders } from "../../Hooks/useOrders";
import { useUser } from "../../Hooks/useUser";
import productImage from "../../assets/product.jpg";
import { useTranslation } from "react-i18next";

export default function Cart() {
  const {
    cart = [],
    removeFromCart,
    updateCartQuantity,
    placeOrder,
  } = useOrders();
  const { user } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handlePlaceOrder = async () => {
    try {
      await placeOrder(user);
      alert("Order placed successfully");
      navigate("/orders");
    } catch (err) {
      alert(err.message);
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  return (
    <div className="container mx-auto p-4 pt-20 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{t("cart.title")}</h1>

      {cart.length ? (
        <div>
          <div className="space-y-4 row justify-center gap-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-col justify-center items-center border border-gray-300 shadow rounded-lg p-4"
              >
                {productImage && (
                  <img
                    src={productImage}
                    alt={item.product.name}
                    className="w-50 h-50 object-cover rounded mr-4"
                  />
                )}
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold">{item.product.name}</h2>
                  <p className="text-gray-600">
                    ${Number(item.product.price).toFixed(2)}
                  </p>
                  <div className="flex justify-between items-center gap-8 mt-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateCartQuantity(
                          item.product.id,
                          Number(e.target.value)
                        )
                      }
                      className="input-style w-20 px-4"
                    />
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-white bg-red-500 px-4 py-2 rounded-sm"
                    >
                      {t("cart.remove")}
                    </button>
                  </div>
                </div>
                {/* <p className="text-gray-800 font-bold">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p> */}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {t("cart.total")}: ${totalPrice.toFixed(2)}
            </h2>
            <button
              onClick={handlePlaceOrder}
              className="bg-blue-700 text-white px-6 py-2 rounded-sm hover:bg-blue-800"
              disabled={!user}
            >
              {user ? t("cart.place_order") : t("cart.sign_in_to_order")}
            </button>
          </div>
        </div>
      ) : (
        <p>{t("cart.empty")}</p>
      )}
    </div>
  );
}
