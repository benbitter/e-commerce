import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Homepage from "../pages/Homepage";
import Login from "../pages/Login"
import ItemPage from "../pages/ItemPage";
import DashBoard from "../pages/DashBoard";
import RegisterPage from "../pages/RegisterPage";
import AddProduct from "../pages/AddProduct";
import ChatPage from "../pages/ChatPage";
import Cart from "../pages/Cart";
import Address from "../pages/Address";
import CheckOut from "../pages/CheckOut";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children :[
        {
            path: "/",
            element: <Homepage />
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: '/product/:_id',
          element: <ItemPage />
        },
        {
          path : '/dashboard',
          element : <DashBoard/>
        },
        {
          path:'/register',
          element : <RegisterPage/>
        },
        {
          path : "/addproduct",
          element:<AddProduct/>
        },
        {
          path: "/chat/:receiverId",
          element: <ChatPage />
        },
        {
          path: "/cart",
          element: <Cart />
        },
        {
          path: "/address",
          element: <Address />
        },
        {
          path: "/checkout",
          element: <CheckOut />
        }
    ]
  }
]);

export { router };
