import React from "react";
import Paper from "@mui/material/Paper";

const ItemCard = ({ item }) => {
  return (
    <Paper
      elevation={5}
      className="p-4 rounded-2xl shadow-md text-center flex flex-col items-center space-y-3 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
    >
      {/* Product Image */}
      <img
        src={item.thumbnail}
        alt={item.title}
        className="w-40 h-40 object-cover rounded-xl"
      />

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 truncate w-full">
        {item.title}
      </h3>

      {/* Price & Discount */}
      <div className="flex items-center justify-center space-x-3">
        <span className="text-xl font-bold text-green-600">
          ₹{item.price}
        </span>
        {item.discountPercentage > 0 && (
          <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-lg">
            {item.discountPercentage}% OFF
          </span>
        )}
      </div>
    </Paper>
  );
};

export default ItemCard;
