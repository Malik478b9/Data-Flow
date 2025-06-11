// Legend.js
import React from "react";

const Legend = ({ theme }) => {
  const isDark = theme === "dark";
  const legendStyles = {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: isDark ? "#1e293b" : "#ffffff",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    color: isDark ? "#f1f5f9" : "#1f2937",
  };

  const itemStyles = {
    display: "flex",
    alignItems: "center",
    marginBottom: "5px",
  };

  const boxStyles = (color) => ({
    width: "20px",
    height: "20px",
    backgroundColor: color,
    marginRight: "10px",
    border: `1px solid ${isDark ? "#444" : "#ccc"}`,
  });

  return (
    <div style={legendStyles}>
      <h4>Legend</h4>
      <div style={itemStyles}>
        <div style={boxStyles("#90EE90")}></div>
        <span>Vendor Application</span>
      </div>
      <div style={itemStyles}>
        <div style={boxStyles("#87CEEB")}></div>
        <span>Proprietary Application</span>
      </div>
      <div style={itemStyles}>
        <div style={boxStyles("#FF4040")}></div>
        <span>Legacy Application</span>
      </div>
    </div>
  );
};

export default Legend;