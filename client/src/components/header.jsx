import React from "react";
import { Layout, Input, Menu } from "antd";
import { FireOutlined, SearchOutlined } from "@ant-design/icons";
import { FaInstagram, FaFacebook, FaTimes, FaDiscord } from "react-icons/fa";
import Advertisement from "./Advertisement";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

const FireLineHeader = () => {
  const navigate = useNavigate();
  const isLargeScreen = window.innerWidth > 900;

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#b50000",
        padding: "0 20px",
        height: "10vh",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <FireOutlined
          style={{
            fontSize: "24px",
            color: "#ffcd48",
            marginRight: "8px",
          }}
        />
        <span
          style={{ fontSize: "20px", color: "#fefffd", fontWeight: "bold" }}
        >
          FireLine
        </span>
        <Menu
          mode="horizontal"
          theme="dark"
          style={{
            backgroundColor: "transparent",
            borderBottom: "none",
            marginLeft: "20px",
          }}
        >
          <Menu.Item
            key="home"
            style={{
              fontWeight: "bold",
              color: "#d8d8ca",
              padding: isLargeScreen ? "" : 5,
            }}
            onClick={() => navigate("/")}
          >
            Home
          </Menu.Item>
          <Menu.Item
            key="support"
            style={{
              fontWeight: "bold",
              color: "#d8d8ca",
              padding: isLargeScreen ? "" : 5,
            }}
            onClick={() => window.open("https://ko-fi.com", "_blank")}
          >
            Support Us
          </Menu.Item>
        </Menu>
      </div>

      {isLargeScreen ? (
        <div
          style={{
            width: "50%",
            // backgroundColor: "#e3f5ff",
            borderRadius: "10px",
            padding: "10px",
            color: "#333",
            height: "5vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Advertisement />
        </div>
      ) : null}

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <FaInstagram
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#d8d8ca",
            cursor: "pointer",
          }}
          onClick={() => window.open("https://www.instagram.com/", "_blank")}
        />

        <FaFacebook
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#d8d8ca",
            cursor: "pointer",
          }}
          onClick={() => window.open("https://www.facebook.com/", "_blank")}
        />
        <FaDiscord
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#d8d8ca",
            cursor: "pointer",
          }}
          onClick={() => window.open("https://discord.com/", "_blank")}
        />
      </div>
    </Header>
  );
};

export default FireLineHeader;
