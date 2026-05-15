import { useEffect, useState } from "react";
import API from "../utils/api";

const CreateProjectModal = ({
  onClose,
}) => {
  const [name, setName] =
    useState("");

  const [desc, setDesc] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [users, setUsers] =
    useState([]);

  const [
    selectedMembers,
    setSelectedMembers,
  ] = useState([]);

  // LOCK BACKGROUND SCROLL
  useEffect(() => {
    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "auto";
    };
  }, []);

  // FETCH USERS
  useEffect(() => {
    const fetchUsers =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "token"
            );

          const { data } =
            await API.get(
              "/users",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          setUsers(data.users);
        } catch (err) {
          console.error(
            "Error fetching users",
            err
          );
        }
      };

    fetchUsers();
  }, []);

  // FILTER USERS
  const filteredUsers =
    users.filter((user) =>
      user.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // ADD MEMBER
  const addMember = (user) => {
    if (
      !selectedMembers.some(
        (m) => m._id === user._id
      )
    ) {
      setSelectedMembers([
        ...selectedMembers,
        user,
      ]);
    }
  };

  // REMOVE MEMBER
  const removeMember = (id) => {
    setSelectedMembers(
      selectedMembers.filter(
        (m) => m._id !== id
      )
    );
  };

  // CREATE PROJECT
  const handleCreate =
    async () => {
      if (!name) {
        alert(
          "Project name is required"
        );

        return;
      }

      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await API.post(
          "/projects/create",
          {
            name,

            description:
              desc,

            members:
              selectedMembers.map(
                (m) => m._id
              ),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        onClose();

        window.location.reload();
      } catch (err) {
        console.log(
          "ERROR:",
          err.response?.data
        );

        alert(
          err.response?.data
            ?.message ||
          "Failed to create project"
        );
      }
    };

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
          }}
        />
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "6px",
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
            }}
          />
          {/* HEADER */}
          <div style={header}>
            <div>
              <p style={smallText}>
                PROJECT SPACE
              </p>

              <h2 style={title}>
                Create Project
              </h2>

              <p style={subText}>
                Start a new collaborative
                workspace for your team.
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

          {/* NAME */}
          <div style={fieldGroup}>
            <label style={label}>
              Project Name
            </label>

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
              placeholder="Enter project name..."
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              style={inputStyle}
            />
          </div>

          {/* DESCRIPTION */}
          <div style={fieldGroup}>
            <label style={label}>
              Description
            </label>

            <textarea
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
              rows="4"
              placeholder="Describe your project..."
              value={desc}
              onChange={(e) =>
                setDesc(
                  e.target.value
                )
              }
              style={textareaStyle}
            />
          </div>

          {/* MEMBERS */}
          <div style={fieldGroup}>
            <label style={label}>
              Team Members
            </label>

            {/* SEARCH */}
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
              placeholder="Search members..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              style={inputStyle}
            />

            {/* USER LIST */}
            <div style={userList}>
              {filteredUsers.map(
                (user) => {
                  const alreadyAdded =
                    selectedMembers.some(
                      (m) =>
                        m._id ===
                        user._id
                    );

                  return (
                    <div
                      key={user._id}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(-3px)";
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(0px)";
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.06)";
                      }}
                      onClick={() =>
                        !alreadyAdded &&
                        addMember(user)
                      }
                      style={{
                        ...userItem,

                        opacity:
                          alreadyAdded
                            ? 0.5
                            : 1,

                        cursor:
                          alreadyAdded
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {/* LEFT */}
                      <div
                        style={{
                          display:
                            "flex",

                          alignItems:
                            "center",

                          gap: "14px",
                        }}
                      >
                        <div
                          style={
                            avatar
                          }
                        >
                          {user.name?.charAt(
                            0
                          )}
                        </div>

                        <div>
                          <strong
                            style={{
                              color:
                                "white",
                            }}
                          >
                            {
                              user.name
                            }
                          </strong>

                          <p
                            style={
                              emailText
                            }
                          >
                            {
                              user.email
                            }
                          </p>
                        </div>
                      </div>

                      {/* BUTTON */}
                      <div
                        style={{
                          ...addBadge,

                          background:
                            alreadyAdded
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(37,99,235,0.2)",

                          color:
                            alreadyAdded
                              ? "#94a3b8"
                              : "#60a5fa",
                        }}
                      >
                        {alreadyAdded
                          ? "Added"
                          : "+ Add"}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* SELECTED MEMBERS */}
          {selectedMembers.length >
            0 && (
              <div
                style={
                  selectedContainer
                }
              >
                {selectedMembers.map(
                  (m) => (
                    <div
                      key={m._id}
                      style={
                        selectedItem
                      }
                    >
                      <span>
                        {m.name}
                      </span>

                      <span
                        onClick={() =>
                          removeMember(
                            m._id
                          )
                        }
                        style={
                          removeBtn
                        }
                      >
                        ✕
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
        </div>
        {/* BUTTONS */}
        <div style={buttonRow}>
          <button
            onClick={onClose}
            style={cancelBtn}
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            style={createBtn}
            onMouseEnter={(e) => {
              e.target.style.transform =
                "translateY(-3px)";
              e.target.style.boxShadow =
                "0 20px 40px rgba(37,99,235,0.45)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform =
                "translateY(0px)";
              e.target.style.boxShadow =
                "0 15px 30px rgba(37,99,235,0.35)";
            }}
          >
            Create Project
          </button>
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
  background:
    "rgba(2,6,23,0.82)",
  backdropFilter:
    "blur(16px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  padding: "20px",
};

const modalStyle = {
  width: "100%",
  maxWidth: "560px",
  height: "88vh",
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.98))",
  borderRadius: "30px",
  padding: "30px",
  border:
    "1px solid rgba(255,255,255,0.08)",
  backdropFilter:
    "blur(24px)",
  boxShadow:
    "0 35px 80px rgba(0,0,0,0.55)",
  fontFamily:
    "Arial, sans-serif",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const header = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "flex-start",
  marginBottom: "30px",
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
  fontSize: "34px",
  margin: "8px 0 4px",
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
  background:
    "rgba(255,255,255,0.08)",
  color: "white",
  cursor: "pointer",
  fontSize: "16px",
  transition: "all 0.3s ease",
  position: "relative",
  zIndex: 5,
};

const fieldGroup = {
  marginBottom: "24px",
};

const label = {
  display: "block",

  marginBottom: "10px",

  color: "white",

  fontWeight: "600",

  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "18px",
  border:
    "1px solid rgba(255,255,255,0.08)",
  background:
    "rgba(255,255,255,0.06)",
  color: "white",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.3s ease",
  backdropFilter: "blur(12px)",
};

const textareaStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "18px",
  border:
    "1px solid rgba(255,255,255,0.08)",
  background:
    "rgba(255,255,255,0.06)",
  color: "white",
  fontSize: "14px",
  outline: "none",
  resize: "none",
  boxSizing: "border-box",
  transition: "all 0.3s ease",
  backdropFilter: "blur(12px)",
};

const userList = {
  marginTop: "14px",

  maxHeight: "160px",

  overflowY: "auto",

  display: "flex",

  flexDirection: "column",

  gap: "10px",
};

const userItem = {
  padding: "18px",
  borderRadius: "20px",
  background:
    "rgba(255,255,255,0.06)",
  border:
    "1px solid rgba(255,255,255,0.06)",
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  transition: "all 0.3s ease",
};

const avatar = {
  width: "48px",

  height: "48px",

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

const emailText = {
  fontSize: "13px",

  color: "#94a3b8",

  marginTop: "4px",
};

const addBadge = {
  padding: "8px 14px",

  borderRadius: "999px",

  fontSize: "12px",

  fontWeight: "600",
};

const selectedContainer = {
  marginTop: "10px",

  display: "flex",

  gap: "12px",

  flexWrap: "wrap",
};

const selectedItem = {
  display: "flex",

  alignItems: "center",

  gap: "10px",

  padding: "10px 14px",

  borderRadius: "14px",

  background:
    "rgba(37,99,235,0.15)",

  color: "#60a5fa",

  fontWeight: "600",

  fontSize: "14px",
};

const removeBtn = {
  cursor: "pointer",

  color: "#f87171",

  fontWeight: "bold",
};

const buttonRow = {
  display: "flex",

  justifyContent: "flex-end",

  gap: "14px",

  marginTop: "30px",
};

const cancelBtn = {
  padding: "16px 24px",
  borderRadius: "16px",
  border:
    "1px solid rgba(255,255,255,0.08)",
  background:
    "rgba(255,255,255,0.06)",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  transition: "all 0.3s ease",
};

const createBtn = {
  padding: "16px 26px",
  borderRadius: "16px",
  border: "none",
  background:
    "linear-gradient(135deg, #2563eb, #4f46e5)",
  color: "white",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "14px",
  boxShadow:
    "0 15px 30px rgba(37,99,235,0.35)",
  transition: "all 0.3s ease",
};

export default CreateProjectModal;