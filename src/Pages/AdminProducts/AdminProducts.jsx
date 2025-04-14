import { useState } from "react";
import { useProducts } from "../../Hooks/useProducts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function AdminProducts() {
  const { products, addProducts, updateProducts, deleteProducts, error } =
    useProducts();

  const [editingId, setEditingId] = useState(null);

  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    category: z.string().min(1, "Category is required"),
    price: z.number().min(0, "Price must be positive"),
    isAvailable: z.boolean(),
    description: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    setValue,
  } = useForm({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: {
      isAvailable: true,
    },
  });

  const handleEditProduct = async (values) => {
    try {
      const data = {
        ...values,
        image: values.image?.[0],
      };

      if (editingId) {
        await updateProducts(editingId, values);
        setEditingId(null);
      } else {
        await addProducts(values);
      }
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setValue("name", product.name);
    setValue("category", product.category);
    setValue("price", product.price);
    setValue("isAvailable", product.isAvailable);
    setValue("description", product.description);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset();
  };

  const categories = [
    { id: "frozen", name: "Frozen" },
    { id: "canned", name: "Canned Items" },
    { id: "juices", name: "Juices" },
    { id: "spices", name: "Spices" },
    { id: "pickles", name: "Pickles" },
    { id: "snacks", name: "Snacks" },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        {editingId ? "Edit Product" : "Add Product"}
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit(handleEditProduct)}
        className="flex flex-col gap-4 mb-8 max-w-lg"
      >
        {error && <div className="text-red-500">{error}</div>}
        {/* product name */}
        <div>
          <label htmlFor="name" className="input-label">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="input-style w-full"
            {...register("name")}
          />
          {errors.name && (
            <div className="text-red-500 text-sm">{errors.name.message}</div>
          )}
        </div>

        {/* product category */}
        <div>
          <label htmlFor="category" className="input-label">
            Category
          </label>
          <select
            id="category"
            className="input-style w-full"
            {...register("category")}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <div className="text-red-500 text-sm">
              {errors.category.message}
            </div>
          )}
        </div>

        {/* product price */}
        <div>
          <label htmlFor="price" className="input-label">
            Price
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            className="input-style w-full"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <div className="text-red-500 text-sm">{errors.price.message}</div>
          )}
        </div>

        {/* product availability */}
        <div>
          <label className="input-label flex items-center gap-2">
            <input
              type="checkbox"
              {...register("isAvailable")}
              className="h-4 w-4"
            />
            Available
          </label>
        </div>

        {/* product description */}
        <div>
          <label htmlFor="description" className="input-label">
            Description
          </label>
          <textarea
            id="description"
            className="input-style w-full"
            {...register("description")}
          />
        </div>

        {/* product image */}
        <div>
          <label htmlFor="image" className="input-label">
            Image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            className="input-style w-full"
            {...register("image")}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="btn-main"
            disabled={!isValid || !isDirty}
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="btn-main bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product List */}
      <h2 className="text-2xl font-bold mb-4">Existing Products</h2>
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex justify-between items-center border p-4 rounded"
          >
            <div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p>Category: {product.category}</p>
              <p>Price: ${product.price.toFixed(2)}</p>
              <p>{product.isAvailable ? "In Stock" : "Out of Stock"}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="btn-main bg-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProducts(product.id)}
                className="btn-main bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
