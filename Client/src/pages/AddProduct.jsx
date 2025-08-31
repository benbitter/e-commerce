import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.stock
    ) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    if (files.length === 0) {
      alert("⚠️ Please upload at least one image.");
      return;
    }

    setLoading(true);

    try {
      const uploadedUrls = [];
      for (let file of files) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "commerce_preset");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/ddxc4p1qb/image/upload",
          data
        );
        uploadedUrls.push(res.data.secure_url);
      }

      // ✅ Send only if data is valid
      await axios.post(
        `https://ecommercebackend-8w7r.onrender.com/api/v1/products/addProduct`,
        {
          ...formData,
          images: uploadedUrls,
        },
        { withCredentials: true }
      );

      alert("✅ Product added!");
      setFormData({ title: "", description: "", price: "", stock: "" });
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded w-96 space-y-2">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={formData.stock}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input type="file" multiple onChange={handleFileChange} required />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddProduct;
