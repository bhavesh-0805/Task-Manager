import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaThLarge,
  FaFolder,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("user")
    );

    setUser(storedUser);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div style={navbarStyle}>
      {/* LEFT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "40px",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={logoBox}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-3px) rotate(-4deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0px) rotate(0deg)";
            }}
          >
            T
          </div>

          <div>
            <div style={logoText}>
              TASKBASE
            </div>

            <div style={logoSubText}>
              TEAM MANAGEMENT PLATFORM
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div style={navContainer}>
          <Link
            to="/dashboard"
            style={navLink(
              location.pathname ===
                "/dashboard"
            )}
            onMouseEnter={(e) => {
              if (
                location.pathname !==
                "/dashboard"
              ) {
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.06)";
              }

              e.currentTarget.style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              if (
                location.pathname !==
                "/dashboard"
              ) {
                e.currentTarget.style.background =
                  "transparent";
              }

              e.currentTarget.style.transform =
                "translateY(0px)";
            }}
          >
            <FaThLarge size={14} />
            Dashboard
          </Link>

          <Link
            to="/projects"
            style={navLink(
              location.pathname ===
                "/projects"
            )}
            onMouseEnter={(e) => {
              if (
                location.pathname !==
                "/projects"
              ) {
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.06)";
              }

              e.currentTarget.style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              if (
                location.pathname !==
                "/projects"
              ) {
                e.currentTarget.style.background =
                  "transparent";
              }

              e.currentTarget.style.transform =
                "translateY(0px)";
            }}
          >
            <FaFolder size={14} />
            Projects
          </Link>
        </div>
      </div>

      {/* RIGHT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        {/* USER INFO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {/* USER ICON */}
          <div
            style={iconBox}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0px)";
            }}
          >
            <FaUser size={15} />
          </div>

          {/* USER DETAILS */}
          <div
            style={{
              textAlign: "right",
            }}
          >
            <div style={userName}>
              {user?.name || "User"}
            </div>

            <div style={roleBadge}>
              {user?.role?.toUpperCase() ||
                "MEMBER"}
            </div>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          style={logoutBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-3px)";

            e.currentTarget.style.boxShadow =
              "0 18px 35px rgba(239,68,68,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0px)";

            e.currentTarget.style.boxShadow =
              "0 12px 24px rgba(239,68,68,0.3)";
          }}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

const navbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  padding: "18px 40px",

  background:
    "rgba(15,23,42,0.72)",

  backdropFilter:
    "blur(22px)",

  borderBottom:
    "1px solid rgba(255,255,255,0.08)",

  position: "sticky",

  top: 0,

  zIndex: 100,

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.18)",
};

const logoBox = {
  width: "46px",

  height: "46px",

  borderRadius: "16px",

  background:
    "linear-gradient(135deg, #2563eb, #1d4ed8)",

  color: "white",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  fontWeight: "800",

  fontSize: "20px",

  boxShadow:
    "0 12px 24px rgba(37,99,235,0.4)",

  transition: "all 0.3s ease",
};

const logoText = {
  fontWeight: "800",

  color: "white",

  fontSize: "18px",

  letterSpacing: "1.5px",
};

const logoSubText = {
  fontSize: "11px",

  color: "#94a3b8",

  marginTop: "2px",

  letterSpacing: "1px",
};

const navContainer = {
  display: "flex",

  alignItems: "center",

  gap: "16px",

  background:
    "rgba(255,255,255,0.04)",

  padding: "8px",

  borderRadius: "18px",

  border:
    "1px solid rgba(255,255,255,0.06)",

  backdropFilter:
    "blur(12px)",
};

const navLink = (active) => ({
  display: "flex",

  alignItems: "center",

  gap: "10px",

  textDecoration: "none",

  padding: "13px 20px",

  borderRadius: "14px",

  fontSize: "14px",

  fontWeight: active
    ? "700"
    : "500",

  color: active
    ? "white"
    : "#cbd5e1",

  background: active
    ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
    : "transparent",

  transition: "all 0.3s ease",

  boxShadow: active
    ? "0 10px 24px rgba(37,99,235,0.3)"
    : "none",

  position: "relative",

  overflow: "hidden",
});

const userName = {
  color: "white",

  fontSize: "14px",

  fontWeight: "600",
};

const roleBadge = {
  fontSize: "10px",

  background:
    "rgba(37,99,235,0.2)",

  color: "#60a5fa",

  padding: "4px 8px",

  borderRadius: "999px",

  marginTop: "4px",

  letterSpacing: "1px",

  fontWeight: "600",
};

const iconBox = {
  width: "46px",

  height: "46px",

  borderRadius: "16px",

  background:
    "rgba(255,255,255,0.08)",

  border:
    "1px solid rgba(255,255,255,0.08)",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  color: "white",

  backdropFilter:
    "blur(12px)",

  transition: "all 0.3s ease",
};

const logoutBtn = {
  display: "flex",

  alignItems: "center",

  gap: "8px",

  background:
    "linear-gradient(135deg, #ef4444, #dc2626)",

  color: "white",

  border: "none",

  padding: "13px 18px",

  borderRadius: "16px",

  cursor: "pointer",

  fontWeight: "700",

  fontSize: "14px",

  transition: "all 0.3s ease",

  boxShadow:
    "0 12px 24px rgba(239,68,68,0.3)",
};

export default Navbar;