import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const ItemPage = () => {
  const [item, setItem] = useState(null);
  const [review, setReview] = useState({ rating: 0, comment: "", name: "", email: "" });
  const { _id } = useParams();
  const userInfo = useSelector((state) => state.user.userInfo);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    const fetchItem = async () => {
      const response = await axios.get(`http://localhost:3001/api/v1/products/${_id}`);
      setItem(response.data);
    };
    fetchItem();
  }, [_id]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    console.log("Review submitted:", review);
    // 🔹 POST review to backend if required
  };

  const handleAddToCart = async() => {
    console.log("Added to cart:", item);
    console.log("User Info:", userInfo);
    const res = await axios.post("http://localhost:3001/api/v1/cart", {
      user: userInfo._id,
      product: item._id,
      quantity:item.minimumOrderQuantity
    });
  };

  const handleAddToWishlist = () => {
    console.log("Added to wishlist:", item);
    // 🔹 Dispatch Redux action or POST to backend here
    // dispatch(addToWishlist(item));
  };

  if (!item) return <div className="text-center text-lg font-semibold">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Product Title */}
      <h1 className="text-2xl font-bold text-gray-800">{item.title}</h1>

      {/* Thumbnail + Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image */}
        <img
          src={item.thumbnail}
          alt={item.title}
          className="rounded-xl shadow-md w-full h-72 object-contain bg-white"
        />

        {/* Details */}
        <div className="space-y-3">
          <p className="text-gray-700">{item.description}</p>
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Brand:</strong> {item.brand}</p>
          <p><strong>SKU:</strong> {item.sku}</p>
          <p><strong>Weight:</strong> {item.weight} kg</p>
          <p>
            <strong>Dimensions:</strong>{" "}
            {item.dimensions?.width} x {item.dimensions?.height} x {item.dimensions?.depth} cm
          </p>
          <p><strong>Price:</strong> ₹{item.price}</p>
          <p><strong>Discount:</strong> {item.discountPercentage}%</p>
          <p><strong>Stock:</strong> {item.stock}</p>
          <p><strong>Rating:</strong> ⭐ {item.rating}</p>
          <p><strong>Warranty:</strong> {item.warrantyInformation}</p>
          <p><strong>Shipping:</strong> {item.shippingInformation}</p>
          <p><strong>Status:</strong> {item.availabilityStatus}</p>
          <p><strong>Return Policy:</strong> {item.returnPolicy}</p>
          <p><strong>Min Order Quantity:</strong> {item.minimumOrderQuantity}</p>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddToCart}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Add to Cart
            </button>
            <button
              onClick={handleAddToWishlist}
              className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Tags */}
      {item.tags?.length > 0 && (
        <div>
          <strong>Tags:</strong>{" "}
          {item.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-200 px-2 py-1 rounded-md text-sm mr-2"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Extra Images */}
      {item.images?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold">More Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {item.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`extra-${idx}`}
                className="rounded-md shadow"
              />
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Customer Reviews</h2>
        {item.reviews?.length > 0 ? (
          item.reviews.map((rev, idx) => (
            <div key={idx} className="border-b py-2">
              <p>
                <strong>{rev.reviewerName}</strong> ({rev.reviewerEmail})
              </p>
              <p>⭐ {rev.rating}</p>
              <p>{rev.comment}</p>
              <p className="text-sm text-gray-500">
                {new Date(rev.date).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {/* Write Review */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Write a Review</h2>
        <form onSubmit={handleReviewSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your Name"
            className="border rounded px-3 py-2 w-full"
            value={review.name}
            onChange={(e) => setReview({ ...review, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border rounded px-3 py-2 w-full"
            value={review.email}
            onChange={(e) => setReview({ ...review, email: e.target.value })}
          />
          <input
            type="number"
            placeholder="Rating (1-5)"
            min="1"
            max="5"
            className="border rounded px-3 py-2 w-full"
            value={review.rating}
            onChange={(e) => setReview({ ...review, rating: e.target.value })}
          />
          <textarea
            placeholder="Write your review..."
            className="border rounded px-3 py-2 w-full"
            rows="4"
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ItemPage;
