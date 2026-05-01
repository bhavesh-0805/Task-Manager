import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  if (!project) return null;

  return (
    <div
      className="card"
      onClick={() => navigate(`/project/${project._id}`)}
      style={cardStyle}
    >
      {/* TITLE */}
      <h3 style={{ marginBottom: "5px" }}>
        {project.name}
      </h3>

      {/* DESCRIPTION */}
      <p style={{ fontSize: "13px", color: "#64748b" }}>
        {project.description || "No description"}
      </p>

      {/* MEMBERS */}
      <div style={{ marginTop: "10px" }}>
        <strong style={{ fontSize: "12px" }}>Members:</strong>

        <div style={{ fontSize: "12px", color: "#334155" }}>
          {project.members && project.members.length > 0
            ? project.members.map((m) => m.name).join(", ")
            : "No members"}
        </div>
      </div>

      {/* CREATED DATE */}
      <div style={{ marginTop: "10px", fontSize: "11px", color: "#94a3b8" }}>
        Created: {new Date(project.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

// basic style
const cardStyle = {
  border: "1px solid #e5e7eb",
  padding: "15px",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "0.2s",
};

export default ProjectCard;