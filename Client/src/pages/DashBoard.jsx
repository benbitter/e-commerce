import React from 'react'
import { useSelector } from "react-redux";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, []);


  //My orders
  useEffect(() => {
    
    const fetchOrders = async()=>{
      try {
        const response = await axios.get("http://localhost:3001/api/v1/orders/user" , {withCredentials: true});
        console.log("User orders:", response.data);
      } catch (error) {
        console.log("Error fetching user orders:", error);
      }
    }

    fetchOrders();

  }, [userInfo]);

  
  // Fetch Addresses
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/v1/address", {
          withCredentials: true,
        });
        console.log("User addresses:", res.data);
      } catch (error) {
        console.error("Error fetching user addresses:", error);
      }
    };
    fetchUserAddress();
  }, []);

  //

  return (
    <div>
      <h1>User Dashboard</h1>
      {isLoggedIn ? (
        <div>
          <p>Email: {userInfo.email}</p>
          <p>Role: {userInfo.role}</p>
        </div>
      ) : (
        <p>Please log in to view your dashboard.</p>
      )}
    </div>
  )
}

export default Dashboard