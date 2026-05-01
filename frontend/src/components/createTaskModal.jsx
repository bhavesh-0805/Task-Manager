import API from "../utils/api"; 
import { useState } from "react";

const CreateTaskModal = ({ onClose, members, projectId }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [assignee, setAssignee] = useState(""); // store user _id
  const [date, setDate] = useState("");

  const handleSubmit = async () => {
    if (!title || !assignee) {
      alert("Title and Assignee are required");
      return;
    }

    try {
      console.log("Creating task..."); 

      const res = await API.post("/tasks/create", {
        title,
        description: desc,
        project: projectId,   
        assignedTo: assignee,   
        dueDate: date,
      });

      console.log("TASK CREATED:", res.data); 

      alert("Task created successfully");

      onClose();

    } catch (err) {
      console.log("ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "12px", color: "#64748b" }}>NEW</p>
            <h2>Create Task</h2>
          </div>

          <span onClick={onClose} style={{ cursor: "pointer" }}>
            ✕
          </span>
        </div>

        {/* TITLE */}
        <label>TITLE</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />

        {/* DESCRIPTION */}
        <label style={{ marginTop: "15px", display: "block" }}>
          DESCRIPTION
        </label>
        <textarea
          rows="4"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />

        {/* ASSIGNEE + DATE */}
        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>

          {/* ASSIGNEE */}
          <div style={{ flex: 1 }}>
            <label>ASSIGNEE</label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="">Select Member</option>

              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div style={{ flex: 1 }}>
            <label>DUE DATE</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div style={buttonRow}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Create Task</button>
        </div>
      </div>
    </div>
  );
};

// styles
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backdropFilter: "blur(4px)",
  background: "rgba(0,0,0,0.2)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle = {
  width: "650px",
  background: "white",
  borderRadius: "6px",
  padding: "30px",
};

const buttonRow = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "25px",
  gap: "10px",
};

export default CreateTaskModal;