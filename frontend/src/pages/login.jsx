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

  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    members: 0,
  });

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (location.state?.message) {
      alert(location.state.message);
    }

    const fetchStats = async () => {
      try {
        const res = await API.get("/stats");
        console.log(res.data);

        setStats({
          users: res.data.users,
          projects: res.data.projects,
          members: res.data.members,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchStats();
  }, [location]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const inputStyle = {
    padding: "16px 18px",
    borderRadius: "16px",
    border: "1px solid #dbe3ee",
    outline: "none",
    marginBottom: "20px",
    fontSize: "15px",
    background: "#f8fafc",
    transition: "all 0.3s ease",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
    width: "100%",
    boxSizing: "border-box",
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
      {/* GLOW */}
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

      {/* CARD */}
      <div
        style={{
          width: "100%",
          maxWidth: "1080px",
          maxHeight: "760px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "28px",
          overflow: "hidden",
          boxShadow:
            "0 25px 60px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.05)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* LEFT */}
        {!isMobile && (
          <div
            style={{
              padding: "50px 55px",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              background:
                "linear-gradient(160deg, rgba(37,99,235,0.35), rgba(15,23,42,0.65))",
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

            <h1
              style={{
                fontSize: "54px",
                lineHeight: "1.05",
                marginBottom: "24px",
                fontWeight: "800",
                letterSpacing: "-2px",
              }}
            >
              Manage your
              <br />
              team smarter.
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.78)",
                fontSize: "18px",
                lineHeight: "1.8",
                maxWidth: "430px",
              }}
            >
              Organize tasks, track progress, and collaborate with your team
              seamlessly in one modern workspace.
            </p>

            {/* PREVIEW */}
            <div
              style={{
                marginTop: "30px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "22px",
                padding: "24px",
                backdropFilter: "blur(10px)",
                boxShadow: "0 15px 30px rgba(0,0,0,0.25)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "15px",
                    opacity: 0.9,
                  }}
                >
                  Team Progress
                </span>

                <span
                  style={{
                    color: "#60a5fa",
                    fontWeight: "700",
                  }}
                >
                  78%
                </span>
              </div>

              <div
                style={{
                  height: "10px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.08)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "78%",
                    height: "100%",
                    borderRadius: "999px",
                    background:
                      "linear-gradient(90deg,#3b82f6,#60a5fa)",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "22px",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                <span>{stats.projects} Projects</span>
                <span>{stats.members} Team Members</span>
              </div>
            </div>

            {/* STATS */}
            <div
              style={{
                display: "flex",
                gap: "40px",
                marginTop: "28px",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "28px",
                  }}
                >
                  {stats.users}+
                </h3>

                <p
                  style={{
                    opacity: 0.7,
                    marginTop: "6px",
                  }}
                >
                  Active Users
                </p>
              </div>

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
            </div>
          </div>
        )}

        {/* RIGHT */}
        <div
          style={{
            background: "rgba(255,255,255,0.96)",
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
            WELCOME BACK
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
            Sign in
          </h1>

          <p
            style={{
              color: "#64748b",
              marginBottom: "38px",
              fontSize: "16px",
              lineHeight: "1.7",
            }}
          >
            Access your dashboard and continue managing your projects.
          </p>

          {/* EMAIL */}
          <label
            style={{
              marginBottom: "8px",
              fontWeight: "700",
              color: "#334155",
              fontSize: "14px",
            }}
          >
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={handleChange}
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
          <label
            style={{
              marginBottom: "8px",
              fontWeight: "700",
              color: "#334155",
              fontSize: "14px",
            }}
          >
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
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

          {/* OPTIONS */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "2px",
              fontSize: "14px",
              color: "#64748b",
            }}
          >
            <span>Remember me</span>

            <span
              style={{
                color: "#2563eb",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Forgot password?
            </span>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              marginTop: "34px",
              background:
                "linear-gradient(135deg, #2563eb, #3b82f6)",
              color: "white",
              padding: "17px",
              border: "none",
              borderRadius: "16px",
              fontWeight: "700",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow:
                "0 12px 30px rgba(37,99,235,0.35)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow =
                "0 18px 40px rgba(37,99,235,0.5)";
              e.target.style.background =
                "linear-gradient(135deg, #1d4ed8, #2563eb)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0px)";
              e.target.style.boxShadow =
                "0 12px 30px rgba(37,99,235,0.35)";
              e.target.style.background =
                "linear-gradient(135deg, #2563eb, #3b82f6)";
            }}
          >
            Sign In →
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
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{
                color: "#2563eb",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              Create Account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;