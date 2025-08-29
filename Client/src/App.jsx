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
import { Menu, Home, Settings, Close } from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./Store/Slices/user.js"
import { useEffect } from 'react';
import { io } from "socket.io-client";
import axios from "axios";

const drawerWidth = 240;

export default function App() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false); // close drawer after navigation
  };

  useEffect(() => {

    const fetchuser = async () => {
      const response = await axios.get("http://localhost:3001/api/v1/auth/check-auth", { withCredentials: true });
      if (response.status === 200) {
        console.log("User fetched successfully:", response.data);
        const socket = await io("http://localhost:3001", {
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
          <Typography variant="h6" noWrap component="div">
            MY WEBSITE
          </Typography>
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
          <ListItem button onClick={() => handleNavigation("/")}>
            <ListItemIcon><Home /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem button onClick={() => handleNavigation("/dashboard")}>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem button onClick={() => handleNavigation("/login")}>
            <ListItemText primary="Login" />
          </ListItem>

          <ListItem button onClick={() => handleNavigation("/register")}>
            <ListItemText primary="Register" />
          </ListItem>

          <ListItem button onClick={() => handleNavigation("/settings")}>
            <ListItemIcon><Settings /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
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
