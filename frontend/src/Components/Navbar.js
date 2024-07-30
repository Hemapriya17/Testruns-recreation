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
  const { currentUser } = useAuth(); // Ensure to use `currentUser` as per your context definition

  const displayName = currentUser ? currentUser.displayName : 'Guest';
  const firstName = displayName.split(' ')[0];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ background: "White" }}>
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
            <h3 className="logo" style={{ color: "black" }}>
              Test <span style={{ background: "#f1c232" }}>RUNS</span>
            </h3>
          </Typography>
          <IconButton>
            <FaQuestionCircle />
          </IconButton>
          <IconButton>
            <BsBellFill />
          </IconButton>
          <Typography sx={{ color: "black" }}>
            Hi {firstName}
          </Typography>
          <IconButton>
            <RxAvatar />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
