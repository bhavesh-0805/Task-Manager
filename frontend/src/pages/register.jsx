import API from "../utils/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (selectedRole) => {
    setForm({ ...form, role: selectedRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!form.name || !form.email || !form.password) {
      return alert("All fields are required");
    }

    if (!form.email.includes("@")) {
      return alert("Invalid email");
    }

    if (form.password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/register", form);

      alert(res.data.message);

      navigate("/login"); // FIXED
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      
      {/* LOGO */}
      <div style={logoRow}>
        <div style={logoBox}>T</div>
        <h3 style={{ margin: 0 }}>TASKBASE</h3>
      </div>

      {/* FORM */}
      <div style={centerBox}>
        <div style={{ width: "420px", maxWidth: "90%" }}>
          
          <p style={smallText}>CREATE ACCOUNT</p>

          <h1 style={{ fontSize: "48px", margin: "10px 0" }}>
            Get started.
          </h1>

          <p style={{ color: "#64748b", marginBottom: "25px" }}>
            Create an account to manage your team's tasks.
          </p>

          {/* NAME */}
          <label>FULL NAME</label>
          <input name="name" value={form.name} onChange={handleChange} style={input} />

          {/* EMAIL */}
          <label style={label}>EMAIL</label>
          <input name="email" value={form.email} onChange={handleChange} style={input} />

          {/* PASSWORD */}
          <label style={label}>PASSWORD</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} style={input} />

          {/* ROLE */}
          <label style={label}>ROLE</label>

          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            {["Member", "Admin"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleChange(r)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: form.role === r ? "#1d4ed8" : "white",
                  color: form.role === r ? "white" : "#0f172a",
                  border: "1px solid #e5e7eb",
                }}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          {/* SUBMIT */}
          <button onClick={handleSubmit} style={btn} disabled={loading}>
            {loading ? "Creating..." : "Create account →"}
          </button>

          {/* FOOTER */}
          <p style={{ marginTop: "20px", color: "#64748b" }}>
            Have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ color: "#1d4ed8", cursor: "pointer" }}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

// styles
const container = { height: "100vh", position: "relative", background: "#f8fafc" };

const logoRow = {
  position: "absolute",
  top: "30px",
  left: "40px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const logoBox = {
  width: "35px",
  height: "35px",
  background: "#1d4ed8",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
};

const centerBox = {
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const input = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
};

const label = {
  marginTop: "15px",
  display: "block",
};

const btn = {
  width: "100%",
  marginTop: "25px",
  padding: "12px",
  background: "#1d4ed8",
  color: "white",
  border: "none",
};

const smallText = {
  letterSpacing: "2px",
  fontSize: "12px",
  color: "#64748b",
};

export default Register;