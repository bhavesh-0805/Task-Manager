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

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔐 Protect route
  useEffect(() => {
    if (!token) {
      navigate("/", { state: { message: "Please login first" } });
    }
  }, [token, navigate]);

  // 🔥 Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);

        const statsRes = await API.get("/tasks/dashboard/stats");

        setStats({
          total: statsRes.data?.total || 0,
          completed: statsRes.data?.completed || 0,
          pending: statsRes.data?.pending || 0,
          overdue: statsRes.data?.overdue || 0,
        });

        if (storedUser?.role === "Admin") {
          const allTaskRes = await API.get("/tasks/all");
          setAllTasks(allTaskRes.data.tasks || []);
        } else {
          const taskRes = await API.get("/tasks/my");
          setTasks(taskRes.data.tasks || []);
        }
      } catch (err) {
        console.error(err);

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
  }, [token, navigate]);

  const displayTasks =
    user?.role === "Admin" ? allTasks : tasks;

  // ✅ COLUMN TEMPLATE
  const columnTemplate =
    user?.role === "Admin"
      ? "2fr 1fr 1fr 1fr"
      : "2fr 1fr 1fr";

  return (
    <>
      <Navbar />

      <div style={{ padding: "40px 60px" }}>
        
        {/* HEADER */}
        <div style={headerRow}>
          <div>
            <h1 style={{ fontSize: "48px" }}>Dashboard</h1>
            <p>Welcome back, {user?.name}</p>
          </div>

          <button style={primaryBtn} onClick={() => navigate("/projects")}>
            View Projects →
          </button>
        </div>

        {/* STATS */}
        <div style={statsGrid}>
          {[
            { label: "TOTAL TASKS", value: stats.total },
            { label: "COMPLETED", value: stats.completed },
            { label: "PENDING", value: stats.pending },
            { label: "OVERDUE", value: stats.overdue },
          ].map((item, i) => (
            <div key={i} style={statItem}>
              <p style={smallText}>{item.label}</p>
              <h2>{item.value}</h2>
            </div>
          ))}
        </div>

        {/* TASKS */}
        <div style={taskBox}>
          <div style={taskHeader}>
            <h3>
              {user?.role === "Admin" ? "All Tasks" : "My Tasks"}
            </h3>
            <p>{displayTasks.length} ITEMS</p>
          </div>

          {/* COLUMN HEADERS */}
          <div
            style={{
              ...tableHeader,
              gridTemplateColumns: columnTemplate,
            }}
          >
            <span>Title</span>
            {user?.role === "Admin" && <span>Assigned</span>}
            <span>Due Date</span>
            <span>Status</span>
          </div>

          {/* TASK LIST */}
          {displayTasks.map((t) => {
            const isOverdue =
              t.dueDate &&
              new Date(t.dueDate) < new Date() &&
              t.status !== "Completed";

            const displayStatus = isOverdue ? "Overdue" : t.status;

            return (
              <div
                key={t._id}
                style={{
                  ...taskItem,
                  gridTemplateColumns: columnTemplate,
                }}
              >
                
                {/* TITLE */}
                <div style={{ overflow: "hidden" }}>
                  <strong style={titleStyle}>{t.title}</strong>
                  <p style={subText}>{t.project?.name}</p>
                </div>

                {/* ASSIGNED */}
                {user?.role === "Admin" && (
                  <span>{t.assignedTo?.name || "Unassigned"}</span>
                )}

                {/* DATE */}
                <span>
                  {t.dueDate
                    ? new Date(t.dueDate).toLocaleDateString()
                    : "-"}
                </span>

                {/* STATUS */}
                <span style={statusBadge(displayStatus)}>
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

//////////////////////////////////////////////////////////
// 🎨 STYLES
//////////////////////////////////////////////////////////

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const primaryBtn = {
  padding: "4px 10px",
  background: "#1d4ed8",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "12px",
  cursor: "pointer",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: "10px",
};

const statItem = {
  padding: "20px",
  background: "white",
  border: "1px solid #ddd",
};

const taskBox = {
  marginTop: "30px",
  border: "1px solid #ddd",
};

const taskHeader = {
  padding: "15px",
  borderBottom: "1px solid #ddd",
  display: "flex",
  justifyContent: "space-between",
};

const tableHeader = {
  display: "grid",
  padding: "10px 20px",
  background: "#f1f5f9",
  fontWeight: "bold",
};

const taskItem = {
  display: "grid",
  padding: "15px 20px",
  borderTop: "1px solid #eee",
  alignItems: "center",
};

const titleStyle = {
  display: "block",
  whiteSpace: "normal",
  wordBreak: "break-word",
};

const statusBadge = (status) => ({
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  width: "fit-content",
  background:
    status === "Completed"
      ? "#dcfce7"
      : status === "In Progress"
      ? "#dbeafe"
      : status === "Overdue"
      ? "#fee2e2"
      : "#fef9c3",
});

const smallText = {
  fontSize: "12px",
  color: "#64748b",
};

const subText = {
  fontSize: "12px",
  color: "#64748b",
};

export default Dashboard;