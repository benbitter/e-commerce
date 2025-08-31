import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const SellsPages = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // check if seller
  useEffect(() => {
    const check = async () => {
      try {
        const response = await axios.get(
          `https://ecommercebackend-8w7r.onrender.com/api/v1/auth/check-auth`,
          { withCredentials: true }
        );

        if (response.status === 200 && response.data.isAdmin) {
          setIsLoading(false);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        navigate("/");
      }
    };
    check();
  }, [navigate]);

  // fetch seller products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://ecommercebackend-8w7r.onrender.com/api/v1/products/getSellerProducts/sells`,
          { withCredentials: true }
        );
        setProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching sells data:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ Delete product function
  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(
        `https://ecommercebackend-8w7r.onrender.com/api/v1/products/${id}`,
        { withCredentials: true }
      );

      // Remove from UI instantly
      setProducts((prev) => prev.filter((p) => p.product._id !== id));
      alert("✅ Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("❌ Failed to delete product");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">
          My Products ({products?.length})
        </h1>
        <button
          onClick={() => navigate("/addproduct")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Add New Product
        </button>
      </div>

      {(products.length === 0 )? (
        <p className="text-gray-500">You haven’t added any products yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <div
              key={product?.product?._id}
              className="border rounded-xl shadow-sm p-4 bg-white hover:shadow-md transition"
            >
              <img
                src={
                  product?.product?.thumbnail ||
                  "https://via.placeholder.com/150"
                }
                alt={product?.product?.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h2 className="text-lg font-semibold text-gray-700">
                {product?.product?.title}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-2">
                {product?.product?.description}
              </p>
              <p className="mt-2 text-blue-600 font-bold">
                ₹{product?.product?.price}
              </p>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(product?.product?._id)}
                className="mt-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg w-full transition-all"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
