import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  selectedDetails,
  theme,
  selectedNodes,
  toggleTheme,
  expandAll,
  collapseAll,
  resetView,
  handleUpdateLayout,
  viewMode,
  setViewMode,
}) => {
  const isDarkMode = theme === "dark";
  const navigate = useNavigate();

  const colors = {
    light: {
      bg: "#ffffff",
      text: "#1f2937",
      border: "#e5e7eb",
      shadow: "rgba(0, 0, 0, 0.1)",
      hover: "#f3f4f6",
      buttonBg: "#d1d5db",
      buttonHover: "#e5e7eb",
      buttonGradient: "linear-gradient(135deg, #e5e7eb, #d1d5db)",
    },
    dark: {
      bg: "#1e293b",
      text: "#d1d5db",
      border: "#475569",
      shadow: "rgba(0, 0, 0, 0.3)",
      hover: "#334155",
      buttonBg: "#3b4a6b",
      buttonHover: "#4b5a7b",
      buttonGradient: "linear-gradient(135deg, #4b5a7b, #3b4a6b)",
    },
  };

  const themeColors = isDarkMode ? colors.dark : colors.light;

  return (
    <motion.div
      style={{
        width: isSidebarOpen ? 320 : 0,
        height: "100vh",
        background: themeColors.bg,
        color: themeColors.text,
        borderLeft: `1px solid ${themeColors.border}`,
        boxShadow: isSidebarOpen ? `-4px 0 12px ${themeColors.shadow}` : "none",
        overflow: "hidden",
        transition: "all 0.3s ease",
        position: "fixed",
        right: 0,
        top: 0,
        zIndex: 20,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
      initial={{ width: 0 }}
      animate={{ width: isSidebarOpen ? 320 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Print-Specific Styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .path-edges,
            .path-edges * {
              visibility: visible;
            }
            .path-edges {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              max-height: none !important;
              overflow-y: visible !important;
              background: ${isDarkMode ? "#2d3748" : "#f9fafb"};
              padding: 16px;
              border-radius: 12px;
            }
            .path-edges .print-button {
              display: none !important;
            }
            .path-edges-title {
              margin-bottom: 12px;
              font-size: 1.1rem;
              font-weight: 600;
              color: ${themeColors.text};
            }
            .path-edge-item {
              padding: 12px;
              background: ${themeColors.buttonBg};
              color: ${themeColors.text};
              border: 1px solid ${themeColors.border};
              border-radius: 8px;
              margin-bottom: 8px;
              font-size: 0.9rem;
              font-weight: 500;
            }
            .path-edge-item > div:first-child {
              font-weight: 600;
            }
            .path-edge-item > div:last-child {
              font-size: 0.85rem;
              color: ${isDarkMode ? "#94a3b8" : "#6b7280"};
            }
          }
        `}
      </style>

      {isSidebarOpen && (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Footer at Top */}
          <div
            style={{
              height: "48px",
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              background: themeColors.bg,
              borderBottom: `1px solid ${themeColors.border}`,
              position: "sticky",
              top: 0,
              zIndex: 11,
              fontSize: "0.9rem",
              fontWeight: "500",
              color: themeColors.text,
            }}
          >
            Sidebar Footer
          </div>

          {/* Fixed Header */}
          <div
            style={{
              height: "64px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 24px",
              borderBottom: `1px solid ${themeColors.border}`,
              background: themeColors.bg,
              position: "sticky",
              top: "48px",
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                color: themeColors.text,
              }}
            >
              Controls
            </div>
            <button
              onClick={() => {
                console.log("Close Panel clicked");
                setIsSidebarOpen(false);
              }}
              style={{
                padding: "8px",
                background: themeColors.buttonBg,
                color: themeColors.text,
                border: `1px solid ${themeColors.border}`,
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = isDarkMode ? "#ef4444" : "#dc2626";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = themeColors.buttonBg;
                e.currentTarget.style.color = themeColors.text;
                e.currentTarget.style.transform = "scale(1)";
              }}
              title="Close Sidebar"
            >
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
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main Scrollable Content */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px",
              scrollBehavior: "smooth",
            }}
          >
            {/* Control Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "16px",
                background: isDarkMode ? "#2d3748" : "#f9fafb",
                borderRadius: "12px",
                boxShadow: `0 2px 8px ${themeColors.shadow}`,
                marginBottom: "24px",
              }}
            >
              {/* Home Button */}
              <button
                onClick={() => {
                  console.log("Home clicked");
                  navigate("/gallery");
                }}
                title="Home"
                style={{
                  padding: "10px 12px",
                  background: isDarkMode ? "#a3e635" : "#a9e532",
                  color: "white",
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = isDarkMode ? "#90db33" : "#94cc29";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = isDarkMode ? "#a3e635" : "#a9e532";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Home
              </button>
              {/* Theme Toggle Button */}
              <button
                onClick={() => {
                  console.log("Toggle Theme clicked");
                  toggleTheme();
                }}
                title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                style={{
                  padding: "10px 12px",
                  background: themeColors.buttonGradient,
                  color: themeColors.text,
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = themeColors.buttonHover;
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = themeColors.buttonGradient;
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {theme === "light" ? (
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  ) : (
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"></path>
                  )}
                </svg>
                Toggle Theme
              </button>

              {/* Expand All Button */}
              <button
                onClick={() => {
                  console.log("Expand All clicked");
                  expandAll();
                }}
                title="Expand All"
                style={{
                  padding: "10px 12px",
                  background: isDarkMode ? "#2dd4bf" : "#14b8a6",
                  color: "white",
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = isDarkMode ? "#26c6ab" : "#0ca678";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = isDarkMode ? "#2dd4bf" : "#14b8a6";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3h18v18H3z"></path>
                  <path d="M12 8v8"></path>
                  <path d="M8 12h8"></path>
                </svg>
                Expand All
              </button>

              {/* Update Layout Button */}
              {handleUpdateLayout && (
                <button
                  onClick={() => {
                    console.log("Update Layout clicked");
                    handleUpdateLayout();
                  }}
                  title="Update Layout"
                  style={{
                    padding: "10px 12px",
                    background: themeColors.buttonGradient,
                    color: themeColors.text,
                    border: `1px solid ${themeColors.border}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = themeColors.buttonHover;
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = themeColors.buttonGradient;
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10.5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6.5" />
                    <path d="M3 10V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v3" />
                    <path d="M12 12v7" />
                    <path d="M9 16h6" />
                  </svg>
                  Update Layout
                </button>
              )}

              {/* Collapse All Button */}
              <button
                onClick={() => {
                  console.log("Collapse All clicked");
                  collapseAll();
                }}
                title="Collapse All"
                style={{
                  padding: "10px 12px",
                  background: isDarkMode ? "#6b7280" : "#6b7280",
                  color: "white",
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = isDarkMode ? "#7b8694" : "#7b8694";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = isDarkMode ? "#6b7280" : "#6b7280";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 3h18v18H3z"></path>
                  <path d="M8 12h8"></path>
                </svg>
                Collapse All
              </button>

              {/* Reset View Button */}
              <button
                onClick={() => {
                  console.log("Reset View clicked");
                  resetView();
                }}
                title="Reset View"
                style={{
                  padding: "10px 12px",
                  background: isDarkMode ? "#ef4444" : "#dc3545",
                  color: "white",
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = isDarkMode ? "#f87171" : "#e02424";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = isDarkMode ? "#ef4444" : "#dc3545";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 1 1 9 9 9 9 0 0 1-9-9"></path>
                  <path d="M3 12V3h9"></path>
                </svg>
                Reset View
              </button>

              {/* View Mode Toggle Button */}
              {viewMode === "flow" ? (
                <button
                  onClick={() => {
                    console.log("Grid View clicked");
                    setViewMode("grid");
                  }}
                  title="Grid View"
                  style={{
                    padding: "10px 12px",
                    background: isDarkMode ? "#3b82f6" : "#2563eb",
                    color: "white",
                    border: `1px solid ${themeColors.border}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = isDarkMode ? "#60a5fa" : "#3b82f6";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = isDarkMode ? "#3b82f6" : "#2563eb";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"></path>
                  </svg>
                  Grid View
                </button>
              ) : (
                <button
                  onClick={() => {
                    console.log("Flow View clicked");
                    setViewMode("flow");
                  }}
                  title="Flow View"
                  style={{
                    padding: "10px 12px",
                    background: isDarkMode ? "#facc15" : "#f59e0b",
                    color: "black",
                    border: `1px solid ${themeColors.border}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = isDarkMode ? "#fde047" : "#fb923c";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = isDarkMode ? "#facc15" : "#f59e0b";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18V5l12-2v13"></path>
                    <path d="M9 12l12-2"></path>
                    <path d="M9 6l12-2"></path>
                  </svg>
                  Flow View
                </button>
              )}
            </div>

            {/* Details Section */}
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                letterSpacing: "-0.025em",
                marginBottom: "16px",
                color: themeColors.text,
              }}
            >
              {selectedDetails?.label || "Details"}
            </div>

            {/* Properties Panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Selected Nodes */}
              {selectedDetails?.nodeInfo && Array.isArray(selectedDetails.nodeInfo) && (
                <div
                  style={{
                    padding: "16px",
                    background: isDarkMode ? "#2d3748" : "#f9fafb",
                    borderRadius: "12px",
                    boxShadow: `0 2px 8px ${themeColors.shadow}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      marginBottom: "12px",
                      color: themeColors.text,
                    }}
                  >
                    Selected Nodes
                  </div>
                  {selectedDetails.nodeInfo.map((node, index) => (
                    <button
                      key={node.id}
                      style={{
                        padding: "12px",
                        background: themeColors.buttonBg,
                        color: themeColors.text,
                        border: `1px solid ${themeColors.border}`,
                        borderRadius: "8px",
                        marginBottom: "8px",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = themeColors.buttonHover;
                        e.currentTarget.style.transform = "scale(1.01)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = themeColors.buttonBg;
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                      onClick={() => console.log(`Node clicked: ${node.id}`)}
                    >
                      <div style={{ fontWeight: "600" }}>
                        {index + 1}. {node.title} (ID: {node.id})
                      </div>
                      <div style={{ fontSize: "0.85rem", color: isDarkMode ? "#94a3b8" : "#6b7280" }}>
                        {node.description}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Path Edges with Scroll */}
              {selectedDetails?.pathEdges?.length > 0 ? (
                <div
                  className="path-edges"
                  style={{
                    padding: "16px",
                    background: isDarkMode ? "#2d3748" : "#f9fafb",
                    borderRadius: "12px",
                    boxShadow: `0 2px 8px ${themeColors.shadow}`,
                    maxHeight: "300px",
                    overflowY: "auto",
                    scrollBehavior: "smooth",
                  }}
                >
                  <div
                    className="path-edges-title"
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      marginBottom: "12px",
                      color: themeColors.text,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    Path Edges
                    <button
                      className="print-button"
                      onClick={() => {
                        console.log("Print Path clicked");
                        window.print();
                      }}
                      title="Print Path"
                      style={{
                        padding: "10px 12px",
                        background: themeColors.buttonGradient,
                        color: themeColors.text,
                        border: `1px solid ${themeColors.border}`,
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        transition: "all 0.2s ease",
                        width: "fit-content",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = themeColors.buttonHover;
                        e.currentTarget.style.transform = "scale(1.02)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = themeColors.buttonGradient;
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9V2h12v7" />
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <path d="M6 14h12v8H6z" />
                      </svg>
                    </button>
                  </div>
                  {selectedDetails.pathEdges.map((edge, index) => (
                    <div
                      key={edge.id}
                      className="path-edge-item"
                      style={{
                        padding: "12px",
                        background: themeColors.buttonBg,
                        color: themeColors.text,
                        border: `1px solid ${themeColors.border}`,
                        borderRadius: "8px",
                        marginBottom: "8px",
                        textAlign: "left",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      <div style={{ fontWeight: "600" }}>
                        {index + 1}. {edge.source} → {edge.target}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: isDarkMode ? "#94a3b8" : "#6b7280" }}>
                        ({edge.sourceHandle || edge.source} → {edge.targetHandle || edge.target})
                      </div>
                    </div>
                  ))}
                  
                </div>
              ) : (
                <div
                  style={{
                    padding: "16px",
                    background: isDarkMode ? "#2d3748" : "#f9fafb",
                    borderRadius: "12px",
                    boxShadow: `0 2px 8px ${themeColors.shadow}`,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      color: isDarkMode ? "#94a3b8" : "#6b7280",
                      fontSize: "0.9rem",
                    }}
                  >
                    No paths available.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;