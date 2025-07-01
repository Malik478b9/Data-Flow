
import React from "react";
import SampleData from "../SampleData";
import { useNavigate } from "react-router-dom";
import logoBlue from "../../images/Logo_blue.png"; // Ensure this file exists
import logoBlack from "../../images/logo.png"; // Ensure this file exists
const ControlPanel = ({
  theme,
  toggleTheme,
  expandAll,
  collapseAll,
  resetView,
  searchTerm,
  setSearchTerm,
  showJsonInput,
  setShowJsonInput,
  handleJsonSubmit,
  handleSaveLayout,
  handleUpdateLayout,
  viewMode,
  setViewMode,
  printSelectedNode,
}) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 10,
        display: "flex",
        flexDirection: "row",
        gap: "12px",
        padding: "16px",
        borderRadius: 12,
        boxShadow:
          theme === "dark"
            ? "0 10px 30px rgba(0, 0, 0, 0.5)"
            : "0 8px 24px rgba(0, 0, 0, 0.07)",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Logo */}
        {/* <div
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}




          
          title="Back to Gallery"
        >
          <img
            src={theme === "dark" ? logoBlack : logoBlue}
            alt="Logo"
            style={{
              height: "33px",
            }}
          />
        </div> */}

        {/* Search Input */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search node..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: `1px solid ${theme === "dark" ? "#3b4a6b" : "#d1d5db"}`,
              background: theme === "dark" ? "#2a3b5b" : "#ffffff",
              color: theme === "dark" ? "#d1d5db" : "#1f2937",
              width: 200,
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
              boxShadow:
                theme === "dark"
                  ? "inset 0 2px 4px rgba(0, 0, 0, 0.3)"
                  : "none",
            }}
          />


        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
