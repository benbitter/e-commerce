import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Address = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    phoneNumber: "",
    postalCode: "",
    country: "",
    type: "home", // default
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form before submission
  const validateForm = () => {
    const { street, city, state, phoneNumber, postalCode, country, type } =
      formData;

    if (!street || !city || !state || !phoneNumber || !postalCode || !country || !type) {
      setMessage("❌ Please fill all fields.");
      return false;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setMessage("❌ Phone number must be exactly 10 digits.");
      return false;
    }

    if (!/^\d{4,10}$/.test(postalCode)) {
      setMessage("❌ Enter a valid postal code.");
      return false;
    }

    return true;
  };

  // Submit address
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setMessage("⚠️ Please login to save your address.");
      return;
    }

    if (!validateForm()) return;

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:3001/api/v1/address",
        { ...formData, user: userInfo._id },
        { withCredentials: true }
      );
        console.log("Address data:", { ...formData, user: userInfo._id });
      setMessage("✅ Address saved successfully!");
      setLoading(false);
      setFormData({
        street: "",
        city: "",
        state: "",
        phoneNumber: "",
        postalCode: "",
        country: "",
        type: "home",
      });
    } catch (error) {
      console.error("Error saving address:", error);
      setMessage("❌ Failed to save address.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Address</h2>

      {message && <p className="mb-4 text-center font-semibold">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={formData.street}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {/* Type of address */}
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="home">Home</option>
          <option value="work">Work</option>
          <option value="other">Other</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Address"}
        </button>
      </form>
    </div>
  );
};

export default Address;
