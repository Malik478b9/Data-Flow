import React from "react";
import { Handle, Position } from "reactflow";

const CustomDropdownNode = ({ id, data }) => {
  const { title, items = [], expanded, onSelect, toggleExpanded, theme } = data;
  const isDark = theme === "dark";

  return (
    <div
      style={{
        border: `1px solid ${isDark ? "#4B5563" : "#D1D5DB"}`, // Light gray border (dark mode adjusted)
        borderRadius: 8,
        padding: 10,
        backgroundColor: isDark ? "#1E293B" : "#FFFFFF", // White background (dark mode adjusted)
        color: isDark ? "#F1F5F9" : "#1F2937", // Black text (dark mode adjusted)
        cursor: "pointer",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)", // Subtle shadow
        minWidth: 200,
      }}
      onClick={() => onSelect({ label: id })}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 600, fontSize: "14px" }}>{title}</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleExpanded(id);
          }}
          style={{
            fontSize: 12,
            padding: "2px 6px",
            backgroundColor: isDark ? "#4B5563" : "#E5E7EB", // Gray background (dark mode adjusted)
            color: isDark ? "#F1F5F9" : "#1F2937", // Black text (dark mode adjusted)
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {expanded && (
        <ul style={{ marginTop: 10, paddingLeft: 20 }}>
          {items.map((item, i) => (
            <li
              key={i}
              style={{
                fontSize: 12,
                lineHeight: 1.4,
                color: isDark ? "#D1D5DB" : "#4B5563", // Slightly gray text for list items
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}

      <Handle type="target" position={Position.Top} style={{ background: "#16A34A" }} />
      <Handle type="source" position={Position.Bottom} style={{ background: "#2563EB" }} />
    </div>
  );
};

export default CustomDropdownNode;