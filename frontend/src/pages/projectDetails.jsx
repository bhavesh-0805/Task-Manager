import Navbar from "../components/navbar";
import CreateTaskModal from "../components/createTaskModal";
import AddMemberModal from "../components/addMemberModal";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaTrash,
  FaPlus,
  FaArrowLeft,
} from "react-icons/fa";

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

  const [showTaskModal, setShowTaskModal] =
    useState(false);

  const [showMemberModal, setShowMemberModal] =
    useState(false);

  // Protect route
  useEffect(() => {
    if (!token) {
      navigate("/", {
        state: {
          message: "Please login first",
        },
      });
    }
  }, [token, navigate]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const projRes = await API.get(
          `/projects/single/${id}`
        );

        setProject(projRes.data.project);

        setMembers(
          projRes.data.project?.members || []
        );

        const taskRes = await API.get(
          `/tasks/${id}`
        );

        setTasks(taskRes.data.tasks || []);
      } catch (err) {
        console.log(err);

        if (err.response?.status === 401) {
          localStorage.clear();

          navigate("/", {
            state: {
              message:
                "Session expired. Login again.",
            },
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
    if (!window.confirm("Delete this project?"))
      return;

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
    if (!window.confirm("Delete this task?"))
      return;

    try {
      await API.delete(
        `/tasks/delete/${taskId}`
      );

      setTasks((prev) =>
        prev.filter((t) => t._id !== taskId)
      );
    } catch (err) {
      console.log(err);
      alert("Failed to delete task");
    }
  };

  // REMOVE MEMBER
  const handleRemoveMember = async (
    memberId
  ) => {
    try {
      await API.put(
        `/projects/remove-member/${id}`,
        { memberId }
      );

      setMembers((prev) =>
        prev.filter((m) => m._id !== memberId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  // UPDATE STATUS
  const handleStatusChange = async (
    taskId,
    newStatus
  ) => {
    try {
      await API.put(
        `/tasks/update/${taskId}`,
        { status: newStatus }
      );

      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId
            ? { ...t, status: newStatus }
            : t
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    "Pending",
    "In Progress",
    "Completed",
    "Overdue",
  ];

  if (loading)
    return (
      <p style={{ padding: "40px" }}>
        Loading...
      </p>
    );

  if (!project)
    return (
      <p style={{ padding: "40px" }}>
        Project not found
      </p>
    );

  return (
    <>
      <Navbar />

      <div style={page}>
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
            pointerEvents: "none",
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
            pointerEvents: "none",
          }}
        />
        {/* BACK */}
        <button
          onClick={() => navigate("/projects")}
          style={backBtn}
          onMouseEnter={(e) => {
            e.target.style.transform =
              "translateY(-3px)";
            e.target.style.background =
              "rgba(255,255,255,0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform =
              "translateY(0px)";
            e.target.style.background =
              "rgba(255,255,255,0.06)";
          }}
        >
          <FaArrowLeft />
          Back to Projects
        </button>

        {/* HEADER */}
        <div style={header}>
          <div>
            <p style={smallText}>PROJECT SPACE</p>

            <h1 style={title}>
              {project.name}
            </h1>

            <p style={desc}>
              {project.description}
            </p>
          </div>

          {user?.role === "Admin" && (
            <div style={btnRow}>
              <button
                onMouseEnter={(e) => {
                  e.target.style.transform =
                    "translateY(-3px)";
                }}

                onMouseLeave={(e) => {
                  e.target.style.transform =
                    "translateY(0px)";
                }}
                style={dangerBtn}
                onClick={handleDeleteProject}
              >
                <FaTrash color="#ffffff" />
                Delete
              </button>

              <button
                onMouseEnter={(e) => {
                  e.target.style.transform =
                    "translateY(-3px)";
                }}

                onMouseLeave={(e) => {
                  e.target.style.transform =
                    "translateY(0px)";
                }}
                style={secondaryBtn}
                onClick={() =>
                  setShowMemberModal(true)
                }
              >
                <FaPlus />
                Add Member
              </button>

              <button
                onMouseEnter={(e) => {
                  e.target.style.transform =
                    "translateY(-3px)";
                }}

                onMouseLeave={(e) => {
                  e.target.style.transform =
                    "translateY(0px)";
                }}
                style={primaryBtn}
                onClick={() =>
                  setShowTaskModal(true)
                }
              >
                <FaPlus />
                New Task
              </button>
            </div>
          )}
        </div>

        {/* MEMBERS */}
        <div style={memberSection}>
          <div style={memberHeader}>
            <FaUsers color="white" />

            <h2 style={{ color: "white" }}>
              Team Members
            </h2>
          </div>

          <div style={memberList}>
            {members.map((m) => (
              <div
                key={m._id}
                style={memberCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 18px 35px rgba(0,0,0,0.28)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 25px rgba(0,0,0,0.18)";
                }}
              >
                <div style={avatar}>
                  {m.name?.charAt(0)}
                </div>

                <div style={{ flex: 1 }}>
                  <strong
                    style={{ color: "white" }}
                  >
                    {m.name}
                  </strong>

                  <p style={memberEmail}>
                    {m.email}
                  </p>
                </div>

                {user?.role === "Admin" && (
                  <span
                    style={removeBtn}
                    onClick={() =>
                      handleRemoveMember(m._id)
                    }
                  >
                    ✕
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* TASK HEADER */}
        <div style={taskHeading}>
          <h2 style={{ color: "white" }}>
            Tasks ({tasks.length})
          </h2>
        </div>

        {/* KANBAN */}
        <div style={kanban}>
          {columns.map((col) => {
            const filtered = tasks.filter(
              (t) => {
                const isOverdue =
                  t.dueDate &&
                  new Date(t.dueDate) <
                  new Date() &&
                  t.status !== "Completed";

                if (col === "Overdue")
                  return isOverdue;

                if (col === "Pending")
                  return (
                    t.status === "Pending" &&
                    !isOverdue
                  );

                if (col === "In Progress")
                  return (
                    t.status ===
                    "In Progress" &&
                    !isOverdue
                  );

                if (col === "Completed")
                  return (
                    t.status === "Completed"
                  );

                return false;
              }
            );

            return (
              <div
                key={col}
                style={column}
              >
                {/* COLUMN HEADER */}
                <div
                  style={{
                    ...columnHeader,
                    background:
                      col === "Pending"
                        ? "rgba(250,204,21,0.15)"
                        : col ===
                          "In Progress"
                          ? "rgba(59,130,246,0.15)"
                          : col ===
                            "Completed"
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(239,68,68,0.15)",

                    color:
                      col === "Pending"
                        ? "#fde047"
                        : col ===
                          "In Progress"
                          ? "#60a5fa"
                          : col ===
                            "Completed"
                            ? "#4ade80"
                            : "#f87171",
                  }}
                >
                  <span>{col}</span>

                  <span>
                    {filtered.length}
                  </span>
                </div>

                {/* TASKS */}
                {filtered.map((t) => {
                  const isOverdue =
                    t.dueDate &&
                    new Date(t.dueDate) <
                    new Date() &&
                    t.status !== "Completed";

                  return (
                    <div
                      key={t._id}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(-4px)";
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(0px)";
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.06)";
                      }}
                      style={{
                        ...taskCard,
                        border: isOverdue
                          ? "1px solid rgba(239,68,68,0.5)"
                          : "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {/* DELETE */}
                      {user?.role ===
                        "Admin" && (
                          <span
                            onClick={() =>
                              handleDeleteTask(
                                t._id
                              )
                            }
                            style={
                              deleteTaskBtn
                            }
                          >
                            <FaTrash
                              color="#ef4444"
                              size={14}
                            />
                          </span>
                        )}

                      <h4
                        style={{
                          color: "white",
                        }}
                      >
                        {t.title}
                      </h4>

                      <p style={taskDesc}>
                        {t.description}
                      </p>

                      <div style={taskFooter}>
                        <span>
                          👤{" "}
                          {t.assignedTo
                            ?.name ||
                            "Unassigned"}
                        </span>

                        <span>
                          📅{" "}
                          {t.dueDate
                            ? new Date(
                              t.dueDate
                            ).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>

                      {!isOverdue && (
                        <select
                          value={t.status}
                          onChange={(e) =>
                            handleStatusChange(
                              t._id,
                              e.target.value
                            )
                          }
                          style={selectStyle}
                          onFocus={(e) => {
                            e.target.style.border =
                              "1px solid rgba(96,165,250,0.8)";
                            e.target.style.boxShadow =
                              "0 0 0 4px rgba(37,99,235,0.18)";
                          }}

                          onBlur={(e) => {
                            e.target.style.border =
                              "1px solid rgba(255,255,255,0.08)";
                            e.target.style.boxShadow = "none";
                          }}
                        >
                          <option>
                            Pending
                          </option>

                          <option>
                            In Progress
                          </option>

                          <option>
                            Completed
                          </option>
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
      {showTaskModal &&
        user?.role === "Admin" && (
          <CreateTaskModal
            onClose={() =>
              setShowTaskModal(false)
            }

            members={members}

            projectId={id}

            onTaskCreated={(newTask) => {
              setTasks((prev) => [
                newTask,
                ...prev,
              ]);
            }}
          />
        )}

      {showMemberModal &&
        user?.role === "Admin" && (
          <AddMemberModal
            onClose={() =>
              setShowMemberModal(false)
            }
            currentMembers={members}
            projectId={id}
            onAdd={(user) => {
              setMembers((prev) => [
                ...prev,
                user,
              ]);
            }}
          />
        )}
    </>
  );
};

const page = {
  minHeight: "100vh",
  padding: "50px",
  background:
    "radial-gradient(circle at top left, #1e3a8a 0%, transparent 30%), radial-gradient(circle at bottom right, #2563eb 0%, transparent 35%), linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e40af 100%)",
  fontFamily: "Arial, sans-serif",
  position: "relative",
  overflow: "hidden",
};

const backBtn = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "35px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#e2e8f0",
  cursor: "pointer",
  fontSize: "14px",
  padding: "14px 18px",
  borderRadius: "16px",
  backdropFilter: "blur(12px)",
  transition: "all 0.3s ease",
  position: "relative",
  zIndex: 2,
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "45px",
  position: "relative",
  zIndex: 2,
};

const title = {
  fontSize: "58px",
  color: "white",
  margin: "10px 0",
  fontWeight: "800",
  letterSpacing: "-2px",
  textShadow: "0 5px 20px rgba(0,0,0,0.25)",
};

const desc = {
  color: "#cbd5e1",
  maxWidth: "760px",
  lineHeight: "1.8",
  fontSize: "16px",
};

const smallText = {
  fontSize: "12px",
  letterSpacing: "2px",
  color: "#94a3b8",
};

const btnRow = {
  display: "flex",
  gap: "12px",
};

const primaryBtn = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background:
    "linear-gradient(135deg, #2563eb, #4f46e5)",
  color: "white",
  border: "none",
  padding: "15px 20px",
  borderRadius: "16px",
  cursor: "pointer",
  fontWeight: "700",
  transition: "all 0.3s ease",
  boxShadow:
    "0 12px 30px rgba(37,99,235,0.35)",
};

const secondaryBtn = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  border: "1px solid rgba(255,255,255,0.1)",
  padding: "15px 20px",
  borderRadius: "16px",
  cursor: "pointer",
  backdropFilter: "blur(12px)",
  transition: "all 0.3s ease",
};

const dangerBtn = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background:
    "linear-gradient(135deg, #ef4444, #dc2626)",
  color: "white",
  border: "none",
  padding: "15px 20px",
  borderRadius: "16px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow:
    "0 10px 25px rgba(239,68,68,0.35)",
};

const memberSection = {
  marginBottom: "35px",
};

const memberHeader = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "18px",
};

const memberList = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
};

const memberCard = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "18px",
  borderRadius: "22px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(16px)",
  minWidth: "280px",
  transition: "all 0.3s ease",
  boxShadow:
    "0 12px 25px rgba(0,0,0,0.18)",
};

const avatar = {
  width: "46px",
  height: "46px",
  borderRadius: "14px",
  background:
    "linear-gradient(135deg, #2563eb, #1d4ed8)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  fontWeight: "bold",
  fontSize: "18px",
};

const memberEmail = {
  fontSize: "13px",
  color: "#94a3b8",
  marginTop: "4px",
};

const removeBtn = {
  color: "#f87171",
  cursor: "pointer",
  fontWeight: "bold",
};

const taskHeading = {
  marginBottom: "20px",
};

const kanban = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
};

const column = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "28px",
  padding: "20px",
  backdropFilter: "blur(18px)",
  boxShadow:
    "0 20px 40px rgba(0,0,0,0.22)",
};

const columnHeader = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 16px",
  borderRadius: "14px",
  marginBottom: "18px",
  fontWeight: "600",
};

const taskCard = {
  position: "relative",
  background: "rgba(255,255,255,0.06)",
  borderRadius: "22px",
  padding: "20px",
  marginBottom: "16px",
  transition: "all 0.3s ease",
  backdropFilter: "blur(12px)",
};

const deleteTaskBtn = {
  position: "absolute",
  top: "10px",
  right: "12px",
  cursor: "pointer",
};

const taskDesc = {
  color: "#cbd5e1",
  fontSize: "14px",
  lineHeight: "1.6",
};

const taskFooter = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "16px",
  fontSize: "12px",
  color: "#94a3b8",
};

const selectStyle = {
  width: "100%",
  marginTop: "16px",
  padding: "14px",
  borderRadius: "14px",
  background: "rgba(15,23,42,0.9)",
  color: "white",
  border:
    "1px solid rgba(255,255,255,0.08)",
  outline: "none",
  transition: "all 0.3s ease",
};

export default ProjectDetails;