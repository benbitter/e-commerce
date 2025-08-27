import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import axios from "axios";
import ItemCard from "../Components/ItemCard";

const Homepage = () => {
    const userInfo = useSelector((state) => state.user.userInfo);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/v1/products/get/latest"
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
                {isLoggedIn && userInfo && (
                    <span className="ml-2 text-blue-500">
                        {`Welcome back, ${userInfo.email}!`}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
                {items.map((item, index) => (
                    <ItemCard
                        item={item}
                        key={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default Homepage;
