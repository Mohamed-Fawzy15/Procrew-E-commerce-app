import { useNavigate } from "react-router-dom";
import { useOrders } from "../../Hooks/useOrders";
import { useUser } from "../../Hooks/useUser";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
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
      Swal.fire({
        icon: "success",
        title: t("cart.your_order_has_been_placed"),
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/orders");
    } catch (err) {
      alert(err.message);
    }
  };

  const subTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    30
  );
  return (
    <div className="container mx-auto p-4 pt-20 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{t("cart.title")}</h1>

      {cart.length ? (
        <div className="flex flex-col md:flex-row  gap-4 relative">
          <div className=" md:w-3/4 grid grid-cols-1 justify-center gap-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-row justify-center gap-2 items-center border border-gray-300 shadow rounded-lg p-4"
              >
                {item.product.image && (
                  <div className="w-50">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full object-cover rounded me-4"
                    />
                  </div>
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
              </div>
            ))}
          </div>
          <div className=" md:w-1/4 h-60 p-4 sticky right-1 top-0 flex flex-col justify-between items-center bg-gray-100 rounded shadow">
            <div className="flex justify-between w-full">
              <ul>
                <li className="flex justify-between">
                  <p>{t("cart.items")}:</p>
                </li>
                <li>
                  <p>{t("cart.subtotal")}:</p>
                </li>
                <li>
                  <p>{t("cart.tax")}:</p>
                </li>
                <li>
                  <p>{t("cart.shipping")}:</p>
                </li>
              </ul>

              <ul className="text-center">
                <li>
                  <p>{cart.length}</p>
                </li>
                <li>
                  <p>${subTotal}</p>
                </li>
                <li>
                  <p>$10</p>
                </li>
                <li>
                  <p>$20</p>
                </li>
              </ul>
            </div>
            <hr className="bg-black w-full" />
            <h2 className="text-xl font-bold flex justify-between w-full">
              <p>{t("cart.total")}:</p> ${totalPrice.toFixed(2)}
            </h2>
            <button
              onClick={handlePlaceOrder}
              className="bg-blue-700 text-white px-4 py-2 rounded-sm hover:bg-blue-800"
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
