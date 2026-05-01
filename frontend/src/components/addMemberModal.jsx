import { useEffect, useState } from "react";
import API from "../utils/api"; 

const AddMemberModal = ({ onClose, currentMembers = [], onAdd, projectId,}) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  // Fetch users (FIXED)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get("/users"); 

        console.log("USERS:", data); 

        setUsers(Array.isArray(data.users) ? data.users : []);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, []);

  // 🔍 Filter users
  const filteredUsers = (users || []).filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "12px", color: "#64748b" }}>TEAM</p>
            <h2>Add Member</h2>
          </div>

          <span onClick={onClose} style={{ cursor: "pointer" }}>
            ✕
          </span>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search member..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginTop: "15px", width: "100%", padding: "8px" }}
        />

        {/* USER LIST */}
        <div style={{ marginTop: "15px" }}>
          {filteredUsers.length === 0 ? (
            <p>No users found</p>
          ) : (
            filteredUsers.map((user) => {
              const alreadyAdded = currentMembers.some(
                (m) => m._id === user._id
              );

              return (
                <div key={user._id} style={userCard}>
                  <div>
                    <strong>{user.name}</strong>
                    <p style={{ fontSize: "12px", color: "#64748b" }}>
                      {user.email}
                    </p>
                  </div>

                  <button
                    disabled={alreadyAdded}
                    onClick={async () => {
                      try {
                        await API.put("/projects/add-member", {
                          projectId,       
                          userId: user._id,
                        });

                        alert("Member added");

                        // update UI instantly
                        onAdd && onAdd(user);

                      } catch (err) {
                        console.log(err);
                        alert("Failed to add member");
                      }
                    }}
                    style={{
                      background: alreadyAdded ? "#e5e7eb" : "#1d4ed8",
                      color: alreadyAdded ? "#64748b" : "white",
                      padding: "5px 10px",
                      cursor: alreadyAdded ? "not-allowed" : "pointer",
                    }}
                  >
                    {alreadyAdded ? "Added" : "+ ADD"}
                  </button>
                </div>
              );
            })
          )}
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
  zIndex: 1000,
};

const modalStyle = {
  width: "500px",
  background: "white",
  padding: "25px",
  borderRadius: "6px",
};

const userCard = {
  border: "1px solid #e5e7eb",
  padding: "10px",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export default AddMemberModal;