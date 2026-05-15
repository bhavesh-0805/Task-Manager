import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  if (!project) return null;

  return (
    <div
      onClick={() =>
        navigate(`/project/${project._id}`)
      }
      style={cardStyle}
    >
      {/* TOP */}
      <div style={topRow}>
        <span style={tag}>
          PROJECT
        </span>

        <div style={arrowBox}>
          <FaArrowRight size={12} />
        </div>
      </div>

      {/* TITLE */}
      <h3 style={title}>
        {project.name}
      </h3>

      {/* DESCRIPTION */}
      <p style={description}>
        {project.description ||
          "No description available for this project."}
      </p>

      {/* MEMBERS */}
      <div style={memberSection}>
        <div style={memberHeader}>
          <FaUsers size={13} />

          <span>
            {project.members &&
            project.members.length > 0
              ? `${project.members.length} Members`
              : "No Members"}
          </span>
        </div>

        <div style={memberNames}>
          {project.members &&
          project.members.length > 0
            ? project.members
                .map((m) => m.name)
                .join(", ")
            : "No members added"}
        </div>
      </div>

      {/* FOOTER */}
      <div style={footer}>
        Created{" "}
        {new Date(
          project.createdAt
        ).toLocaleDateString()}
      </div>
    </div>
  );
};

const cardStyle = {
  padding: "24px",

  borderRadius: "22px",

  background:
    "rgba(255,255,255,0.08)",

  border:
    "1px solid rgba(255,255,255,0.08)",

  backdropFilter: "blur(14px)",

  cursor: "pointer",

  transition: "0.3s ease",

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.2)",

  fontFamily: "Arial, sans-serif",
};

const topRow = {
  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",
};

const tag = {
  fontSize: "11px",

  letterSpacing: "2px",

  color: "#94a3b8",

  fontWeight: "600",
};

const arrowBox = {
  width: "34px",

  height: "34px",

  borderRadius: "12px",

  background:
    "rgba(255,255,255,0.08)",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  color: "white",
};

const title = {
  marginTop: "24px",

  marginBottom: "10px",

  color: "white",

  fontSize: "28px",
};

const description = {
  fontSize: "14px",

  color: "#cbd5e1",

  lineHeight: "1.7",

  minHeight: "60px",
};

const memberSection = {
  marginTop: "24px",

  paddingTop: "18px",

  borderTop:
    "1px solid rgba(255,255,255,0.08)",
};

const memberHeader = {
  display: "flex",

  alignItems: "center",

  gap: "8px",

  color: "#60a5fa",

  fontSize: "13px",

  fontWeight: "600",
};

const memberNames = {
  marginTop: "10px",

  fontSize: "13px",

  color: "#cbd5e1",

  lineHeight: "1.6",
};

const footer = {
  marginTop: "22px",

  fontSize: "12px",

  color: "#94a3b8",
};

export default ProjectCard;