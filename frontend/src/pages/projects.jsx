import Navbar from "../components/Navbar";
import CreateProjectModal from "../components/CreateProjectModal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import API from "../utils/api";

const Projects = () => {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // GET TOKEN + USER
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // PROTECT ROUTE (RUN FIRST)
  useEffect(() => {
    if (!token) {
      navigate("/", { state: { message: "Please login first" } });
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

        console.log("PROJECTS:", res.data);

        setProjects(res.data.projects || []);
      } catch (err) {
        console.log("Error fetching projects", err);

        // HANDLE TOKEN EXPIRED / INVALID
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/", { state: { message: "Session expired. Login again." } });
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

      <div style={{ padding: "40px 60px" }}>

        {/* HEADER */}
        <div style={headerRow}>
          <div>
            <p style={smallText}>INDEX</p>

            <h1 style={{ fontSize: "48px", margin: "10px 0" }}>
              Projects
            </h1>

            <p style={{ color: "#64748b" }}>
              All organizational projects.
            </p>
          </div>

          {/* ADMIN ONLY BUTTON */}
          {user?.role === "Admin" && (
            <button
              style={{ height: "45px" }}
              onClick={() => setShowModal(true)}
            >
              + New Project
            </button>
          )}
        </div>

        {/* CONTENT */}
        <div style={grid}>
          {loading ? (
            <p style={{ padding: "20px" }}>Loading projects...</p>
          ) : projects.length === 0 ? (
            <p style={{ padding: "20px" }}>No projects found</p>
          ) : (
            projects.map((p, i) => (
              <div
                key={p._id}
                onClick={() => navigate(`/project/${p._id}`)}
                style={card(i)}
              >
                {/* TOP */}
                <div style={topRow}>
                  <span>PROJECT</span>
                  <span>↗</span>
                </div>

                {/* TITLE */}
                <h2 style={{ margin: "15px 0 5px 0" }}>
                  {p.name}
                </h2>

                {/* DESCRIPTION */}
                <p style={{ color: "#64748b" }}>
                  {p.description || "No description"}
                </p>

                <hr style={{ margin: "20px 0", borderColor: "#e5e7eb" }} />

                {/* MEMBERS */}
                <div style={memberRow}>
                  <FaUsers size={14} />
                  <span>{p.members?.length || 0} members</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && user?.role === "Admin" && (
        <CreateProjectModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

// styles
const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const grid = {
  marginTop: "30px",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  border: "1px solid #e5e7eb",
  background: "white",
};

const card = (i) => ({
  padding: "20px",
  cursor: "pointer",
  borderRight: i % 3 !== 2 ? "1px solid #e5e7eb" : "none",
});

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "12px",
  letterSpacing: "2px",
  color: "#64748b",
};

const memberRow = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  color: "#64748b",
};

const smallText = {
  fontSize: "12px",
  letterSpacing: "2px",
  color: "#64748b",
};

export default Projects;