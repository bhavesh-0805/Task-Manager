const StatsCard = ({ title, value, type }) => {
  const getColor = () => {
    switch (type) {
      case "total":
        return "#0f172a";
      case "completed":
        return "#16a34a";
      case "pending":
        return "#f59e0b";
      case "overdue":
        return "#dc2626";
      default:
        return "#0f172a";
    }
  };

  return (
    <div style={cardStyle}>
      <p style={{ fontSize: "13px", color: "#64748b" }}>
        {title}
      </p>

      <h2 style={{ color: getColor(), marginTop: "5px" }}>
        {value ?? 0}
      </h2>
    </div>
  );
};

const cardStyle = {
  border: "1px solid #e5e7eb",
  padding: "15px",
  borderRadius: "6px",
  minWidth: "120px",
};

export default StatsCard;