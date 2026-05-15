import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";

const StatsCard = ({
  title,
  value,
  type,
}) => {
  const getStyles = () => {
    switch (type) {
      case "total":
        return {
          color: "#60a5fa",
          bg: "rgba(59,130,246,0.15)",
          icon: <FaTasks />,
        };

      case "completed":
        return {
          color: "#4ade80",
          bg: "rgba(34,197,94,0.15)",
          icon: <FaCheckCircle />,
        };

      case "pending":
        return {
          color: "#facc15",
          bg: "rgba(250,204,21,0.15)",
          icon: <FaClock />,
        };

      case "overdue":
        return {
          color: "#f87171",
          bg: "rgba(239,68,68,0.15)",
          icon: (
            <FaExclamationTriangle />
          ),
        };

      default:
        return {
          color: "#60a5fa",
          bg: "rgba(59,130,246,0.15)",
          icon: <FaTasks />,
        };
    }
  };

  const styles = getStyles();

  return (
    <div style={cardStyle}>
      {/* TOP */}
      <div style={topRow}>
        <div
          style={{
            ...iconBox,
            background: styles.bg,
            color: styles.color,
          }}
        >
          {styles.icon}
        </div>

        <span style={titleStyle}>
          {title}
        </span>
      </div>

      {/* VALUE */}
      <h2
        style={{
          color: "white",
          marginTop: "25px",
          fontSize: "42px",
        }}
      >
        {value ?? 0}
      </h2>

      {/* FOOTER */}
      <p style={footerText}>
        Updated just now
      </p>
    </div>
  );
};

const cardStyle = {
  padding: "24px",

  borderRadius: "24px",

  minWidth: "220px",

  background:
    "rgba(255,255,255,0.08)",

  border:
    "1px solid rgba(255,255,255,0.08)",

  backdropFilter: "blur(14px)",

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.2)",

  transition: "0.3s ease",

  fontFamily: "Arial, sans-serif",
};

const topRow = {
  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",
};

const iconBox = {
  width: "46px",

  height: "46px",

  borderRadius: "16px",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  fontSize: "18px",
};

const titleStyle = {
  fontSize: "13px",

  letterSpacing: "1px",

  color: "#94a3b8",

  fontWeight: "600",

  textTransform: "uppercase",
};

const footerText = {
  marginTop: "10px",

  fontSize: "12px",

  color: "#64748b",
};

export default StatsCard;