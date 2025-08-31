import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
} from "@mui/material";
import { Menu,Close} from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./Store/Slices/user.js"
import { useEffect } from 'react';
import { io } from "socket.io-client";
import axios from "axios";
import { useSelector } from "react-redux";


const drawerWidth = 240;

export default function App() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
const userInfo = useSelector((state) => state.user.userInfo);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleNavigation = (path) => {
    if(path === "/logout")
    {
      // Perform logout actions
      const logout = async()=>{

        await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/logout`, { withCredentials: true })
        .then((response) => {
          console.log("Logout successful:", response.data);
          dispatch(setUser({ userInfo: null, socketid: null ,isLoggedIn: false}));
          navigate("/");
        })
        .catch((error) => {
          console.error("Logout error:", error);
        });
      }
      logout();
      navigate(0);
    }else{
      navigate(path);
    }
    setOpen(false); // close drawer after navigation
  };

  useEffect(() => {

    const fetchuser = async () => {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/check-auth`, { withCredentials: true });
      if (response.status === 200) {
        console.log("User fetched successfully:", response.data);
        const socket = await io(`${import.meta.env.VITE_BASE_URL}`, {
          query: {
            userId: response.data._id
          }
        });
        await socket.connect();
        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
          dispatch(setUser({ userInfo: response.data, socketid: socket.id }));
        });
      }
    };
    fetchuser();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Navbar */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
            <div className="w-full flex justify-between" >
              <p>
                {isLoggedIn ? (
                    <span className="ml-2 ">
                        {`${userInfo.email}`}
                    </span>
                ) : (
                    <span className="ml-2 ">
                        Please log in!!
                    </span>
                )}
              </p>
              <p className="flex flex-row items-center gap-3 cursor-pointer " onClick={() => navigate("/search")}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7CA7D8"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                <p>Search</p>
              </p>
            </div>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        sx={{
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        {/* Close Button inside Drawer */}
        <IconButton onClick={toggleDrawer} sx={{ ml: "auto", p: 1 }}>
          <Close />
        </IconButton>


        <List>
        {/* Home */}
          <ListItem className="cursor-pointer" button onClick={() => handleNavigation("/")}  >
            <ListItemIcon>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7CA7D8"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          {isLoggedIn && <ListItem className="cursor-pointer" button onClick={() => handleNavigation("/dashboard")}>
            <ListItemIcon>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7CA7D8"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400 320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"/></svg>
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>}

          {!isLoggedIn && <ListItem className="cursor-pointer" button onClick={() => handleNavigation("/login")}>
            <ListItemIcon>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7CA7D8"><path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/></svg>
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>}

          { isLoggedIn && <ListItem className="cursor-pointer" button onClick={() => handleNavigation("/logout")}>
            <ListItemIcon>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7CA7D8"><path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/></svg>
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>}

          { !isLoggedIn && <ListItem className="cursor-pointer" button onClick={() => handleNavigation("/register")}>
            <ListItemIcon>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7CA7D8"><path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/></svg>
            </ListItemIcon>
            <ListItemText primary="Sign Up" />
          </ListItem>}

          { isLoggedIn && <ListItem lassName="cursor-pointer" button onClick={() => handleNavigation("/cart")}>
            <ListItemIcon>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7CA7D8"><path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/></svg>
            </ListItemIcon>
            <ListItemText primary="Cart" />
          </ListItem>}
        </List>


      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* pushes content below navbar */}
        <Outlet />
      </Box>
    </Box>
  );
}
