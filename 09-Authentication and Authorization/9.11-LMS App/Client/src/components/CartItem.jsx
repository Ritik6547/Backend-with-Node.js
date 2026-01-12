import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { name, image, quantity, price } = item;
  const { removeFromCart } = useCart();
  return (
    <div className="flex items-center p-6 space-x-6">
      <img
        src={image}
        alt={name}
        className="w-32 h-24 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">Quantity: {quantity}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
          ₹{price * (quantity || 1)}
        </p>
      </div>
      <button
        onClick={() => removeFromCart(item)}
        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}
