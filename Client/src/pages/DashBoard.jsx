import React from 'react'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

const DashBoard = () => {

    const userInfo = useSelector((state) => state.user.userInfo);
const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
 const navigate = useNavigate();

 useEffect(()=>{
    console.log(userInfo)
    if(!isLoggedIn) navigate('/');
 },[])

  return (
    <div>
        DashBoard
        {userInfo?.email}
    </div>
  )
}

export default DashBoard