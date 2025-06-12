import React from "react";

const HeaderNode = ({ data }) => {
  const isDarkMode = data.theme === "dark";
  return (
    <div
      style={{
        fontSize: "1.2rem",
        fontWeight: "bold",
        color: isDarkMode ? "#d1d5db" : "#333",
        background: isDarkMode ? "linear-gradient(145deg, #1e2a44, #172135)" : "#ffffff",
        padding: "8px 12px",
        borderRadius: 8,
        boxShadow: isDarkMode ? "0 4px 12px rgba(0, 0, 0, 0.5)" : "0 4px 12px rgba(0, 0, 0, 0.07)",
        transition: "all 0.3s ease",
        border: data.isHighlighted ? `2px solid ${isDarkMode ? "#60a5fa" : "#3b82f6"}` : "none",
      }}
    >
      {data.label}
    </div>
  );
};

export default HeaderNode;