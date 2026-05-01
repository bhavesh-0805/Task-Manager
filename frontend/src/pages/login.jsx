import API from "../utils/api";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Show message if redirected from protected route
  useEffect(() => {
    if (location.state?.message) {
      alert(location.state.message);
    }
  }, [location]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      // store token separately (IMPORTANT FIX)
      localStorage.setItem("token", res.data.token);

      // optional: store user info
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        position: "relative",
        background: "#f8fafc",
      }}
    >
      {/* LOGO */}
      <div
        style={{
          position: "absolute",
          top: "30px",
          left: "40px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "35px",
            height: "35px",
            background: "#1d4ed8",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          T
        </div>
        <h3 style={{ margin: 0 }}>TASKBASE</h3>
      </div>

      {/* FORM */}
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "420px", maxWidth: "90%" }}>
          <p
            style={{
              letterSpacing: "2px",
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            SIGN IN
          </p>

          <h1 style={{ fontSize: "48px", margin: "10px 0" }}>
            Welcome back.
          </h1>

          <p style={{ color: "#64748b", marginBottom: "25px" }}>
            Coordinate your team's work with precision.
          </p>

          {/* EMAIL */}
          <label>EMAIL</label>
          <input
            type="email"
            name="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={handleChange}
          />

          {/* PASSWORD */}
          <label style={{ marginTop: "15px", display: "block" }}>
            PASSWORD
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              marginTop: "25px",
              background: "#1d4ed8",
              fontWeight: "500",
              color: "white",
              padding: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Sign in →
          </button>

          {/* FOOTER */}
          <p style={{ marginTop: "20px", color: "#64748b" }}>
            New here?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{ color: "#1d4ed8", cursor: "pointer" }}
            >
              Create an account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;