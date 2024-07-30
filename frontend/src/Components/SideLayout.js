import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BiLineChart } from "react-icons/bi";
import { MdSpaceDashboard, MdLogout } from "react-icons/md";
import { GrDocumentTest } from "react-icons/gr";
import { FaRuler } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase"; // Import your Firebase configuration

const SideLayout = ({ children, isOpen }) => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const menuItem = [
    {
      path: "/dashboard",
      name: "My Page",
      icon: <MdSpaceDashboard />,
    },
    {
      path: "/runs",
      name: "Runs",
      icon: <BiLineChart />,
    },
    {
      path: "/procedure",
      name: "Procedures",
      icon: <GrDocumentTest />,
    },
    {
      path: "/assets",
      name: "Assets",
      icon: <FaRuler />,
    },
    {
      path: "/settings",
      name: "Settings",
      icon: <IoSettingsSharp />,
    },
  ];

  // Function to handle logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      signOut(auth)
        .then(() => {
          navigate("/"); // Redirect to home or login page after logout
        })
        .catch((error) => {
          console.error("Error signing out: ", error);
        });
    }
  };

  return (
    <div className="container">
      <div style={{ width: isOpen ? "300px" : "80px" }} className="sidebar">
        {menuItem.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="link"
            activeClassName="active"
          >
            <div className="icon">{item.icon}</div>
            <div
              style={{ display: isOpen ? "block" : "none" }}
              className="link_text"
            >
              {item.name}
            </div>
          </NavLink>
        ))}
        {/* Logout icon */}
        <div className="logout" onClick={handleLogout}>
          <MdLogout />
          {isOpen && <div className="link_text">Logout</div>}
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
};

export default SideLayout;
