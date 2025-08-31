import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not logged in
  useEffect(()=>{
    const check = async()=>{
      const response = await axios.get("http://localhost:3001/api/v1/auth/check-auth", { withCredentials: true });
      if (response.status === 200) {
        setIsLoading(false);
      } else {
        navigate("/");
      }
    }
    check();
  }, [navigate]);


  // Fetch Orders
  useEffect(() => 
  {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/v1/orders/user",
          { withCredentials: true }
        );
        setOrders(response.data);
      } catch (error) {
        console.log("Error fetching user orders:", error);
        navigate("/");
        navigate(0);
      }
    };
    if (userInfo) fetchOrders();
  }, [userInfo]);

  // Fetch Addresses
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/v1/address", {
          withCredentials: true,
        });
        setAddresses(res.data);
      } catch (error) {
        navigate("/");
        navigate(0);
        console.error("Error fetching user addresses:", error);
      }
    };
    fetchUserAddress();
  }, []);

  // Fetch Wishlist
  useEffect(() => {
    const fetchUserWishlist = async () => {
      try {
        if (!userInfo?._id) return;
        const res = await axios.get(
          `http://localhost:3001/api/v1/wishlist/user/${userInfo?._id}`,
          { withCredentials: true }
        );
        setWishlist(res.data);
      } catch (error) {
        console.error("Error fetching user wishlist:", error);
        navigate("/");
        navigate(0);
      }
    };
    fetchUserWishlist();
  }, [userInfo]);

  // Delete wishlist item
  const handleDeleteWishlist = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/v1/wishlist/${id}`, {
        withCredentials: true,
      });
      setWishlist((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting wishlist:", err);
      navigate("/");
        navigate(0);
    }
  };

  // Make user seller
  const handleBecomeSeller = async () => {
    try {
      await axios.post(
        "http://localhost:3001/api/v1/auth/makeAdmin",
        {userId : userInfo?._id},
        { withCredentials: true }
      );
      setShowDialog(true);
      // Ideally update redux userInfo here as well
    } catch (err) {
      console.error("Error making seller:", err);
      navigate("/");
        navigate(0);
    }
  };

  if(isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">User Dashboard</h1>

        {/* User Info */}
        <div className="mb-6">
          <p className="text-gray-700"><b>Email:</b> {userInfo?.email}</p>
          <p className="text-gray-700">
            <b>Role:</b>{" "}
            {userInfo?.isAdmin ? (
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded-md">
                Verified Seller
              </span>
            ) : (
              "Customer"
            )}
          </p>
        </div>

        {/* Become Seller Switch */}
        {!userInfo?.isAdmin && (
          <div className="mb-6 flex items-center space-x-3">
            <span className="text-gray-700">Become a Seller</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={handleBecomeSeller}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition"></div>
            </label>
          </div>
        )}

        <button
          onClick={() => navigate("/profile")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Edit Profile
        </button>

        {/* Orders */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">My Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <div className="grid gap-3">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border p-3 rounded-lg shadow-sm bg-gray-50"
                >
                  <p>Order ID: {order._id}</p>
                  <p>Status: {order.status}</p>
                  <p>Total: ₹{order.total}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Addresses */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">My Addresses</h2>
          {addresses.length === 0 ? (
            <p className="text-gray-500">No saved addresses.</p>
          ) : (
            <div className="grid gap-3">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="border p-3 rounded-lg shadow-sm bg-gray-50"
                >
                  <p>{addr.street}, {addr.city}, {addr.state}, {addr.country}</p>
                  <p><b>Phone:</b> {addr.phoneNumber}</p>
                  <p><b>Type:</b> {addr.type}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wishlist */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">My Wishlist</h2>
          {wishlist.length === 0 ? (
            <p className="text-gray-500">No items in wishlist.</p>
          ) : (
            <div className="grid gap-3">
              {wishlist.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border p-3 rounded-lg shadow-sm bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product?.thumbnail || "https://via.placeholder.com/80"}
                      alt={item.product?.title || "Product"}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.product?.title || "Product"}</p>
                      <p className="text-sm text-gray-600">
                        Note: {item.note || "No note"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteWishlist(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin Access */}
        {userInfo?.isAdmin && (
          <button
            className="mt-8 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            onClick={() => navigate("/sells")}
          >
            My Products
          </button>
        )}
      </div>

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-600">
              🎉 Congratulations!
            </h2>
            <p className="mt-2 text-gray-700">
              You are now a <b>Seller</b> on our platform.
            </p>
            <button
              onClick={() => { setShowDialog(false);  }}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
