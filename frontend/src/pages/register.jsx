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

  const isMobile = window.innerWidth < 768;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (selectedRole) => {
    setForm({ ...form, role: selectedRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "18px 18px",
    marginTop: "8px",
    borderRadius: "18px",
    border: "1px solid #dbe3ee",
    outline: "none",
    fontSize: "15px",
    marginBottom: "18px",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    background: "#f8fafc",
    boxShadow:
      "inset 0 1px 2px rgba(0,0,0,0.03), 0 1px 1px rgba(255,255,255,0.4)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #1e3a8a 0%, transparent 30%), radial-gradient(circle at bottom right, #2563eb 0%, transparent 35%), linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e40af 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* GLOW EFFECTS */}
      <div
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "rgba(37,99,235,0.35)",
          filter: "blur(120px)",
          top: "-100px",
          right: "-100px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(15,23,42,0.8)",
          filter: "blur(120px)",
          bottom: "-100px",
          left: "-100px",
        }}
      />

      {/* MAIN CARD */}
      <div
        style={{
          width: "100%",
          maxWidth: "1080px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "30px",
          overflow: "hidden",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.08)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* LEFT SIDE */}
        {!isMobile && (
          <div
            style={{
              padding: "50px 55px",
              color: "white",
              background:
                "linear-gradient(160deg, rgba(59,130,246,0.4), rgba(15,23,42,0.78))",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* DOTS */}
            <div
              style={{
                position: "absolute",
                top: "40px",
                left: "40px",
                width: "120px",
                height: "120px",
                opacity: 0.15,
                backgroundImage:
                  "radial-gradient(white 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            />

            {/* LOGO */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "35px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "white",
                  color: "#2563eb",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  fontSize: "22px",
                  boxShadow: "0 10px 20px rgba(255,255,255,0.15)",
                }}
              >
                T
              </div>

              <h2
                style={{
                  margin: 0,
                  letterSpacing: "1px",
                  fontSize: "30px",
                }}
              >
                TASKBASE
              </h2>
            </div>

            {/* HEADING */}
            <h1
              style={{
                fontSize: "58px",
                lineHeight: "1.05",
                marginBottom: "24px",
                fontWeight: "800",
                letterSpacing: "-2px",
                textShadow: "0 5px 20px rgba(0,0,0,0.25)",
              }}
            >
              Build better
              <br />
              teamwork.
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.78)",
                fontSize: "18px",
                lineHeight: "1.8",
                maxWidth: "430px",
              }}
            >
              Join thousands of teams using TaskBase to organize projects,
              collaborate faster, and increase productivity.
            </p>

            {/* FLOATING CARDS */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginTop: "35px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "18px",
                  padding: "18px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    opacity: 0.7,
                    fontSize: "13px",
                  }}
                >
                  Productivity
                </p>

                <h2
                  style={{
                    margin: "10px 0 0 0",
                    fontSize: "28px",
                  }}
                >
                  +84%
                </h2>
              </div>

              <div
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "18px",
                  padding: "18px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    opacity: 0.7,
                    fontSize: "13px",
                  }}
                >
                  Team Growth
                </p>

                <h2
                  style={{
                    margin: "10px 0 0 0",
                    fontSize: "28px",
                  }}
                >
                  12K+
                </h2>
              </div>
            </div>

            {/* STATS */}
            <div
              style={{
                display: "flex",
                gap: "40px",
                marginTop: "30px",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "28px",
                  }}
                >
                  99.9%
                </h3>

                <p
                  style={{
                    opacity: 0.7,
                    marginTop: "6px",
                  }}
                >
                  Uptime
                </p>
              </div>

              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "28px",
                  }}
                >
                  24/7
                </h3>

                <p
                  style={{
                    opacity: 0.7,
                    marginTop: "6px",
                  }}
                >
                  Support
                </p>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT SIDE */}
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.96))",
            padding: isMobile ? "36px 24px" : "50px 55px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              letterSpacing: "3px",
              fontSize: "12px",
              color: "#64748b",
              fontWeight: "700",
              marginBottom: "10px",
            }}
          >
            CREATE ACCOUNT
          </p>

          <h1
            style={{
              fontSize: "44px",
              margin: "0 0 14px 0",
              color: "#0f172a",
              fontWeight: "800",
              letterSpacing: "-1px",
            }}
          >
            Get Started
          </h1>

          <p
            style={{
              color: "#64748b",
              marginBottom: "35px",
              fontSize: "16px",
              lineHeight: "1.7",
            }}
          >
            Create your account and start managing projects with ease.
          </p>

          {/* NAME */}
          <label style={label}>Full Name</label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.border = "1px solid #2563eb";
              e.target.style.boxShadow =
                "0 0 0 4px rgba(37,99,235,0.15)";
              e.target.style.transform = "scale(1.01)";
              e.target.style.background = "#ffffff";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid #dbe3ee";
              e.target.style.boxShadow =
                "inset 0 1px 2px rgba(0,0,0,0.03)";
              e.target.style.transform = "scale(1)";
              e.target.style.background = "#f8fafc";
            }}
          />

          {/* EMAIL */}
          <label style={label}>Email</label>

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@company.com"
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.border = "1px solid #2563eb";
              e.target.style.boxShadow =
                "0 0 0 4px rgba(37,99,235,0.15)";
              e.target.style.transform = "scale(1.01)";
              e.target.style.background = "#ffffff";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid #dbe3ee";
              e.target.style.boxShadow =
                "inset 0 1px 2px rgba(0,0,0,0.03)";
              e.target.style.transform = "scale(1)";
              e.target.style.background = "#f8fafc";
            }}
          />

          {/* PASSWORD */}
          <label style={label}>Password</label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.border = "1px solid #2563eb";
              e.target.style.boxShadow =
                "0 0 0 4px rgba(37,99,235,0.15)";
              e.target.style.transform = "scale(1.01)";
              e.target.style.background = "#ffffff";
            }}
            onBlur={(e) => {
              e.target.style.border = "1px solid #dbe3ee";
              e.target.style.boxShadow =
                "inset 0 1px 2px rgba(0,0,0,0.03)";
              e.target.style.transform = "scale(1)";
              e.target.style.background = "#f8fafc";
            }}
          />

          {/* ROLE */}
          <label style={label}>Select Role</label>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "10px",
            }}
          >
            {["Member", "Admin"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleChange(r)}
                style={{
                  flex: 1,
                  padding: "16px",
                  borderRadius: "16px",
                  border:
                    form.role === r
                      ? "2px solid #2563eb"
                      : "1px solid #cbd5e1",
                  background:
                    form.role === r
                      ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                      : "#fff",
                  color: form.role === r ? "white" : "#0f172a",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (form.role !== r) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 10px 20px rgba(0,0,0,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0px)";
                  e.target.style.boxShadow = "none";
                }}
              >
                {r}
              </button>
            ))}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "32px",
              padding: "18px",
              borderRadius: "18px",
              border: "none",
              background:
                "linear-gradient(135deg, #2563eb, #4f46e5)",
              color: "white",
              fontWeight: "700",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow:
                "0 18px 35px rgba(37,99,235,0.35)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow =
                "0 22px 40px rgba(37,99,235,0.45)";
              e.target.style.background =
                "linear-gradient(135deg, #1d4ed8, #2563eb)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0px)";
              e.target.style.boxShadow =
                "0 18px 35px rgba(37,99,235,0.35)";
              e.target.style.background =
                "linear-gradient(135deg, #2563eb, #4f46e5)";
            }}
          >
            {loading ? "Creating..." : "Create Account →"}
          </button>

          {/* FOOTER */}
          <p
            style={{
              marginTop: "28px",
              color: "#64748b",
              textAlign: "center",
              fontSize: "15px",
            }}
          >
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{
                color: "#2563eb",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const label = {
  fontWeight: "700",
  color: "#334155",
  marginBottom: "5px",
  display: "block",
  fontSize: "14px",
};

export default Register;