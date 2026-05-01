import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaThLarge, FaFolder, FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
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
      <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
        
        {/* LOGO */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={logoBox}>T</div>

          <div>
            <div style={{ fontWeight: "600" }}>TASKBASE</div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>
              TEAM / TASKS
            </div>
          </div>
        </div>

        {/* NAV LINKS */}
        <div style={{ display: "flex", gap: "20px" }}>
          <Link
            to="/dashboard"
            style={navLink(location.pathname === "/dashboard")}
          >
            <FaThLarge size={14} />
            Dashboard
          </Link>

          <Link
            to="/projects"
            style={navLink(location.pathname === "/projects")}
          >
            <FaFolder size={14} />
            Projects
          </Link>
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        
        {/* USER INFO */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "14px" }}>
            {user?.name || "User"}
          </div>

          <div style={roleBadge}>
            {user?.role?.toUpperCase() || "MEMBER"}
          </div>
        </div>

        {/* USER ICON */}
        <div style={iconBox}>
          <FaUser size={14} />
        </div>

        {/* LOGOUT */}
        <button onClick={handleLogout} style={logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
};

// styles
const navbarStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 40px",
  borderBottom: "1px solid #e5e7eb",
  background: "white",
};

const logoBox = {
  width: "32px",
  height: "32px",
  background: "#1d4ed8",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
};

const navLink = (active) => ({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  color: active ? "#1d4ed8" : "#0f172a",
  fontWeight: active ? "600" : "400",
});

const roleBadge = {
  fontSize: "10px",
  background: "#1d4ed8",
  color: "white",
  padding: "2px 6px",
  borderRadius: "4px",
};

const iconBox = {
  width: "36px",
  height: "36px",
  border: "1px solid #e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
};

const logoutBtn = {
  background: "#ef4444",  
  color: "white",
  border: "none",
  padding: "8px 14px",
  cursor: "pointer",
  borderRadius: "4px",
};

export default Navbar;