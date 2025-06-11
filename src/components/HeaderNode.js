import React from "react";

const HeaderNode = ({ data }) => {
  const isDark = data.theme === "dark";
  return (
    <div
      style={{
        padding: "8px 12px",
        borderRadius: "6px",
        backgroundColor: isDark ? "#4B5563" : "#E5E7EB", // Gray background (dark mode adjusted)
        color: isDark ? "#F1F5F9" : "#1F2937", // Black text (dark mode adjusted)
        fontWeight: 600,
        fontSize: "14px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)", // Subtle shadow
      }}
    >
      {data.label || "Header Node"}
    </div>
  );
};

export default HeaderNode;