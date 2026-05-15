import Navbar from "../components/navbar";
import CreateProjectModal from "../components/createProjectModal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaArrowRight,
  FaFolderOpen,
} from "react-icons/fa";
import API from "../utils/api";

const Projects = () => {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // GET TOKEN + USER
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // PROTECT ROUTE
  useEffect(() => {
    if (!token) {
      navigate("/", {
        state: { message: "Please login first" },
      });
    }
  }, [token, navigate]);

  // FETCH PROJECTS
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        const res = await API.get("/projects/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProjects(res.data.projects || []);
      } catch (err) {
        console.log("Error fetching projects", err);

        if (err.response?.status === 401) {
          localStorage.clear();

          navigate("/", {
            state: {
              message: "Session expired. Login again.",
            },
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token, navigate]);

  return (
    <>
      <Navbar />

      <div style={container}>
        {/* GLOW EFFECTS */}
        <div
          style={{
            position: "fixed",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background: "rgba(37,99,235,0.25)",
            filter: "blur(120px)",
            top: "-120px",
            right: "-120px",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "fixed",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "rgba(59,130,246,0.18)",
            filter: "blur(120px)",
            bottom: "-120px",
            left: "-120px",
            zIndex: 0,
          }}
        />
        {/* HEADER */}
        <div style={headerRow}>
          <div>
            <p style={smallText}>PROJECT SPACE</p>

            <h1 style={heading}>
              Projects
            </h1>

            <p style={subHeading}>
              Manage and organize all your team
              projects in one workspace.
            </p>
          </div>

          {/* ADMIN BUTTON */}
          {user?.role === "Admin" && (
            <button
              style={primaryBtn}
              onClick={() => setShowModal(true)}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow =
                  "0 18px 35px rgba(37,99,235,0.45)";
                e.target.style.background =
                  "linear-gradient(135deg, #1d4ed8, #2563eb)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0px)";
                e.target.style.boxShadow =
                  "0 10px 25px rgba(37,99,235,0.3)";
                e.target.style.background =
                  "linear-gradient(135deg, #2563eb, #4f46e5)";
              }}
            >
              + New Project
            </button>
          )}
        </div>

        {/* CONTENT */}
        {loading ? (
          <div style={emptyBox}>
            <p style={{ color: "#cbd5e1" }}>
              Loading projects...
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div style={emptyBox}>
            <FaFolderOpen
              size={40}
              color="#64748b"
            />

            <h2 style={{ color: "white" }}>
              No Projects Found
            </h2>

            <p style={{ color: "#94a3b8" }}>
              Create your first project to get
              started.
            </p>
          </div>
        ) : (
          <div style={grid}>
            {projects.map((p, i) => (
              <div
                key={p._id}
                onClick={() =>
                  navigate(`/project/${p._id}`)
                }
                style={card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 30px 50px rgba(0,0,0,0.35)";
                  e.currentTarget.style.border =
                    "1px solid rgba(96,165,250,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0,0,0,0.25)";
                  e.currentTarget.style.border =
                    "1px solid rgba(255,255,255,0.1)";
                }}
              >
                {/* TOP */}
                <div style={topRow}>
                  <span>PROJECT</span>

                  <div style={arrowBox}>
                    <FaArrowRight size={12} />
                  </div>
                </div>

                {/* TITLE */}
                <h2 style={title}>
                  {p.name}
                </h2>

                {/* DESCRIPTION */}
                <p style={description}>
                  {p.description ||
                    "No description provided for this project."}
                </p>

                {/* FOOTER */}
                <div style={footer}>
                  <div style={memberRow}>
                    <FaUsers size={14} />

                    <span>
                      {p.members?.length || 0} Members
                    </span>
                  </div>

                  <div style={statusBadge}>
                    Active
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal &&
        user?.role === "Admin" && (
          <CreateProjectModal
            onClose={() => setShowModal(false)}
          />
        )}
    </>
  );
};


const container = {
  minHeight: "100vh",
  padding: "50px",
  background:
    "radial-gradient(circle at top left, #1e3a8a 0%, transparent 30%), radial-gradient(circle at bottom right, #2563eb 0%, transparent 35%), linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e40af 100%)",
  fontFamily: "Arial, sans-serif",
  position: "relative",
  overflow: "hidden",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "45px",
  position: "relative",
  zIndex: 2,
};

const smallText = {
  fontSize: "12px",
  letterSpacing: "2px",
  color: "#94a3b8",
};

const heading = {
  fontSize: "58px",
  color: "white",
  margin: "10px 0",
  fontWeight: "800",
  letterSpacing: "-2px",
  textShadow: "0 5px 20px rgba(0,0,0,0.25)",
};

const subHeading = {
  color: "#cbd5e1",
  fontSize: "16px",
};

const primaryBtn = {
  padding: "16px 26px",
  background:
    "linear-gradient(135deg, #2563eb, #4f46e5)",
  color: "white",
  border: "none",
  borderRadius: "16px",
  fontWeight: "700",
  fontSize: "15px",
  cursor: "pointer",
  boxShadow:
    "0 10px 25px rgba(37,99,235,0.3)",
  transition: "all 0.3s ease",
  position: "relative",
  zIndex: 2,
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(340px, 1fr))",
  gap: "28px",
  position: "relative",
  zIndex: 2,
};

const card = {
  padding: "30px",
  borderRadius: "28px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.1)",
  backdropFilter: "blur(18px)",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  position: "relative",
  overflow: "hidden",
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "11px",
  letterSpacing: "2px",
  color: "#94a3b8",
};

const arrowBox = {
  width: "38px",
  height: "38px",
  borderRadius: "14px",
  background: "rgba(255,255,255,0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  transition: "all 0.3s ease",
};

const title = {
  margin: "24px 0 14px",
  color: "white",
  fontSize: "30px",
  fontWeight: "700",
  letterSpacing: "-1px",
};

const description = {
  color: "#cbd5e1",
  lineHeight: "1.8",
  minHeight: "70px",
  fontSize: "15px",
};

const footer = {
  marginTop: "30px",
  paddingTop: "20px",
  borderTop: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const memberRow = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#94a3b8",
  fontSize: "14px",
};

const statusBadge = {
  padding: "8px 14px",
  borderRadius: "999px",
  background: "rgba(34,197,94,0.15)",
  color: "#4ade80",
  fontSize: "12px",
  fontWeight: "600",
};

const emptyBox = {
  height: "320px",
  borderRadius: "28px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(18px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "14px",
  boxShadow:
    "0 20px 40px rgba(0,0,0,0.25)",
  position: "relative",
  zIndex: 2,
};

export default Projects;