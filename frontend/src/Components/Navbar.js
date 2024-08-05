import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { FaQuestionCircle } from "react-icons/fa";
import { BsBellFill } from "react-icons/bs";
import { RxAvatar } from "react-icons/rx";
import { useAuth } from '../contexts/AuthContext';

export default function Navbar({ toggleSidebar }) {
  const { currentUser } = useAuth();

  const displayName = currentUser ? currentUser.displayName : 'Guest';
  const firstName = displayName.split(' ')[0];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ background: "white", boxShadow: 'none', borderBottom: '1px solid #ccc' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2, color: "rgb(119, 114, 114)" }}
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <h3 className="logo" style={{ color: "black", margin: 0 }}>
              Test <span style={{ background: "#f1c232" }}>RUNS</span>
            </h3>
          </Typography>
          <IconButton sx={{ color: "rgb(119, 114, 114)" }}>
            <FaQuestionCircle />
          </IconButton>
          <IconButton sx={{ color: "rgb(119, 114, 114)" }}>
            <BsBellFill />
          </IconButton>
          <Typography sx={{ color: "black", marginLeft: 2, marginRight: 2 }}>
            Hi {firstName}
          </Typography>
          <IconButton sx={{ color: "rgb(119, 114, 114)" }}>
            <RxAvatar />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar /> 
    </Box>
  );
}
