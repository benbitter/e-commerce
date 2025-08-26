import React from 'react'
import Paper from '@mui/material/Paper';
import { useSelector } from "react-redux";


const arr = ["Item 1", "Item 2", "Item 3" , "Item 4" , "Item 5"];

const Homepage = () => {

    const userInfo = useSelector((state) => state.user.userInfo);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <div className=''>
        <div className='text-3xl w-full flex items-center justify-center' >
            Our latest additions
            {isLoggedIn && userInfo && (
              <span className='ml-2 text-blue-500'>{`Welcome back, ${userInfo.email}!`}</span>
            )}
        </div>
        <div className='flex flex-col items-baseline '>
            {arr.map((item, index) => (
                <Paper elevation={5}  key={index} className='border p-4 rounded shadow mb-3'>
                    {item}
                </Paper>
            ))}
        </div>
    </div>
  )
}

export default Homepage