import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { motion, AnimatePresence } from "framer-motion";

const CustomDropdownNode = ({ id, data, depth = 0 }) => {
  const width = 280 - depth * 25;
  const [isExpanded, setIsExpanded] = useState(false);
  const isDarkMode = data.theme === "dark";

  const colors = {
    primary: isDarkMode ? "#a78bfa" : "#7c3aed",
    background: "transparent",
    border: isDarkMode ? "#3b4a6b" : "#e5e7eb",
    text: isDarkMode ? "#d1d5db" : "#1f2937",
    textLight: isDarkMode ? "#9ca3af" : "#6b7280",
    shadow: isDarkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.07)",
    hover: isDarkMode ? "#2a3b5b" : "#f3f4f6",
    success: isDarkMode ? "#2dd4bf" : "#14b8a6",
    itemBg: isDarkMode ? "#2a3b5b" : "#f9fafb",
    toggleBg: isDarkMode ? "#3b4a6b" : "#d1d5db",
    highlightBorder: isDarkMode ? "#60a5fa" : "#3b82f6",
    connector: isDarkMode ? "#4b5563" : "#9ca3af",
    nodeTypes: {
      parent: isDarkMode ? "#8b5cf6" : "#6d28d9",
      child: isDarkMode ? "#60a5fa" : "#3b82f6",
      leaf: isDarkMode ? "#10b981" : "#059669",
    }
  };

  const subNodes = [
    ...(data.items || []),
    ...(data.nestedNodes || []).map((node) => ({ label: node.id, type: "nested" })),
  ];
  const subNodeCount = subNodes.length;
  const maxVisible = 5;
  const visibleSubNodes = isExpanded ? subNodes : subNodes.slice(0, maxVisible);
  const hasMoreNodes = subNodeCount > maxVisible;

  const nodeType = subNodeCount > 0 ? (depth === 0 ? "parent" : "child") : "leaf";
  const nodeTypeColor = colors.nodeTypes[nodeType];

  const getNodeTypeIndicator = () => {
    const icons = {
      parent: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 8H19M5 8C3.89543 8 3 7.10457 3 6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6C21 7.10457 20.1046 8 19 8M5 8V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 12V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 14H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      child: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      leaf: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    };

    return icons[nodeType];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ boxShadow: `0 8px 24px ${colors.shadow}`, transform: "translateY(-2px)" }}
      transition={{ duration: 0.3 }}
      style={{
        background: colors.background,
        borderRadius: 12,
        border: `1px solid ${colors.border}`,
        padding: '10px 14px',
        boxShadow: `0 2px 12px ${colors.shadow}`,
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <div
        onClick={() => data.toggleExpanded?.(id)}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          padding: "8px 10px",
          marginBottom: 6,
          cursor: "pointer",
          borderRadius: 8,
          background: data.expanded ? `${nodeTypeColor}20` : "transparent",
          transition: "all 0.3s ease",
        }}
      >
        <Handle
          type="target"
          position={Position.Left}
          id={id}
          style={{
            position: "absolute",
            left: -6,
            top: "50%",
            transform: "translateY(-50%)",
            background: nodeTypeColor,
            width: 12,
            height: 12,
            borderRadius: "50%",
            border: `2px solid ${isDarkMode ? "#1e2a44" : "#ffffff"}`,
            transition: "all 0.2s ease",
          }}
        />

        <motion.div
          style={{
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
            borderRadius: "50%",
            background: data.expanded ? nodeTypeColor : colors.border,
            color: data.expanded ? "white" : nodeTypeColor,
          }}
          animate={{ rotate: data.expanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {subNodeCount > 0 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 3v12" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="6" cy="3" r="3" />
              <circle cx="18" cy="6" r="3" />
              <path d="M6 6h12" />
            </svg>
          ) : (
            getNodeTypeIndicator()
          )}
        </motion.div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <strong
            style={{
              fontSize: "1rem",
              color: data.expanded ? nodeTypeColor : colors.text,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            {data.title} {subNodeCount > 0 && `(${subNodeCount})`}
          </strong>
          {data.description && (
            <span style={{
              fontSize: "0.75rem",
              color: colors.textLight,
              marginTop: 2
            }}>
              {data.description}
            </span>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Right}
          id={id}
          style={{
            position: "absolute",
            right: -6,
            top: "50%",
            transform: "translateY(-50%)",
            background: nodeTypeColor,
            width: 12,
            height: 12,
            borderRadius: "50%",
            border: `2px solid ${isDarkMode ? "#1e2a44" : "#ffffff"}`,
            transition: "all 0.2s ease",
          }}
        />
      </div>

      <AnimatePresence>
        {data.expanded && subNodeCount > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginTop: 8 }}
          >
            <ul className="tree-structure"
              style={{
                listStyle: "none",
                paddingLeft: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                position: "relative",
              }}
            >
              <div style={{
                position: "absolute",
                left: 14,
                top: 0,
                bottom: 0,
                width: 2,
                background: colors.connector,
                opacity: 0.6
              }} />

              {visibleSubNodes.map((subNode, index) =>
                subNode.type === "nested" ? (
                  <motion.div
                    key={subNode.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    style={{
                      marginTop: 4,
                      paddingLeft: 28,
                      position: "relative",
                    }}
                  >
                    <div style={{
                      position: "absolute",
                      left: 14,
                      top: 16,
                      width: 14,
                      height: 2,
                      background: colors.connector,
                      opacity: 0.6
                    }} />

                    <CustomDropdownNode
                      id={subNode.label}
                      data={{
                        ...data.nestedNodes.find((n) => n.id === subNode.label).data,
                        onSelect: data.onSelect,
                        toggleExpanded: data.toggleExpanded,
                        setEdges: data.setEdges,
                        onShowDetails: data.onShowDetails,
                        onShowTrace: data.onShowTrace,
                        theme: data.theme,
                        isHighlighted: data.isHighlighted,
                        pathEdgesMap: data.pathEdgesMap,
                      }}
                      depth={depth + 1}
                    />
                  </motion.div>
                ) : (
                  <motion.li
                    key={subNode.label}
                    style={{
                      position: "relative",
                      padding: "8px 14px",
                      background: colors.itemBg,
                      color: colors.text,
                      borderRadius: 10,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: `1px solid ${colors.border}`,
                      transition: "all 0.3s ease",
                      fontWeight: 500,
                      boxShadow: `0 2px 8px ${colors.shadow}`,
                      marginLeft: 28,
                      pointerEvents: "auto",
                      zIndex: 1000,
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.05 * index }}
                    whileHover={{
                      background: colors.hover,
                      boxShadow: `0 6px 16px ${colors.shadow}`,
                      transform: "translateY(-2px)",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Nested child node clicked:", subNode);
                      if (Array.isArray(data.selectedNodes) && data.selectedNodes.includes(subNode.label)) {
                        console.log("Deselecting node:", subNode.label);
                        data.onSelect?.({ label: null });
                      } else {
                        console.log("Selecting node:", subNode.label);
                        data.onSelect?.({ label: subNode.label });
                      }
                    }}
                //doubleclick function
                 //   onDoubleClick={(e) => {
                 //     e.stopPropagation();
                  //    console.log("Double-clicked node:", subNode.label);
                  //    data.onShowTrace?.(subNode.label);
                 //   }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: -14,
                        top: "50%",
                        width: 14,
                        height: 2,
                        background: colors.connector,
                        opacity: 0.6,
                        transform: "translateY(-50%)",
                      }}
                    />

                    <Handle
                      type="target"
                      position={Position.Left}
                      id={subNode.label}
                      style={{
                        left: -5,
                        background: colors.success,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        border: `2px solid ${isDarkMode ? "#1e2a44" : "#ffffff"}`,
                        transition: "all 0.2s ease",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flex: "1 1 auto",
                        gap: "6px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            background: colors.nodeTypes.leaf,
                            color: "white",
                            marginRight: 8,
                            fontSize: "0.75rem",
                            flexShrink: 0,
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width="14"
                            height="14"
                          >
                            <path d="M5 21c14 0 14-18 14-18S5 3 5 21z" />
                          </svg>
                        </div>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{subNode.label}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          data.onShowTrace?.(subNode.label);
                        }}
                        style={{
                          padding: "2px 6px",
                          fontSize: "0.75rem",
                          background: "transparent",
                          color: "#111",
                          border: "1px solid #111",
                          borderRadius: 4,
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        Trace
                      </button>
                    </div>

                    <Handle
                      type="source"
                      position={Position.Right}
                      id={subNode.label}
                      style={{
                        right: -5,
                        background: colors.success,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        border: `2px solid ${isDarkMode ? "#1e2a44" : "#ffffff"}`,
                        transition: "all 0.2s ease",
                      }}
                    />
                  </motion.li>
                )
              )}
            </ul>

            {hasMoreNodes && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  width: 150,
                  marginTop: 8,
                  marginLeft: 28,
                  padding: "8px 12px",
                  background: colors.toggleBg,
                  color: colors.textLight,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  boxShadow: `0 2px 8px ${colors.shadow}`,
                  position: "relative",
                }}
                onClick={(e) => {
                  e.stopPropagation();  // Prevent triggering parent node select
                  setIsExpanded(!isExpanded);
                }}

              >
                <div style={{
                  position: "absolute",
                  left: -14,
                  top: "50%",
                  width: 14,
                  height: 2,
                  background: colors.connector,
                  opacity: 0.6,
                  transform: "translateY(-50%)"
                }} />
                {isExpanded ? "Show Less" : `${subNodeCount - maxVisible} more nodes, click to show`}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CustomDropdownNode;