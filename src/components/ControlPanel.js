import React from "react";

const ControlPanel = ({
  theme,
  toggleTheme,
  expandAll,
  collapseAll,
  resetView,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: "#E5E7EB", // Light gray background as per image
      borderBottom: "1px solid #D1D5DB", // Subtle border
    }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={expandAll}
          style={{
            padding: "6px 12px",
            backgroundColor: "#FFA500", // Orange background
            color: "#FFFFFF", // White text
            border: "1px solid #D1D5DB", // Light gray border
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)", // Subtle shadow
            transition: "all 0.3s", // Smooth transition
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#000080"} // Navy blue on hover
          onMouseOut={(e) => e.target.style.backgroundColor = "#FFA500"} // Revert to orange when not hovering
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          style={{
            padding: "6px 12px",
            backgroundColor: "#FFA500",
            color: "#FFFFFF",
            border: "1px solid #D1D5DB",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            transition: "all 0.3s",
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#000080"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#FFA500"}
        >
          Collapse All
        </button>
        <button
          onClick={resetView}
          style={{
            padding: "6px 12px",
            backgroundColor: "#FFA500",
            color: "#FFFFFF",
            border: "1px solid #D1D5DB",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            transition: "all 0.3s",
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#000080"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#FFA500"}
        >
          Reset View
        </button>
        <button
          onClick={toggleTheme}
          style={{
            padding: "6px 12px",
            backgroundColor: "#FFA500",
            color: "#FFFFFF",
            border: "1px solid #D1D5DB",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            transition: "all 0.3s",
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#000080"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#FFA500"}
        >
          Toggle Theme
        </button>
      </div>
      <input
        type="text"
        placeholder="Search nodes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid #D1D5DB", // Light gray border
          width: "200px",
          backgroundColor: "#FFFFFF", // White background
          color: "#1F2937", // Black text
          fontSize: "14px",
          outline: "none",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)", // Subtle inset shadow
        }}
      />
    </div>
  );
};

export default ControlPanel;
