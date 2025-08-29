import React, { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/cart/getcarts",
          { withCredentials: true }
        );
        console.log("Cart items fetched successfully:", response.data);
        setCartItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Remove product from cart
  const handleRemove = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:3001/api/v1/cart/remove/${productId}`,
        { withCredentials: true }
      );
      setCartItems(cartItems.filter((item) => item._id !== productId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Update quantity (increase or decrease)
  const updateQuantity = async (productId, newQuantity, minQty) => {
    if (newQuantity < minQty) return; // prevent going below minimumOrderQuantity

    try {
      await axios.put(
        `http://localhost:3001/api/v1/cart/update/${productId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * (item.product.quantity || 1),
    0
  );

  const handleCheckout = () => {
    alert("Checkout clicked!");
  };

  if (loading) return <p className="text-center mt-4">Loading cart...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border p-4 rounded-lg shadow-sm"
            >
              <div
               className="flex items-center space-x-4">
                <img
                  src={`${item.product?.thumbnail}`}
                  alt={item.product?.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold">{item.product?.title}</h2>
                  <p className="text-gray-600">₹{item.product?.price}</p>

                  {/* Quantity controls */}
                  <div className="flex items-center mt-2 space-x-2">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          (item.quantity || 1) - 1,
                          item.minimumOrderQuantity || 1
                        )
                      }
                      className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="px-3">{item.quantity || 1}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          (item.quantity || 1) + 1,
                          item.minimumOrderQuantity || 1
                        )
                      }
                      className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-sm text-gray-500">
                    Min Qty: {item.minimumOrderQuantity || 1}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRemove(item._id)}
                className="text-red-500 font-semibold hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Total Section */}
          <div className="flex justify-between items-center border-t pt-4 mt-6">
            <h2 className="text-xl font-bold">Total: ₹{totalPrice}</h2>
            <button
              onClick={handleCheckout}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
