import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import axios from "axios";
import ItemCard from "../Components/ItemCard";

const Homepage = () => {
    const userInfo = useSelector((state) => state.user.userInfo);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const navigate = useNavigate();

    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/api/v1/products/get/latest`
                );
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center px-4">
            {/* Heading */}
            <div className="text-3xl text-center mb-6">
                Our latest additions
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
                {items.map((item, index) => (
                    <ItemCard
                        onClick={() => {
                            navigate(`/product/${item._id}`);
                        }}
                        item={item}
                        key={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default Homepage;
