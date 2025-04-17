import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "../../Hooks/useProducts";
import { useOrders } from "../../Hooks/useOrders";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { IoCartOutline } from "react-icons/io5";
import { useUser } from "../../Hooks/useUser";

export default function ProductDetails() {
  const { productId } = useParams();
  const { addToCart } = useOrders();
  const { user } = useUser();
  const { getProductById } = useProducts();
  const [product, setProduct] = useState(null);
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    handleProduct();
  }, [productId, getProductById]);

  const handleProduct = () => {
    try {
      if (!productId) {
        throw new Error("Product ID is required");
      }

      const product = getProductById(productId);

      if (!product) {
        throw new Error("product_not_found");
      }
      setProduct(product);
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          <div className="lg:max-w-lg lg:self-end">
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-center object-cover"
                  onError={(e) => {
                    e.target.src = "/fallback-image.png";
                    console.error("Image failed to load:", product.image);
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">
                    {t("products.no_image")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">{t("products.product_information")}</h2>
              <p className="text-xl text-gray-700">{product.description}</p>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <p className="text-3xl text-gray-900">
                  ${Number(product.price).toFixed(2)}
                </p>
                <div className="ms-4 ps-4 border-s border-gray-300">
                  <h2 className="sr-only">{t("products.availability")}</h2>
                  <p
                    className={`text-sm ${
                      product.isAvailable ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.isAvailable
                      ? t("products.in_stock")
                      : t("products.out_of_stock")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="mt-10 flex sm:flex-col1">
                {product.isAvailable ? (
                  <>
                    <div className="flex items-center">
                      <label
                        htmlFor="quantity"
                        className="me-4 text-sm font-medium text-gray-700"
                      >
                        {t("products.quantity")}
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-20 rounded-md border border-gray-300 text-center text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => {
                        handleAddToCart(product);
                      }}
                      className="ms-4 flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <IoCartOutline className="me-2" />
                      {t("products.add_to_cart")}
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-400 cursor-not-allowed"
                  >
                    {t("products.out_of_stock")}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <h3 className="text-sm font-medium text-gray-900">
                {t("products.category")}
              </h3>
              <div className="mt-4">
                <p className="text-base lowercase text-gray-500">
                  {t(`categories.${product.category}`)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
