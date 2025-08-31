import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CheckOut = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMode, setPaymentMode] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch Cart
  useEffect(() => {
    const fetchUserCart = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/v1/cart/getcarts",
          { withCredentials: true }
        );
        setCartItems(res.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserCart();
  }, []);

  // Fetch Addresses
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/v1/address", {
          withCredentials: true,
        });
        setAddresses(res.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserAddress();
  }, []);

  if (!isLoggedIn) {
    return <div className="text-center mt-10">⚠️ Please log in to proceed to checkout.</div>;
  }

  // Total Price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * (item.quantity || 1),
    0
  );

  // Place Order
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setMessage("❌ Please select an address.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3001/api/v1/orders",
        {
          user: userInfo._id,
          item: cartItems.map((c) => c._id), // cart item IDs
          address: selectedAddress,
          paymentMode,
          total: totalPrice,
        },
        { withCredentials: true }
      );
      console.log("invoice",res.data);
      alert("✅ Order placed successfully! \n Invoice will be sent to your email.");
      await axios.delete(`http://localhost:3001/api/v1/cart/user/${userInfo._id}`, { withCredentials: true });
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to place order.");
      setLoading(false);
      navigate("/");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {/* Cart Summary */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Your Cart</h3>
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between border-b py-2">
            <span>{item.product.title} (x{item.quantity || 1})</span>
            <span>₹{item.product.price * (item.quantity || 1)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-3">
          <span>Total:</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>

      {/* Address Selection */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Select Address</h3>
        {addresses.length === 0 ? (
          <p className="text-gray-500">No saved addresses found. Please add one.</p>
        ) : (
          <select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select Address --</option>
            {addresses.map((addr) => (
              <option key={addr._id} value={addr._id}>
                {addr.street}, {addr.city}, {addr.state}, {addr.country} -{" "}
                {addr.postalCode}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="COD">Cash on Delivery (COD)</option>
          <option value="UPI">UPI</option>
          <option value="CARD">Credit/Debit Card</option>
        </select>
      </div>

      {/* Place Order */}
      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>

      {message && <p className="mt-4 text-center font-semibold">{message}</p>}
    </div>
  );
};

export default CheckOut;
