import React from "react";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, selectedDetails, theme }) => {
  if (!isSidebarOpen) return null;

  return (
    <div
      style={{
        width: "320px",
        height: "100%",
        position: "absolute",
        right: 0,
        top: 0,
        backgroundColor: theme === "dark" ? "#1E293B" : "#FFFFFF", // White background (dark mode adjusted)
        color: theme === "dark" ? "#F3F4F6" : "#1F2937", // Black text (dark mode adjusted)
        boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
        padding: "20px",
        overflowY: "auto",
        zIndex: 100,
      }}
    >
      <button
        style={{
          marginBottom: "20px",
          padding: "6px 12px",
          border: "none",
          background: theme === "dark" ? "#4B5563" : "#E5E7EB", // Gray background (dark mode adjusted)
          color: theme === "dark" ? "#F9FAFB" : "#1F2937", // Black text (dark mode adjusted)
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 500,
        }}
        onClick={() => setIsSidebarOpen(false)}
      >
        Close
      </button>

      {selectedDetails ? (
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "10px" }}>
            Selected Node / Path
          </h3>
          <p style={{ fontSize: "14px" }}>
            <strong>Label:</strong> {selectedDetails.label}
          </p>
          <div style={{ marginTop: "10px" }}>
            {selectedDetails.pathEdges?.map((edge, idx) => (
              <div key={edge.id} style={{ marginBottom: "10px" }}>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>
                  <strong>Step {idx + 1}</strong>: {edge.source} → {edge.target}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: theme === "dark" ? "#94A3B8" : "#6B7280", // Gray text (dark mode adjusted)
                  }}
                >
                  Type: {edge.label || "N/A"}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p style={{ fontSize: "14px" }}>No node selected.</p>
      )}
    </div>
  );
};

export default Sidebar;