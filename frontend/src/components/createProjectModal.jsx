import { useEffect, useState } from "react";
import API from "../utils/api";

const CreateProjectModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await API.get("/users", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        setUsers(data.users);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };

    fetchUsers();
  }, []);

  // Filter users
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  // Add member
  const addMember = (user) => {
    if (!selectedMembers.some((m) => m._id === user._id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  // Remove member
  const removeMember = (id) => {
    setSelectedMembers(selectedMembers.filter((m) => m._id !== id));
  };

  // Create project
  const handleCreate = async () => {
    if (!name) {
      alert("Project name is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/projects/create",
        {
          name,
          description: desc,
          members: selectedMembers.map((m) => m._id),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      onClose();
      window.location.reload(); // quick fix
    } catch (err) {
      console.log("ERROR:", err.response?.data); 
      alert(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "12px", color: "#64748b" }}>NEW</p>
            <h2>Create Project</h2>
          </div>

          <span onClick={onClose} style={{ cursor: "pointer" }}>
            ✕
          </span>
        </div>

        {/* NAME */}
        <label>NAME</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
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

        {/* MEMBERS */}
        <label style={{ marginTop: "15px", display: "block" }}>
          MEMBERS
        </label>

        {/* SEARCH */}
        <input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />

        {/* USER LIST */}
        <div style={{ marginTop: "10px", maxHeight: "120px", overflowY: "auto" }}>
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => addMember(user)}
              style={userItem}
            >
              <strong>{user.name}</strong>
              <p style={{ fontSize: "12px", color: "#64748b" }}>
                {user.email}
              </p>
            </div>
          ))}
        </div>

        {/* SELECTED MEMBERS */}
        <div style={selectedContainer}>
          {selectedMembers.map((m) => (
            <div key={m._id} style={selectedItem}>
              {m.name}
              <span
                onClick={() => removeMember(m._id)}
                style={{ cursor: "pointer" }}
              >
                ✕
              </span>
            </div>
          ))}
        </div>

        {/* BUTTONS */}
        <div style={buttonRow}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleCreate}>Create Project</button>
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
  width: "600px",
  background: "white",
  padding: "30px",
  borderRadius: "6px",
};

const userItem = {
  padding: "10px",
  border: "1px solid #e5e7eb",
  marginBottom: "5px",
  cursor: "pointer",
};

const selectedContainer = {
  marginTop: "15px",
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const selectedItem = {
  padding: "8px 10px",
  border: "1px solid #e5e7eb",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const buttonRow = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "25px",
  gap: "10px",
};

export default CreateProjectModal;