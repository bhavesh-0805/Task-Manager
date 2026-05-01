import Navbar from "../components/navbar";
import CreateTaskModal from "../components/createTaskModal";
import AddMemberModal from "../components/addMemberModal";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);

  // Protect route
  useEffect(() => {
    if (!token) {
      navigate("/", { state: { message: "Please login first" } });
    }
  }, [token, navigate]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const projRes = await API.get(`/projects/single/${id}`);
        setProject(projRes.data.project);
        setMembers(projRes.data.project?.members || []);

        const taskRes = await API.get(`/tasks/${id}`);
        setTasks(taskRes.data.tasks || []);
      } catch (err) {
        console.log(err);

        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/", {
            state: { message: "Session expired. Login again." },
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [id, token, navigate]);

  // DELETE PROJECT
  const handleDeleteProject = async () => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await API.delete(`/projects/delete/${id}`);
      alert("Project deleted");
      navigate("/projects");
    } catch (err) {
      console.log(err);
      alert("Failed to delete project");
    }
  };

  // DELETE TASK 
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await API.delete(`/tasks/delete/${taskId}`);

      // update UI instantly
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.log(err);
      alert("Failed to delete task");
    }
  };

  // REMOVE MEMBER
  const handleRemoveMember = async (memberId) => {
    try {
      await API.put(`/projects/remove-member/${id}`, { memberId });
      setMembers((prev) => prev.filter((m) => m._id !== memberId));
    } catch (err) {
      console.log(err);
    }
  };

  // UPDATE STATUS
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/update/${taskId}`, { status: newStatus });

      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId ? { ...t, status: newStatus } : t
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const columns = ["Pending", "In Progress", "Completed", "Overdue"];

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;
  if (!project) return <p style={{ padding: "40px" }}>Project not found</p>;

  return (
    <>
      <Navbar />

      <div style={page}>
        {/* BACK */}
        <p onClick={() => navigate("/projects")} style={backBtn}>
          ← Projects
        </p>

        {/* HEADER */}
        <div style={header}>
          <div>
            <p style={smallText}>PROJECT</p>
            <h1 style={title}>{project.name}</h1>
            <p style={desc}>{project.description}</p>
          </div>

          {user?.role === "Admin" && (
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={dangerBtn} onClick={handleDeleteProject}>
                🗑 Delete Project
              </button>

              <button
                style={secondaryBtn}
                onClick={() => setShowMemberModal(true)}
              >
                + Add Member
              </button>

              <button
                style={primaryBtn}
                onClick={() => setShowTaskModal(true)}
              >
                + New Task
              </button>
            </div>
          )}
        </div>

        {/* MEMBERS */}
        <div style={memberList}>
          {members.map((m) => (
            <div key={m._id} style={memberCard}>
              <div style={avatar}>{m.name?.charAt(0)}</div>

              <div style={{ flex: 1 }}>
                <strong>{m.name}</strong>
                <p style={memberEmail}>{m.email}</p>
              </div>

              {user?.role === "Admin" && (
                <span
                  style={removeBtn}
                  onClick={() => handleRemoveMember(m._id)}
                >
                  ✕
                </span>
              )}
            </div>
          ))}
        </div>

        {/* TASK HEADER */}
        <h2 style={{ marginTop: "30px" }}>Tasks ({tasks.length})</h2>

        {/* KANBAN */}
        <div style={kanban}>
          {columns.map((col) => {
            const filtered = tasks.filter((t) => {
              const isOverdue =
                t.dueDate &&
                new Date(t.dueDate) < new Date() &&
                t.status !== "Completed";

              if (col === "Overdue") return isOverdue;
              if (col === "Pending") return t.status === "Pending" && !isOverdue;
              if (col === "In Progress") return t.status === "In Progress" && !isOverdue;
              if (col === "Completed") return t.status === "Completed";

              return false;
            });

            return (
              <div key={col} style={column}>
                <div
                  style={{
                    ...columnHeader,
                    background:
                      col === "Pending"
                        ? "#fef9c3"
                        : col === "In Progress"
                          ? "#dbeafe"
                          : col === "Completed"
                            ? "#dcfce7"
                            : "#fee2e2",
                    color:
                      col === "Pending"
                        ? "#854d0e"
                        : col === "In Progress"
                          ? "#1e40af"
                          : col === "Completed"
                            ? "#166534"
                            : "#991b1b",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  <span>{col.toUpperCase()}</span>
                  <span>{filtered.length}</span>
                </div>

                {filtered.map((t) => {
                  const isOverdue =
                    t.dueDate &&
                    new Date(t.dueDate) < new Date() &&
                    t.status !== "Completed";

                  return (
                    <div
                      key={t._id}
                      style={{
                        ...taskCard,
                        position: "relative",
                        border: isOverdue ? "1px solid red" : taskCard.border,
                      }}
                    >
                      {/* DELETE TASK */}
                      {user?.role === "Admin" && (
                        <span
                          onClick={() => handleDeleteTask(t._id)}
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "10px",
                            cursor: "pointer",
                            color: "red",
                            fontWeight: "bold",
                          }}
                        >
                          🗑
                        </span>
                      )}

                      <h4>{t.title}</h4>
                      <p style={taskDesc}>{t.description}</p>

                      <div style={taskFooter}>
                        <span>👤 {t.assignedTo?.name || "Unassigned"}</span>
                        <span>
                          📅{" "}
                          {t.dueDate
                            ? new Date(t.dueDate).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>

                      {!isOverdue && (
                        <select
                          value={t.status}
                          onChange={(e) =>
                            handleStatusChange(t._id, e.target.value)
                          }
                          style={selectStyle}
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* MODALS */}
      {showTaskModal && user?.role === "Admin" && (
        <CreateTaskModal
          onClose={() => setShowTaskModal(false)}
          members={members}
          projectId={id}
        />
      )}

      {showMemberModal && user?.role === "Admin" && (
        <AddMemberModal
          onClose={() => setShowMemberModal(false)}
          currentMembers={members}
          projectId={id}
          onAdd={(user) => {
            setMembers((prev) => [...prev, user]);
          }}
        />
      )}
    </>
  );
};

export default ProjectDetails;


const page = {
  padding: "40px 60px",
  background: "#f8fafc",
  minHeight: "100vh",
};

const backBtn = {
  cursor: "pointer",
  marginBottom: "20px",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const title = {
  fontSize: "42px",
  margin: "10px 0",
};

const desc = {
  color: "#64748b",
};

const smallText = {
  fontSize: "12px",
  letterSpacing: "2px",
  color: "#64748b",
};

const primaryBtn = {
  background: "#1d4ed8",
  color: "white",
  border: "none",
  padding: "10px 16px",
};

const secondaryBtn = {
  background: "white",
  border: "1px solid #cbd5f5",
  padding: "10px 16px",
  color: "#1d4ed8",
};

const dangerBtn = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "10px 16px",
};

const memberList = {
  display: "flex",
  gap: "15px",
  marginTop: "15px",
};

const memberCard = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  border: "1px solid #e5e7eb",
  padding: "10px",
};

const avatar = {
  width: "35px",
  height: "35px",
  background: "#e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
};

const memberEmail = {
  fontSize: "12px",
  color: "#64748b",
};

const removeBtn = {
  color: "#ef4444",
  cursor: "pointer",
};

const kanban = {
  display: "flex",
  gap: "20px",
  marginTop: "20px",
};

const column = {
  flex: 1,
  background: "white",
  border: "1px solid #e5e7eb",
  padding: "15px",
};

const columnHeader = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "12px",
};

const taskCard = {
  border: "1px solid #e5e7eb",
  padding: "12px",
  marginBottom: "10px",
};

const taskDesc = {
  fontSize: "14px",
  color: "#64748b",
};

const taskFooter = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "12px",
};

const selectStyle = {
  width: "100%",
  marginTop: "10px",
};