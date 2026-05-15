import { useEffect, useState } from "react";
import API from "../utils/api";

const AddMemberModal = ({
  onClose,
  currentMembers = [],
  onAdd,
  projectId,
}) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get("/users");

        setUsers(
          Array.isArray(data.users)
            ? data.users
            : []
        );
      } catch (error) {
        console.error(
          "Error fetching users",
          error
        );
      }
    };

    fetchUsers();
  }, []);

  // FILTER USERS
  const filteredUsers = (
    users || []
  ).filter((user) =>
    user.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* GLOW EFFECTS */}
        <div
          style={{
            position: "absolute",
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            background: "rgba(37,99,235,0.18)",
            filter: "blur(100px)",
            top: "-80px",
            right: "-80px",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "6px",
            position: "relative",
            zIndex: 2,
          }}
        >

          <div
            style={{
              position: "absolute",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "rgba(59,130,246,0.12)",
              filter: "blur(90px)",
              bottom: "-60px",
              left: "-60px",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />
          {/* HEADER */}
          <div style={header}>
            <div>
              <p style={smallText}>
                TEAM MANAGEMENT
              </p>

              <h2 style={title}>
                Add Members
              </h2>

              <p style={subText}>
                Invite team members to collaborate
                on this project.
              </p>
            </div>

            <button
              onClick={onClose}
              style={closeBtn}
              onMouseEnter={(e) => {
                e.target.style.transform =
                  "rotate(90deg)";
                e.target.style.background =
                  "rgba(239,68,68,0.18)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform =
                  "rotate(0deg)";
                e.target.style.background =
                  "rgba(255,255,255,0.08)";
              }}
            >
              ✕
            </button>
          </div>

          {/* SEARCH */}
          <div style={searchBox}>
            <input
              placeholder="Search member..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              style={inputStyle}

              onFocus={(e) => {
                e.target.style.border =
                  "1px solid rgba(96,165,250,0.8)";

                e.target.style.boxShadow =
                  "0 0 0 4px rgba(37,99,235,0.18)";
              }}

              onBlur={(e) => {
                e.target.style.border =
                  "1px solid rgba(255,255,255,0.08)";

                e.target.style.boxShadow =
                  "none";
              }}
            />
          </div>

          {/* USER LIST */}
          <div style={userList}>
            {filteredUsers.length === 0 ? (
              <div style={emptyBox}>
                <p>No users found</p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const alreadyAdded =
                  currentMembers.some(
                    (m) => m._id === user._id
                  );

                return (
                  <div
                    key={user._id}
                    style={userCard}

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
                    {/* LEFT */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                      }}
                    >
                      {/* AVATAR */}
                      <div style={avatar}>
                        {user.name?.charAt(0)}
                      </div>

                      {/* USER INFO */}
                      <div>
                        <strong
                          style={{
                            color: "white",
                          }}
                        >
                          {user.name}
                        </strong>

                        <p style={emailText}>
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* BUTTON */}
                    <button
                      disabled={alreadyAdded}
                      onMouseEnter={(e) => {
                        if (!alreadyAdded) {
                          e.target.style.transform =
                            "translateY(-3px)";
                        }
                      }}

                      onMouseLeave={(e) => {
                        e.target.style.transform =
                          "translateY(0px)";
                      }}
                      onClick={async () => {
                        try {
                          await API.put(
                            "/projects/add-member",
                            {
                              projectId,
                              userId: user._id,
                            }
                          );

                          alert("Member added");

                          // Update UI instantly
                          onAdd && onAdd(user);
                        } catch (err) {
                          console.log(err);

                          alert(
                            "Failed to add member"
                          );
                        }
                      }}
                      style={{
                        ...addBtn,
                        background: alreadyAdded
                          ? "rgba(255,255,255,0.08)"
                          : "linear-gradient(135deg, #2563eb, #1d4ed8)",

                        color: alreadyAdded
                          ? "#94a3b8"
                          : "white",

                        cursor: alreadyAdded
                          ? "not-allowed"
                          : "pointer",

                        boxShadow: alreadyAdded
                          ? "none"
                          : "0 8px 20px rgba(37,99,235,0.3)",
                      }}
                    >
                      {alreadyAdded
                        ? "Added"
                        : "+ Add"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(2,6,23,0.82)",
  backdropFilter: "blur(16px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  padding: "20px",
};

const modalStyle = {
  width: "100%",
  maxWidth: "620px",
  height: "86vh",

  background:
    "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.98))",

  border: "1px solid rgba(255,255,255,0.08)",

  borderRadius: "32px",

  padding: "32px",

  backdropFilter: "blur(24px)",

  boxShadow:
    "0 35px 80px rgba(0,0,0,0.55)",

  fontFamily: "Arial, sans-serif",

  position: "relative",

  overflow: "hidden",

  display: "flex",

  flexDirection: "column",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  position: "relative",
  zIndex: 2,
};

const smallText = {
  fontSize: "12px",
  letterSpacing: "2px",
  color: "#94a3b8",
};

const title = {
  color: "white",
  fontSize: "38px",
  margin: "10px 0 6px",
  fontWeight: "800",
  letterSpacing: "-1px",
};

const subText = {
  color: "#cbd5e1",
  lineHeight: "1.8",
  fontSize: "15px",
};

const closeBtn = {
  width: "46px",
  height: "46px",
  borderRadius: "16px",
  border: "none",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  cursor: "pointer",
  fontSize: "16px",
  transition: "all 0.3s ease",
  position: "relative",
  zIndex: 5,
};
const searchBox = {
  marginTop: "24px",
};

const inputStyle = {
  width: "100%",
  padding: "18px",
  borderRadius: "18px",

  border: "1px solid rgba(255,255,255,0.08)",

  background: "rgba(255,255,255,0.06)",

  color: "white",

  fontSize: "15px",

  outline: "none",

  boxSizing: "border-box",

  transition: "all 0.3s ease",

  backdropFilter: "blur(12px)",
};

const userList = {
  marginTop: "24px",
};

const userCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  padding: "20px",

  marginBottom: "16px",

  borderRadius: "24px",

  background: "rgba(255,255,255,0.06)",

  border: "1px solid rgba(255,255,255,0.06)",

  backdropFilter: "blur(16px)",

  transition: "all 0.3s ease",

  boxShadow:
    "0 12px 25px rgba(0,0,0,0.18)",
};

const avatar = {
  width: "52px",
  height: "52px",

  borderRadius: "16px",

  background:
    "linear-gradient(135deg, #2563eb, #1d4ed8)",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  color: "white",

  fontWeight: "bold",

  fontSize: "20px",

  boxShadow: "0 10px 25px rgba(37,99,235,0.35)",
};

const emailText = {
  fontSize: "13px",
  color: "#94a3b8",
  marginTop: "5px",
};

const addBtn = {
  border: "none",

  padding: "13px 20px",

  borderRadius: "16px",

  fontWeight: "700",

  fontSize: "14px",

  transition: "all 0.3s ease",
};

const emptyBox = {
  height: "140px",

  borderRadius: "24px",

  background: "rgba(255,255,255,0.05)",

  border: "1px solid rgba(255,255,255,0.05)",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  color: "#94a3b8",

  backdropFilter: "blur(14px)",
};

export default AddMemberModal;