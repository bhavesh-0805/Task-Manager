import { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });

  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // FILTERS
  const [filters, setFilters] = useState({
    title: "",
    project: "",
    assigned: "",
    status: "",
    dueDate: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔐 Protect route
  useEffect(() => {
    if (!token) {
      navigate("/", {
        state: { message: "Please login first" },
      });
    }
  }, [token, navigate]);

  // 🔥 Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const storedUser = JSON.parse(
          localStorage.getItem("user")
        );

        setUser(storedUser);

        const statsRes = await API.get(
          "/tasks/dashboard/stats"
        );

        setStats({
          total: statsRes.data?.total || 0,
          completed:
            statsRes.data?.completed || 0,
          pending:
            statsRes.data?.pending || 0,
          overdue:
            statsRes.data?.overdue || 0,
        });

        if (
          storedUser?.role === "Admin"
        ) {
          const allTaskRes =
            await API.get("/tasks/all");

          setAllTasks(
            allTaskRes.data.tasks || []
          );
        } else {
          const taskRes =
            await API.get("/tasks/my");

          setTasks(
            taskRes.data.tasks || []
          );
        }
      } catch (err) {
        console.error(err);

        if (
          err.response?.status === 401
        ) {
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
  }, [token, navigate]);

  const displayTasks =
    user?.role === "Admin"
      ? allTasks
      : tasks;

  // FILTER TASKS
  const filteredTasks =
    displayTasks.filter((task) => {
      const isOverdue =
        task.dueDate &&
        new Date(task.dueDate) <
        new Date() &&
        task.status !== "Completed";

      const displayStatus =
        isOverdue
          ? "Overdue"
          : task.status;

      return (
        task.title
          ?.toLowerCase()
          .includes(
            filters.title.toLowerCase()
          ) &&
        task.project?.name
          ?.toLowerCase()
          .includes(
            filters.project.toLowerCase()
          ) &&
        (
          task.assignedTo?.name || ""
        )
          .toLowerCase()
          .includes(
            filters.assigned.toLowerCase()
          ) &&
        displayStatus
          .toLowerCase()
          .includes(
            filters.status.toLowerCase()
          ) &&
        (filters.dueDate === "" ||
          (task.dueDate &&
            new Date(task.dueDate)
              .toISOString()
              .split("T")[0] ===
            filters.dueDate))
      );
    });

  const columnTemplate =
    user?.role === "Admin"
      ? "2fr 1fr 1fr 1fr"
      : "2fr 1fr 1fr";

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
            <p style={welcomeText}>
              WELCOME BACK
            </p>

            <h1 style={heading}>
              Dashboard
            </h1>

            <p style={subHeading}>
              Manage your projects and
              tasks efficiently,{" "}
              {user?.name}
            </p>
          </div>

          <button
            style={primaryBtn}
            onClick={() => navigate("/projects")}
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
            View Projects →
          </button>
        </div>

        {/* STATS */}
        <div style={statsGrid}>
          {[
            {
              label: "TOTAL TASKS",
              value: stats.total,
            },
            {
              label: "COMPLETED",
              value: stats.completed,
            },
            {
              label: "PENDING",
              value: stats.pending,
            },
            {
              label: "OVERDUE",
              value: stats.overdue,
            },
          ].map((item, i) => (
            <div
              key={i}
              style={statCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 25px 45px rgba(0,0,0,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(0,0,0,0.25)";
              }}
            >
              <p style={smallText}>
                {item.label}
              </p>

              <h2 style={statNumber}>
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        {/* TASK BOX */}
        <div style={taskBox}>
          {/* HEADER */}
          <div style={taskHeader}>
            <div>
              <h2
                style={{
                  margin: 0,
                  color: "white",
                }}
              >
                {user?.role === "Admin"
                  ? "All Tasks"
                  : "My Tasks"}
              </h2>

              <p
                style={{
                  color: "#94a3b8",
                }}
              >
                {
                  filteredTasks.length
                }{" "}
                Tasks Available
              </p>
            </div>
          </div>

          {/* FILTERS */}
          <div style={filterBox}>

            <input
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
              placeholder="🔍 Search title..."
              value={filters.title}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  title: e.target.value,
                })
              }
              style={filterInput}
            />

            <input
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
              placeholder="📁 Project name..."
              value={filters.project}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  project: e.target.value,
                })
              }
              style={filterInput}
            />

            {user?.role === "Admin" && (
              <input
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
                placeholder="👤 Assigned member..."
                value={filters.assigned}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    assigned: e.target.value,
                  })
                }
                style={filterInput}
              />
            )}

            <input
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
              type="date"
              value={filters.dueDate}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  dueDate: e.target.value,
                })
              }
              style={filterInput}
            />

            <select
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
              value={filters.status}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value,
                })
              }
              style={filterInput}
            >
              <option value="">
                📌 All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Overdue">
                Overdue
              </option>
            </select>


            <button
              onClick={() =>
                setFilters({
                  title: "",
                  project: "",
                  assigned: "",
                  status: "",
                  dueDate: "",
                })
              }
              style={clearBtn}
            >
              Clear
            </button>

          </div>

          {/* TABLE HEADER */}
          <div
            style={{
              ...tableHeader,
              gridTemplateColumns:
                columnTemplate,
            }}
          >
            <span>Title</span>

            {user?.role ===
              "Admin" && (
                <span>Assigned</span>
              )}

            <span>Due Date</span>
            <span>Status</span>
          </div>

          {/* TASKS */}
          {filteredTasks.map((t) => {
            const isOverdue =
              t.dueDate &&
              new Date(t.dueDate) <
              new Date() &&
              t.status !==
              "Completed";

            const displayStatus =
              isOverdue
                ? "Overdue"
                : t.status;

            return (
              <div
                key={t._id}
                style={{
                  ...taskItem,
                  gridTemplateColumns:
                    columnTemplate,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "transparent";
                }}
              >
                {/* TITLE */}
                <div
                  style={{
                    overflow:
                      "hidden",
                  }}
                >
                  <strong
                    style={
                      titleStyle
                    }
                  >
                    {t.title}
                  </strong>

                  <p style={subText}>
                    {
                      t.project
                        ?.name
                    }
                  </p>
                </div>

                {/* ASSIGNED */}
                {user?.role ===
                  "Admin" && (
                    <span
                      style={{
                        color:
                          "#cbd5e1",
                      }}
                    >
                      {t.assignedTo
                        ?.name ||
                        "Unassigned"}
                    </span>
                  )}

                {/* DATE */}
                <span
                  style={{
                    color:
                      "#cbd5e1",
                  }}
                >
                  {t.dueDate
                    ? new Date(
                      t.dueDate
                    ).toLocaleDateString()
                    : "-"}
                </span>

                {/* STATUS */}
                <span
                  style={statusBadge(
                    displayStatus
                  )}
                >
                  {displayStatus}
                </span>
              </div>
            );
          })}
        </div>
      </div>
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

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "40px",
  position: "relative",
  zIndex: 2,
};

const welcomeText = {
  letterSpacing: "2px",
  fontSize: "12px",
  color: "#94a3b8",
  marginBottom: "8px",
};

const heading = {
  fontSize: "58px",
  margin: 0,
  color: "white",
  fontWeight: "800",
  letterSpacing: "-2px",
  textShadow: "0 5px 20px rgba(0,0,0,0.25)",
};

const subHeading = {
  color: "#cbd5e1",
  marginTop: "10px",
};

const primaryBtn = {
  padding: "16px 26px",
  background:
    "linear-gradient(135deg, #2563eb, #4f46e5)",
  color: "white",
  border: "none",
  borderRadius: "16px",
  fontSize: "15px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow:
    "0 10px 25px rgba(37,99,235,0.3)",
  transition: "all 0.3s ease",
  position: "relative",
  zIndex: 2,
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px,1fr))",
  gap: "20px",
  marginBottom: "35px",
};

const statCard = {
  padding: "30px",
  borderRadius: "26px",
  background:
    "rgba(255,255,255,0.08)",
  border:
    "1px solid rgba(255,255,255,0.1)",
  backdropFilter: "blur(18px)",
  boxShadow:
    "0 20px 40px rgba(0,0,0,0.25)",
  transition: "all 0.3s ease",
};

const statNumber = {
  color: "white",
  fontSize: "42px",
  margin: "10px 0 0",
};

const taskBox = {
  borderRadius: "28px",
  overflow: "hidden",
  background:
    "rgba(255,255,255,0.08)",
  border:
    "1px solid rgba(255,255,255,0.1)",
  backdropFilter: "blur(18px)",
  boxShadow:
    "0 25px 50px rgba(0,0,0,0.25)",
};

const taskHeader = {
  padding: "25px 30px",
  borderBottom:
    "1px solid rgba(255,255,255,0.08)",
};

const filterBox = {
  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",

  gap: "18px",

  padding: "24px 30px",

  background:
    "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",

  borderBottom:
    "1px solid rgba(255,255,255,0.08)",

  backdropFilter: "blur(12px)",

  alignItems: "stretch",
};

const filterInput = {
  width: "100%",
  minWidth: "0",
  padding: "15px 16px",
  borderRadius: "18px",
  border:
    "1px solid rgba(255,255,255,0.08)",
  background:
    "rgba(15,23,42,0.6)",
  color: "white",
  outline: "none",
  fontSize: "14px",
  fontWeight: "500",
  boxSizing: "border-box",
  backdropFilter: "blur(10px)",
  transition: "all 0.3s ease",
};

const tableHeader = {
  display: "grid",
  padding: "18px 30px",
  background:
    "rgba(255,255,255,0.05)",
  color: "#94a3b8",
  fontWeight: "600",
};

const taskItem = {
  display: "grid",
  padding: "22px 30px",
  borderTop:
    "1px solid rgba(255,255,255,0.06)",
  alignItems: "center",
  transition: "all 0.25s ease",
};

const titleStyle = {
  display: "block",
  color: "white",
  fontSize: "16px",
  marginBottom: "6px",
};

const subText = {
  fontSize: "13px",
  color: "#94a3b8",
};

const smallText = {
  fontSize: "12px",
  color: "#94a3b8",
  letterSpacing: "1px",
};

const clearBtn = {
  padding: "12px 20px",

  borderRadius: "14px",

  border:
    "1px solid rgba(239,68,68,0.2)",

  background:
    "rgba(239,68,68,0.12)",

  color: "#f87171",

  fontSize: "14px",

  fontWeight: "600",

  cursor: "pointer",

  transition: "0.3s ease",

  height: "48px",

  width: "100%",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  boxSizing: "border-box",

  marginTop: "4px",
};

const statusBadge = (status) => ({
  padding: "8px 14px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: "600",
  width: "fit-content",

  background:
    status === "Completed"
      ? "rgba(34,197,94,0.18)"
      : status ===
        "In Progress"
        ? "rgba(59,130,246,0.18)"
        : status === "Overdue"
          ? "rgba(239,68,68,0.18)"
          : "rgba(250,204,21,0.18)",

  color:
    status === "Completed"
      ? "#4ade80"
      : status ===
        "In Progress"
        ? "#60a5fa"
        : status === "Overdue"
          ? "#f87171"
          : "#fde047",
});

export default Dashboard;