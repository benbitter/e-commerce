import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Homepage from "../pages/Homepage";
import Login from "../pages/Login"
import ItemPage from "../pages/ItemPage";

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
        }
    ]
  }
]);

export { router };
