import API from "../utils/api";
import {
  useMemo,
  useState,
  useEffect,
} from "react";

const CreateTaskModal = ({
  onClose,
  members,
  projectId,

  // NEW PROP
  onTaskCreated,
}) => {
  const [title, setTitle] =
    useState("");

  const [desc, setDesc] =
    useState("");

  // SINGLE MEMBER
  const [assignee, setAssignee] =
    useState("");

  const [memberSearch, setMemberSearch] =
    useState("");

  const [date, setDate] =
    useState("");

  // LOCK BACKGROUND SCROLL
  useEffect(() => {
    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "auto";
    };
  }, []);

  // FILTER MEMBERS
  const filteredMembers =
    useMemo(() => {
      return members.filter((m) =>
        m.name
          ?.toLowerCase()
          .includes(
            memberSearch.toLowerCase()
          )
      );
    }, [members, memberSearch]);

  // CREATE TASK
  const handleSubmit =
    async () => {
      if (!title || !assignee) {
        alert(
          "Title and Assignee are required"
        );

        return;
      }

      try {
        console.log(
          "Creating task..."
        );

        const res =
          await API.post(
            "/tasks/create",
            {
              title,

              description:
                desc,

              project:
                projectId,

              assignedTo:
                assignee,

              dueDate: date,
            }
          );

        console.log(
          "TASK CREATED:",
          res.data
        );

        alert(
          "Task created successfully"
        );

        // INSTANT UI UPDATE
        if (onTaskCreated) {
          onTaskCreated(
            res.data.task
          );
        }

        onClose();
      } catch (err) {
        console.log(
          "ERROR:",
          err.response?.data ||
          err
        );

        alert(
          err.response?.data
            ?.message ||
          "Failed to create task"
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
            pointerEvents: "none",
          }}
        />

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
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "6px",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* HEADER */}
          <div style={header}>
            <div>
              <p style={smallText}>
                TASK MANAGEMENT
              </p>

              <h2 style={titleStyle}>
                Create New Task
              </h2>

              <p style={subText}>
                Assign tasks to your team
                efficiently.
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

          {/* TITLE */}
          <div style={fieldGroup}>
            <label style={label}>
              Task Title
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

                e.target.style.boxShadow =
                  "none";
              }}
              placeholder="Enter task title..."
              value={title}
              onChange={(e) =>
                setTitle(
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

                e.target.style.boxShadow =
                  "none";
              }}
              rows="4"
              placeholder="Describe the task..."
              value={desc}
              onChange={(e) =>
                setDesc(
                  e.target.value
                )
              }
              style={textareaStyle}
            />
          </div>

          {/* MEMBER + DATE */}
          <div style={row}>
            {/* MEMBER */}
            <div style={{ flex: 1 }}>
              <label style={label}>
                Assign Member
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

                  e.target.style.boxShadow =
                    "none";
                }}
                type="text"
                placeholder="Search member..."
                value={memberSearch}
                onChange={(e) =>
                  setMemberSearch(
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              {/* SELECTED MEMBER */}
              {assignee && (
                <div
                  style={
                    selectedContainer
                  }
                >
                  {(() => {
                    const member =
                      members.find(
                        (m) =>
                          m._id ===
                          assignee
                      );

                    if (!member)
                      return null;

                    return (
                      <div
                        style={
                          selectedItem
                        }
                      >
                        <span>
                          {
                            member.name
                          }
                        </span>

                        <span
                          onClick={() =>
                            setAssignee(
                              ""
                            )
                          }
                          style={
                            removeBtn
                          }
                        >
                          ✕
                        </span>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* MEMBER LIST */}
              <div style={memberDropdown}>
                {filteredMembers.length ===
                  0 ? (
                  <div
                    style={
                      emptyMember
                    }
                  >
                    No members found
                  </div>
                ) : (
                  filteredMembers.map(
                    (m) => {
                      const selected =
                        assignee ===
                        m._id;

                      return (
                        <div
                          key={m._id}

                          onMouseEnter={(e) => {
                            if (assignee !== m._id) {
                              e.currentTarget.style.background =
                                "rgba(255,255,255,0.05)";
                            }
                          }}

                          onMouseLeave={(e) => {
                            if (assignee !== m._id) {
                              e.currentTarget.style.background =
                                "transparent";
                            }
                          }}
                          onClick={() => {
                            setAssignee(
                              m._id
                            );

                            setMemberSearch(
                              m.name
                            );
                          }}
                          style={{
                            ...memberItem,

                            background:
                              selected
                                ? "rgba(37,99,235,0.2)"
                                : "transparent",
                          }}
                        >
                          <div
                            style={
                              memberAvatar
                            }
                          >
                            {m.name?.charAt(
                              0
                            )}
                          </div>

                          <div>
                            <div
                              style={{
                                color:
                                  "white",

                                fontWeight:
                                  "600",
                              }}
                            >
                              {
                                m.name
                              }
                            </div>

                            <div
                              style={{
                                color:
                                  "#94a3b8",

                                fontSize:
                                  "12px",
                              }}
                            >
                              {
                                m.email
                              }
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )
                )}
              </div>
            </div>

            {/* DATE */}
            <div style={{ flex: 1 }}>
              <label style={label}>
                Due Date
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

                  e.target.style.boxShadow =
                    "none";
                }}
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </div>
          </div>
        </div>
        {/* BUTTONS */}
        <div style={buttonRow}>
          <button
            onMouseEnter={(e) => {
              e.target.style.transform =
                "translateY(-3px)";
            }}

            onMouseLeave={(e) => {
              e.target.style.transform =
                "translateY(0px)";
            }}
            onClick={onClose}
            style={cancelBtn}
          >
            Cancel
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
            onClick={handleSubmit}
            style={createBtn}
          >
            Create Task
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
  maxWidth: "680px",
  height: "88vh",

  background:
    "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.98))",

  borderRadius: "32px",

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

  marginBottom: "26px",

  position: "relative",

  zIndex: 2,
};

const smallText = {
  fontSize: "12px",

  letterSpacing: "2px",

  color: "#94a3b8",
};

const titleStyle = {
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
  marginBottom: "16px",
};

const label = {
  display: "block",

  marginBottom: "10px",

  color: "white",

  fontSize: "14px",

  fontWeight: "600",
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

  backdropFilter:
    "blur(12px)",
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

  backdropFilter:
    "blur(12px)",
};

const row = {
  display: "flex",

  gap: "14px",

  marginBottom: "20px",
};

const memberDropdown = {
  marginTop: "12px",

  borderRadius: "18px",

  overflow: "hidden",

  border:
    "1px solid rgba(255,255,255,0.08)",

  background:
    "rgba(15,23,42,0.95)",

  maxHeight: "180px",

  overflowY: "auto",

  backdropFilter:
    "blur(14px)",
};

const memberItem = {
  padding: "16px",

  display: "flex",

  alignItems: "center",

  gap: "14px",

  cursor: "pointer",

  transition: "all 0.25s ease",

  borderBottom:
    "1px solid rgba(255,255,255,0.04)",
};

const memberAvatar = {
  width: "40px",

  height: "40px",

  borderRadius: "12px",

  background:
    "linear-gradient(135deg, #2563eb, #1d4ed8)",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  color: "white",

  fontWeight: "bold",
};

const selectedContainer = {
  display: "flex",

  flexWrap: "wrap",

  gap: "10px",

  marginTop: "14px",

  marginBottom: "14px",
};

const selectedItem = {
  display: "flex",

  alignItems: "center",

  gap: "8px",

  padding: "10px 14px",

  borderRadius: "14px",

  background:
    "rgba(37,99,235,0.18)",

  color: "#60a5fa",

  fontSize: "13px",

  fontWeight: "700",

  backdropFilter:
    "blur(10px)",
};

const removeBtn = {
  cursor: "pointer",

  color: "#f87171",

  fontWeight: "bold",
};

const emptyMember = {
  padding: "16px",

  textAlign: "center",

  color: "#94a3b8",
};

const buttonRow = {
  display: "flex",

  justifyContent: "flex-end",

  gap: "14px",
};

const cancelBtn = {
  padding: "14px 22px",

  borderRadius: "16px",

  border:
    "1px solid rgba(255,255,255,0.08)",

  background:
    "rgba(255,255,255,0.06)",

  color: "white",

  cursor: "pointer",

  transition: "all 0.3s ease",
};

const createBtn = {
  padding: "14px 24px",

  borderRadius: "16px",

  border: "none",

  background:
    "linear-gradient(135deg, #2563eb, #1d4ed8)",

  color: "white",

  cursor: "pointer",

  fontWeight: "700",

  transition: "all 0.3s ease",

  boxShadow:
    "0 15px 30px rgba(37,99,235,0.35)",
};

export default CreateTaskModal;