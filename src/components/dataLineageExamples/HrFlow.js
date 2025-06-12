import React, { useCallback, useState, useEffect, useMemo } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { useReactFlow } from "reactflow";
// import LineageData from './lineageData.json';

import SampleData from '../SampleData';
import { motion, AnimatePresence } from "framer-motion";
import {useNavigate} from "react-router-dom";


// Destructure the required objects from LineageData
const LineageData = {
  "initialNodes": [
    { "id": "header-A", "type": "header", "position": { "x": 100, "y": 20 }, "data": { "label": "Application" } },
    { "id": "E1", "type": "dropdownNode", "position": { "x": 100, "y": 80 }, "data": {
      "title": "Recruitment", "items": [{ "label": "Apply" }, { "label": "Interview" }], "expanded": true
    }},
    { "id": "header-B", "type": "header", "position": { "x": 500, "y": 20 }, "data": { "label": "HR Ops" } },
    { "id": "E2", "type": "dropdownNode", "position": { "x": 500, "y": 80 }, "data": {
      "title": "Onboarding", "items": [{ "label": "DocumentCheck" }, { "label": "OfferLetter" }], "expanded": true
    }},
    { "id": "header-C", "type": "header", "position": { "x": 900, "y": 20 }, "data": { "label": "IT Setup" } },
    { "id": "E3", "type": "dropdownNode", "position": { "x": 900, "y": 80 }, "data": {
      "title": "System Access", "items": [{ "label": "EmailSetup" }, { "label": "LaptopAssign" }], "expanded": true
    }}
  ],
  "pathEdgesMap": {
    "Apply": [
      { "id": "Apply-Interview", "source": "E1", "sourceHandle": "Apply", "target": "E1", "targetHandle": "Interview", "animated": true, "style": { "stroke": "#f97316", "strokeWidth": 2 } },
      { "id": "Interview-DocumentCheck", "source": "E1", "sourceHandle": "Interview", "target": "E2", "targetHandle": "DocumentCheck", "animated": true, "style": { "stroke": "#f97316", "strokeWidth": 2 } },
      { "id": "DocumentCheck-OfferLetter", "source": "E2", "sourceHandle": "DocumentCheck", "target": "E2", "targetHandle": "OfferLetter", "animated": true, "style": { "stroke": "#f97316", "strokeWidth": 2 } },
      { "id": "OfferLetter-EmailSetup", "source": "E2", "sourceHandle": "OfferLetter", "target": "E3", "targetHandle": "EmailSetup", "animated": true, "style": { "stroke": "#f97316", "strokeWidth": 2 } }
    ]
  },
  "newEdges": [
    { "id": "Apply-Interview", "source": "E1", "sourceHandle": "Apply", "target": "E1", "targetHandle": "Interview", "animated": true, "style": { "stroke": "#f97316", "strokeWidth": 2 } },
    { "id": "Interview-DocumentCheck", "source": "E1", "sourceHandle": "Interview", "target": "E2", "targetHandle": "DocumentCheck", "animated": true, "style": { "stroke": "#f97316", "strokeWidth": 2 } },
    { "id": "DocumentCheck-OfferLetter", "source": "E2", "sourceHandle": "DocumentCheck", "target": "E2", "targetHandle": "OfferLetter", "animated": true, "style": { "stroke": "#f97316", "strokeWidth": 2 } },
    { "id": "OfferLetter-EmailSetup", "source": "E2", "sourceHandle": "OfferLetter", "target": "E3", "targetHandle": "EmailSetup", "animated": true, "style": { "stroke": "#f97316", "strokeWidth": 2 } }
  ],
  "tracePaths": {
    "Apply": ["E1", "Apply", "E1", "Interview", "E2", "DocumentCheck", "E2", "OfferLetter", "E3", "EmailSetup"]
  }
}

const { pathEdgesMap, newEdges, initialNodes, tracePaths } = LineageData;

const CustomDropdownNode = ({ id, data, depth = 0 }) => {
  const width = 280 - (depth * 35);
  const [isExpanded, setIsExpanded] = useState(false);
  const isDarkMode = data.theme === 'dark';

  // Theme-aware colors
  const colors = {
    primary: isDarkMode ? "#a78bfa" : "#7c3aed",
    background: isDarkMode ? "#1e2a44" : "#ffffff",
    border: isDarkMode ? "#3b4a6b" : "#e5e7eb",
    text: isDarkMode ? "#d1d5db" : "#1f2937",
    textLight: isDarkMode ? "#9ca3af" : "#6b7280",
    shadow: isDarkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.07)",
    hover: isDarkMode ? "#2a3b5b" : "#f3f4f6",
    success: isDarkMode ? "#2dd4bf" : "#14b8a6",
    itemBg: isDarkMode ? "#2a3b5b" : "#f9fafb",
    toggleBg: isDarkMode ? "#3b4a6b" : "#d1d5db",
    highlightBorder: isDarkMode ? "#60a5fa" : "#3b82f6", // Added for node highlighting
  };

  // Combine items and nestedNodes into a single array for counting and limiting
  const subNodes = [
    ...(data.items || []),
    ...(data.nestedNodes || []).map(node => ({ label: node.id, type: "nested" })),
  ];
  const subNodeCount = subNodes.length;
  const maxVisible = 4;
  const visibleSubNodes = isExpanded ? subNodes : subNodes.slice(0, maxVisible);
  const hasMoreNodes = subNodeCount > maxVisible;

  const nodeStyle = {
    padding: "6px",
    background: `linear-gradient(145deg, ${colors.background}, ${isDarkMode ? "#172135" : "#f9fafb"})`,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    width: width,
    pointerEvents: "auto",
    boxShadow: `0 10px 30px ${colors.shadow}`,
    fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
    transition: "all 0.3s ease",
    transform: "translateZ(0)",
    borderColor: data.isHighlighted ? colors.highlightBorder : colors.border, // Highlight border
    borderWidth: data.isHighlighted ? 2 : 1,
  };

  return (
    <motion.div
      style={nodeStyle}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ boxShadow: `0 12px 35px ${colors.shadow}`, transform: "translateY(-2px)" }}
      transition={{ duration: 0.2 }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          top: 24,
          left: -5,
          background: colors.primary,
          width: 12,
          height: 12,
          borderRadius: "50%",
          border: `2px solid ${isDarkMode ? "#1e2a44" : "#ffffff"}`,
          transition: "all 0.2s ease",
        }}
      />

      <div
        onClick={() => data.toggleExpanded?.(id)}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 10px",
          marginBottom: 10,
          cursor: "pointer",
          borderRadius: 8,
          background: data.expanded ? `${colors.primary}20` : "transparent",
          transition: "all 0.3s ease",
        }}
      >
        <motion.div
          style={{
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
            borderRadius: "50%",
            background: data.expanded ? colors.primary : colors.border,
            color: data.expanded ? "white" : colors.primary,
          }}
          animate={{ rotate: data.expanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </motion.div>
        <strong style={{
          fontSize: "1rem",
          color: data.expanded ? colors.primary : colors.text,
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}>
          {data.title} {subNodeCount > 0 && `(${subNodeCount})`}
        </strong>
      </div>

      <AnimatePresence>
        {data.expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginTop: 8 }}
          >
            <ul style={{
              listStyle: "none",
              paddingLeft: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}>
              {visibleSubNodes.map((subNode, index) =>
                subNode.type === "nested" ? (
                  <motion.div
                    key={subNode.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    style={{
                      marginTop: 4,
                      paddingLeft: 20,
                      borderLeft: `3px solid ${colors.border}`,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 10,
                        top: -6,
                        width: 10,
                        height: 20,
                        borderLeft: `3px solid ${colors.border}`,
                        borderBottom: `3px solid ${colors.border}`,
                        borderBottomLeftRadius: 6,
                      }}
                    />
                    <CustomDropdownNode
                      id={subNode.label}
                      data={{
                        ...data.nestedNodes.find(n => n.id === subNode.label).data,
                        onSelect: data.onSelect,
                        toggleExpanded: data.toggleExpanded,
                        setEdges: data.setEdges,
                        onShowDetails: data.onShowDetails,
                        onShowTrace: data.onShowTrace,
                        theme: data.theme,
                        isHighlighted: data.isHighlighted, // Pass down highlight state
                      }}
                      depth={depth + 1}
                    />
                  </motion.div>
                ) : (
                  <motion.li
                    key={subNode.label}
                    style={{
                      position: "relative",
                      padding: "6px 14px",
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
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{
                      background: colors.hover,
                      boxShadow: `0 6px 16px ${colors.shadow}`,
                      transform: "translateY(-2px)",
                    }}
                    onClick={() => data.onSelect?.(subNode)}
                    onDoubleClick={() => data.onShowTrace?.(subNode.label)}
                  >
                    <Handle
                      type="source"
                      position={Position.Right}
                      id={subNode.label}
                      style={{
                        top: 22,
                        right: -5,
                        background: colors.success,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        border: `2px solid ${isDarkMode ? "#1e2a44" : "#ffffff"}`,
                        transition: "all 0.2s ease",
                      }}
                    />
                    <Handle
                      type="target"
                      position={Position.Left}
                      id={subNode.label}
                      style={{
                        top: 22,
                        left: -5,
                        background: colors.success,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        border: `2px solid ${isDarkMode ? "#1e2a44" : "#ffffff"}`,
                        transition: "all 0.2s ease",
                      }}
                    />
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      flex: "1 1 auto",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {/* <span style={{
                        display: "inline-block",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: colors.primary,
                        marginRight: 10,
                      }}></span> */}
                      {subNode.label}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.15, background: isDarkMode ? "#2dd4bf" : "#0ca678" }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        marginLeft: 6,
                        padding: "4px",
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: colors.success,
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        boxShadow: `0 2px 8px ${colors.shadow}`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const pathEdges = pathEdgesMap?.[subNode.label];
                        if (pathEdges && pathEdges.length) {
                          data.setEdges(pathEdges);
                          data.onShowDetails?.(subNode.label, pathEdges);
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                      </svg>
                    </motion.button>
                  </motion.li>
                )
              )}
            </ul>
            {hasMoreNodes && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  marginTop: 8,
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
                }}
                whileHover={{
                  background: colors.hover,
                  transform: "translateY(-1px)",
                  boxShadow: `0 4px 12px ${colors.shadow}`,
                }}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show Less" : `More ${subNodeCount - maxVisible} nodes available, click to see`}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          top: 24,
          right: -5,
          background: colors.primary,
          width: 12,
          height: 12,
          borderRadius: "50%",
          border: `2px solid ${isDarkMode ? "#1e2a44" : "#ffffff"}`,
          transition: "all 0.2s ease",
        }}
      />
    </motion.div>
  );
};

const HeaderNode = ({ data }) => {
  const isDarkMode = data.theme === 'dark';
  return (
    <div style={{
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: isDarkMode ? "#d1d5db" : "#333",
      background: isDarkMode ? "linear-gradient(145deg, #1e2a44, #172135)" : "#ffffff",
      padding: "8px 12px",
      borderRadius: 8,
      boxShadow: isDarkMode ? "0 4px 12px rgba(0, 0, 0, 0.5)" : "0 4px 12px rgba(0, 0, 0, 0.07)",
      transition: 'all 0.3s ease',
      border: data.isHighlighted ? `2px solid ${isDarkMode ? "#60a5fa" : "#3b82f6"}` : "none",
    }}>
      {data.label}
    </div>
  );
};

const nodeTypes = {
  dropdownNode: CustomDropdownNode,
  header: HeaderNode,
};

const headerToStackMap = {
  "header-A": "E0",
  "header-B": "E11",
  "header-C": "E21",
  "header-D": "E31",
  "header-E": "E41",
  "header-F": "E51",
  "header-G": "E61",
  "header-H": "E76",
};

const showTraceFrom = (label, setNodes, setEdges, showDetailsPanel) => {
  const collapseAllNodes = (nodesList) => {
    const collapseRecursively = (node) => {
      let collapsedNode = {
        ...node,
        data: {
          ...node.data,
          expanded: false,
        },
      };
      if (collapsedNode.data?.nestedNodes?.length > 0) {
        collapsedNode.data.nestedNodes = collapsedNode.data.nestedNodes.map(collapseRecursively);
      }
      return collapsedNode;
    };
    return nodesList.map(collapseRecursively);
  };

  const filterTracePath = (label, nodesList) => {
    const allPaths = tracePaths[label];
    const traceIds = new Set();

    if (Array.isArray(allPaths[0])) {
      allPaths.forEach(path => path.forEach(id => traceIds.add(id)));
    } else {
      allPaths.forEach(id => traceIds.add(id));
    }

    const expandOnlyTrace = (node) => {
      const shouldExpand = traceIds.has(node.id);
      let updatedItems = node.data?.items?.filter((item) => traceIds.has(item.label)) || [];
      let updatedNestedNodes = [];
      if (node.data?.nestedNodes?.length > 0) {
        updatedNestedNodes = node.data.nestedNodes
          .map(expandOnlyTrace)
          .filter(n => n !== null);
      }

      if (shouldExpand || updatedItems.length > 0 || updatedNestedNodes.length > 0) {
        return {
          ...node,
          data: {
            ...node.data,
            expanded: true,
            items: updatedItems,
            nestedNodes: updatedNestedNodes,
          },
        };
      }

      return null;
    };

    return nodesList.map(expandOnlyTrace).filter(n => n !== null);
  };

  setNodes((prev) => filterTracePath(label, collapseAllNodes(prev)));
  setEdges(newEdges);
  showDetailsPanel(label, newEdges);
};

const findFullPathEdges = (edge) => {
  const source = edge.sourceHandle;
  const path = pathEdgesMap[source];
  if (!path) return [];
  return path.map(e => e.id);
};

const FlowCanvas = () => {
  const { setCenter } = useReactFlow();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const reactFlowRef = React.useRef(null);
  const [uploadError, setUploadError] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showJsonInput, setShowJsonInput] = useState(false);

const navigate = useNavigate();
  const [nodes, setNodes, rawOnNodesChange] = useNodesState(initialNodes);
  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => {
      let updated = [...nds];

      changes.forEach(change => {
        if (change.type === "position" && change.id && change.position) {
          Object.entries(headerToStackMap).forEach(([headerId, stackId]) => {
            if (change.id === stackId) {
              const stackNode = nds.find(n => n.id === stackId);
              const headerNode = nds.find(n => n.id === headerId);

              if (stackNode && headerNode) {
                const offsetX = stackNode.position.x - headerNode.position.x;
                const offsetY = stackNode.position.y - headerNode.position.y;

                updated = updated.map(n => {
                  if (n.id === headerId) {
                    return {
                      ...n,
                      position: {
                        x: change.position.x - offsetX,
                        y: change.position.y - offsetY,
                      },
                    };
                  }
                  return n;
                });
              }
            }
          });
        }
      });

      return updated;
    });

    rawOnNodesChange(changes);
  }, [rawOnNodesChange, setNodes]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedPathEdgeIds, setSelectedPathEdgeIds] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [highlightedNodes, setHighlightedNodes] = useState([]);

  useEffect(() => {
    let allEdges = [];
    Object.values(pathEdgesMap).forEach((edges) => {
      allEdges = [...allEdges, ...edges];
    });
    setEdges(allEdges);
  }, [setEdges]);

  const resetView = useCallback(() => {
    setNodes(initialNodes.map(node => {
      if (node.type === "dropdownNode") {
        const resetNode = {
          ...node,
          data: {
            ...node.data,
            expanded: true,
            theme,
          },
        };

        if (resetNode.data?.nestedNodes?.length > 0) {
          const resetNestedNodes = (nestedNodes) => {
            return nestedNodes.map(nested => ({
              ...nested,
              data: {
                ...nested.data,
                expanded: true,
                nestedNodes: nested.data?.nestedNodes ? resetNestedNodes(nested.data.nestedNodes) : [],
                theme,
              },
            }));
          };
          resetNode.data.nestedNodes = resetNestedNodes(resetNode.data.nestedNodes);
        }

        return resetNode;
      }
      return { ...node, data: { ...node.data, theme } };
    }));

    let allEdges = [];
    Object.values(pathEdgesMap).forEach((edges) => {
      allEdges = [...allEdges, ...edges];
    });
    setEdges(allEdges);

    setSelectedDetails(null);
    setHighlightedNodes([]);
    setSelectedPathEdgeIds([]);
  }, [setNodes, setEdges, theme]);

  const handleJsonUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);

        if (
          parsed.initialNodes &&
          parsed.pathEdgesMap &&
          parsed.newEdges &&
          parsed.tracePaths
        ) {
          setUploadError(null);
          setNodes(parsed.initialNodes.map(node => ({
            ...node,
            data: { ...node.data, theme },
          })));
          setEdges(parsed.newEdges);

          Object.assign(tracePaths, parsed.tracePaths);
          Object.assign(pathEdgesMap, parsed.pathEdgesMap);
        } else {
          setUploadError("Uploaded JSON does not match the required format.");
        }
      } catch (err) {
        setUploadError("Failed to parse JSON file.");
      }
    };

    reader.readAsText(file);
  };

  const handleJsonDownload = () => {
    const data = {
      initialNodes,
      pathEdgesMap,
      newEdges,
      tracePaths,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lineageData.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDropdownSelect = useCallback(({ label }) => {
    console.log("Selected:", label);
    const pathEdges = pathEdgesMap[label];

    if (pathEdges && pathEdges.length) {
      setEdges(pathEdges);
      setSelectedDetails({ label, pathEdges });
      const nodeIds = new Set(pathEdges.flatMap(edge => [edge.source, edge.target]));
      setHighlightedNodes([...nodeIds]);
      setIsSidebarOpen(true);
    } else {
      setHighlightedNodes([]);
    }
  }, [setEdges]);

  const toggleExpanded = useCallback((id) => {
    const toggleNodeExpanded = (nodesList) => {
      return nodesList.map(node => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              expanded: !node.data.expanded,
              theme,
            },
          };
        }

        if (node.data?.nestedNodes?.length > 0) {
          return {
            ...node,
            data: {
              ...node.data,
              nestedNodes: toggleNodeExpanded(node.data.nestedNodes),
              theme,
            },
          };
        }

        return node;
      });
    };

    setNodes(prevNodes => toggleNodeExpanded(prevNodes));
  }, [setNodes, theme]);

  const expandAll = useCallback(() => {
    const expandAllNodes = (nodesList) => {
      return nodesList.map(node => {
        if (node.type === "dropdownNode") {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              expanded: true,
              theme,
            },
          };

          if (updatedNode.data?.nestedNodes?.length > 0) {
            updatedNode.data.nestedNodes = expandAllNodes(node.data.nestedNodes);
          }

          return updatedNode;
        }
        return { ...node, data: { ...node.data, theme } };
      });
    };

    setNodes(prevNodes => expandAllNodes(prevNodes));
  }, [setNodes, theme]);

  const collapseAll = useCallback(() => {
    const collapseAllNodes = (nodesList) => {
      return nodesList.map(node => {
        if (node.type === "dropdownNode") {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              expanded: false,
              theme,
            },
          };

          if (updatedNode.data?.nestedNodes?.length > 0) {
            updatedNode.data.nestedNodes = collapseAllNodes(node.data.nestedNodes);
          }

          return updatedNode;
        }
        return { ...node, data: { ...node.data, theme } };
      });
    };

    setNodes(prevNodes => collapseAllNodes(prevNodes));
  }, [setNodes, theme]);

  const showDetailsPanel = (label, pathEdges) => {
    setSelectedDetails({ label, pathEdges });
    const nodeIds = new Set(pathEdges.flatMap(edge => [edge.source, edge.target]));
    setHighlightedNodes([...nodeIds]);
    setIsSidebarOpen(true);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const updateNodesWithCallbacks = useMemo(() => {
    return (nodesList) => {
      return nodesList.map(node => {
        if (node.type === "dropdownNode") {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              onSelect: handleDropdownSelect,
              toggleExpanded,
              setEdges,
              onShowDetails: showDetailsPanel,
              onShowTrace: (label) => showTraceFrom(label, setNodes, setEdges, showDetailsPanel),
              theme,
              isHighlighted: highlightedNodes.includes(node.id), // Add highlight state
            },
          };

          if (updatedNode.data?.nestedNodes?.length > 0) {
            updatedNode.data.nestedNodes = updateNodesWithCallbacks(updatedNode.data.nestedNodes);
          }

          return updatedNode;
        }
        return {
          ...node,
          data: {
            ...node.data,
            theme,
            isHighlighted: highlightedNodes.includes(node.id), // Add highlight state for header nodes
          },
        };
      });
    };
  }, [handleDropdownSelect, toggleExpanded, setEdges, setNodes, theme, highlightedNodes]);

  const updatedNodes = useMemo(() => updateNodesWithCallbacks(nodes), [nodes, updateNodesWithCallbacks]);

  const searchNodes = useCallback((searchValue) => {
    const results = [];

    const searchInNodes = (nodesList, path = []) => {
      nodesList.forEach(node => {
        if (node.type === "dropdownNode") {
          const titleMatch = node.data?.title?.toLowerCase().includes(searchValue);
          const itemMatch = node.data?.items?.some(item =>
            item.label.toLowerCase().includes(searchValue)
          );

          const childMatches = [];

          const checkNestedNodes = (nestedNodes, parentPath) => {
            nestedNodes.forEach(nested => {
              const nestedTitleMatch = nested.data?.title?.toLowerCase().includes(searchValue);
              const nestedItemMatch = nested.data?.items?.some(item =>
                item.label.toLowerCase().includes(searchValue)
              );
              if (nestedTitleMatch || nestedItemMatch) {
                childMatches.push({ ...nested, path: [...parentPath, node.id] });
              }
              if (nested.data?.nestedNodes?.length > 0) {
                checkNestedNodes(nested.data.nestedNodes, [...parentPath, node.id]);
              }
            });
          };

          if (node.data?.nestedNodes?.length > 0) {
            checkNestedNodes(node.data.nestedNodes, path);
          }

          if (titleMatch || itemMatch) {
            results.push({ ...node, path: [...path] });
          }

          results.push(...childMatches);
        }
      });
    };

    searchInNodes(nodes);
    return results;
  }, [nodes]);

  return (
    <><div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      background: theme === 'dark' ? 'linear-gradient(145deg, #0f172a, #1e293b)' : '#f3f4f6',
      color: theme === 'dark' ? '#d1d5db' : '#1f2937',
      transition: 'all 0.3s ease',
      position: 'relative',
    }}>
      <div style={{ flex: 1, position: "relative" }}>
        <div style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
          background: theme === 'dark' ? 'linear-gradient(145deg, #1e2a44, #172135)' : '#ffffff',
          padding: '16px',
          borderRadius: 12,
          boxShadow: theme === 'dark' ? '0 10px 30px rgba(0, 0, 0, 0.5)' : '0 8px 24px rgba(0, 0, 0, 0.07)',
          transition: 'all 0.3s ease',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search node..."
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase();
                  setSearchTerm(value);
                  if (value) {
                    const results = searchNodes(value);
                    setSearchResults(results);
                  } else {
                    setSearchResults([]);
                  }
                }}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: `1px solid ${theme === 'dark' ? '#3b4a6b' : '#d1d5db'}`,
                  background: theme === 'dark' ? '#2a3b5b' : '#ffffff',
                  color: theme === 'dark' ? '#d1d5db' : '#1f2937',
                  width: 200,
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  boxShadow: theme === 'dark' ? 'inset 0 2px 4px rgba(0, 0, 0, 0.3)' : 'none',
                }} />
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '245px' }}><SampleData /></div>
            </div>
            <div style={{ position: 'relative' }}>
              <button
                onClick={toggleTheme}
                title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
                style={{
                  padding: "8px",
                  background: theme === 'dark' ? '#3b4a6b' : '#d1d5db',
                  color: theme === 'dark' ? '#d1d5db' : '#1f2937',
                  border: 'none',
                  borderRadius: 8,
                  cursor: "pointer",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  transition: 'all 0.3s ease',
                  boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.07)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = theme === 'dark' ? '#4b5a7b' : '#e5e7eb';
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = theme === 'dark' ? '#3b4a6b' : '#d1d5db';
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {theme === 'light' ? (
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  ) : (
                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"></path>
                  )}
                </svg>
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <button
                onClick={expandAll}
                title="Expand All"
                style={{
                  padding: "8px",
                  background: theme === 'dark' ? '#2dd4bf' : '#14b8a6',
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  transition: 'all 0.3s ease',
                  boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.07)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = theme === 'dark' ? '#26c6ab' : '#0ca678';
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = theme === 'dark' ? '#2dd4bf' : '#14b8a6';
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3h18v18H3z"></path>
                  <path d="M12 8v8"></path>
                  <path d="M8 12h8"></path>
                </svg>
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <button
                onClick={collapseAll}
                title="Collapse All"
                style={{
                  padding: "8px",
                  background: theme === 'dark' ? '#6b7280' : '#6b7280',
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  transition: 'all 0.3s ease',
                  boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.07)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = theme === 'dark' ? '#7b8694' : '#7b8694';
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = theme === 'dark' ? '#6b7280' : '#6b7280';
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3h18v18H3z"></path>
                  <path d="M8 12h8"></path>
                </svg>
              </button>
            </div>
            <div style={{ position: 'relative' }}>
  {/* <button
    onClick={() => navigate("/gallery")}
    title="Gallery"
    style={{
      padding: "8px",
      background: theme === 'dark' ? '#a3e635' : '#a9e532',
      color: "white",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 36,
      height: 36,
      transition: 'all 0.3s ease',
      boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.07)',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.background = theme === 'dark' ? '#90db33' : '#94cc29';
      e.currentTarget.style.transform = "scale(1.05)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.background = theme === 'dark' ? '#a3e635' : '#a9e532';
      e.currentTarget.style.transform = "scale(1)";
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <path d="M21 15l-5-5L5 21"></path>
    </svg>
  </button> */}
</div>

            <div style={{ position: 'relative' }}>
              <button
                onClick={resetView}
                title="Reset View"
                style={{
                  padding: "8px",
                  background: theme === 'dark' ? '#ef4444' : '#dc3545',
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  transition: 'all 0.3s ease',
                  boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.07)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = theme === 'dark' ? '#f87171' : '#e02424';
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = theme === 'dark' ? '#ef4444' : '#dc3545';
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 1 9 9 9 9 0 0 1-9-9"></path>
                  <path d="M3 12V3h9"></path>
                </svg>
              </button>
            </div>

            <div>
      <button 
        onClick={() => setShowJsonInput(!showJsonInput)}
        style={{
          width: 200,
          marginTop: "8px",
          padding: "6px 12px",
          fontSize: "0.85rem",
          background: "#10b981",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        {showJsonInput ? 'Hide JSON Input' : 'Add your Json Input'}
      </button>

      {showJsonInput && (
        <div style={{ position: 'relative', marginTop: '8px' }}>
          <textarea
            id="jsonTextArea"
            rows={10}
            placeholder="Paste JSON data here..."
            style={{
              width: 300,
              padding: "8px",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              borderRadius: 8,
              border: `1px solid ${theme === 'dark' ? '#4b5a7b' : '#d1d5db'}`,
              background: theme === 'dark' ? '#1e2a44' : '#ffffff',
              color: theme === 'dark' ? '#d1d5db' : '#1f2937',
              resize: 'vertical',
            }} 
          />
          <button
            onClick={() => {
              const textarea = document.getElementById('jsonTextArea');
              try {
                const parsed = JSON.parse(textarea.value);
                if (parsed.initialNodes && parsed.pathEdgesMap && parsed.newEdges && parsed.tracePaths) {
                  setUploadError(null);
                  setNodes(parsed.initialNodes.map(node => ({
                    ...node,
                    data: { ...node.data, theme },
                  })));
                  setEdges(parsed.newEdges);
                  Object.assign(tracePaths, parsed.tracePaths);
                  Object.assign(pathEdgesMap, parsed.pathEdgesMap);
                } else {
                  alert("JSON format is invalid.");
                }
              } catch (e) {
                alert("Failed to parse JSON.");
              }
            }}
            style={{
              marginTop: "8px",
              padding: "6px 12px",
              fontSize: "0.85rem",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            Load JSON
          </button>
        </div>
      )}
    </div>

          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={handleJsonDownload}
              title="Download JSON"
              style={{
                padding: "8px",
                marginTop: "10px",
                background: theme === 'dark' ? '#3b4a6b' : '#d1d5db',
                color: theme === 'dark' ? '#d1d5db' : '#1f2937',
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                transition: 'all 0.3s ease',
                boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.07)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = theme === 'dark' ? '#4b5a7b' : '#e5e7eb';
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = theme === 'dark' ? '#3b4a6b' : '#d1d5db';
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
          </div>
          {/* <div style={{ position: 'relative' }}>
            <input
              type="file"
              accept=".json"
              onChange={handleJsonUpload}
              title="Upload JSON"
              style={{
                padding: "8px",
                fontSize: "0.9rem",
                color: theme === 'dark' ? '#d1d5db' : '#1f2937',
                background: theme === 'dark' ? '#3b4a6b' : '#ffffff',
                border: `1px solid ${theme === 'dark' ? '#3b4a6b' : '#d1d5db'}`,
                borderRadius: 8,
                cursor: "pointer",
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                position: 'absolute',
                top: 0,
                left: 0,
              }} />
            <button
              style={{
                padding: "8px",
                background: theme === 'dark' ? '#3b4a6b' : '#d1d5db',
                color: theme === 'dark' ? '#d1d5db' : '#1f2937',
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                transition: 'all 0.3s ease',
                boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.07)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = theme === 'dark' ? '#4b5a7b' : '#e5e7eb';
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = theme === 'dark' ? '#3b4a6b' : '#d1d5db';
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </button>
          </div> */}
          {/* {uploadError && (
            <span style={{ color: theme === 'dark' ? '#ff6b6b' : '#dc3545', fontSize: "0.85rem" }}>
              {uploadError}
            </span>
          )} */}
          <div />

        </div>
      </div>

      <ReactFlow
        ref={reactFlowRef}
        nodes={updatedNodes.map(node => ({
          ...node,
          style: {
            ...node.style,
            opacity: highlightedNodes.length === 0 || highlightedNodes.includes(node.id) ? 1 : 0.3,
            transition: 'all 0.3s ease',
          },
        }))}
        edges={edges.map(edge => {
          const isHighlighted = selectedPathEdgeIds.includes(edge.id);
          return {
            ...edge,
            style: {
              ...edge.style,
              stroke: isHighlighted
                ? (theme === 'dark' ? '#60a5fa' : '#3b82f6') // Darker blue on hover
                : (theme === 'dark' ? '#6b7280' : '#9ca3af'), // Default gray
              strokeWidth: isHighlighted ? 4 : 2,
              strokeDasharray: "5,5", // Dashed line for both themes
              opacity: selectedPathEdgeIds.length === 0 ? 1 : (isHighlighted ? 1 : 0.2),
              transition: 'all 0.3s ease',
            },
          };
        })}
        onEdgeMouseEnter={(event, edge) => {
          const fullPath = findFullPathEdges(edge);
          setSelectedPathEdgeIds(fullPath);
          const nodeIds = new Set(fullPath.flatMap(id => {
            const edgeObj = edges.find(e => e.id === id);
            return edgeObj ? [edgeObj.source, edgeObj.target] : [];
          }));
          setHighlightedNodes([...nodeIds]);
        }}
        onEdgeMouseLeave={() => {
          setSelectedPathEdgeIds([]);
          setHighlightedNodes([]);
        }}
        onEdgeClick={(event, edge) => {
          const label = edge.sourceHandle;
          const fullPathEdgeObjects = pathEdgesMap[label] || [];
          const fullPathIds = fullPathEdgeObjects.map(e => e.id);
          setSelectedPathEdgeIds(fullPathIds);
          setSelectedDetails({
            label,
            pathEdges: fullPathEdgeObjects,
          });
          const nodeIds = new Set(fullPathEdgeObjects.flatMap(e => [e.source, edge.target]));
          setHighlightedNodes([...nodeIds]);
          setIsSidebarOpen(true);
        }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(params) => setEdges((eds) => addEdge(
          {
            ...params,
            id: `${params.source}-${params.sourceHandle}-${params.target}`,
            style: {
              stroke: theme === 'dark' ? '#6b7280' : '#9ca3af',
              strokeWidth: 2,
              strokeDasharray: "5,5",
            },
          },
          eds
        )
        )}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap
          nodeColor={() => theme === 'dark' ? '#4b5563' : '#d1d5db'}
          maskColor={theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.2)'} />
        <Controls />
        <Background color={theme === 'dark' ? '#374151' : '#e5e7eb'} gap={16} />
      </ReactFlow>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{
          position: 'absolute',
          top: 30,
          right: 20,
          padding: '10px',
          background: theme === 'dark' ? '#3b4a6b' : '#d1d5db',
          color: theme === 'dark' ? '#d1d5db' : '#1f2937',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.07)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = theme === 'dark' ? '#4b5a7b' : '#e5e7eb';
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = theme === 'dark' ? '#3b4a6b' : '#d1d5db';
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isSidebarOpen ? (
            <path d="M6 18L18 6M6 6l12 12"></path>
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18"></path>
          )}
        </svg>
      </button>
    </div><div
      style={{
        width: isSidebarOpen ? 320 : 0,
        height: '100%',
        position: 'absolute',
        right: 0,
        top: 0,
        background: theme === 'dark' ? 'linear-gradient(145deg, #1e2a44, #172135)' : '#f9f9f9',
        borderLeft: isSidebarOpen ? `1px solid ${theme === 'dark' ? '#3b4a6b' : '#d1d5db'}` : 'none',
        padding: isSidebarOpen ? 24 : 0,
        overflow: 'hidden',
        transition: 'width 0.3s ease, padding 0.3s ease',
        zIndex: 5,
      }}
    >
        {isSidebarOpen && (
          <>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: 16,
              color: theme === 'dark' ? '#d1d5db' : '#1f2937'
            }}>
              Properties Panel
            </h3>
            {selectedDetails && selectedDetails.pathEdges ? (
              <>
                <div id="print-section" style={{ marginTop: 20 }}>
                  <div
                    style={{
                      width: '100%',
                      background: theme === 'dark' ? '#2a3b5b' : '#ffffff',
                      borderRadius: 12,
                      padding: 20,
                      boxShadow: theme === 'dark' ? '0 4px 16px rgba(0, 0, 0, 0.5)' : '0 4px 16px rgba(0, 0, 0, 0.07)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        marginBottom: 12,
                        color: theme === 'dark' ? '#d1d5db' : '#1f2937',
                      }}
                    >
                      <strong>Node:</strong> {selectedDetails.label}
                    </p>
                    <p
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        marginBottom: 12,
                        color: theme === 'dark' ? '#d1d5db' : '#1f2937',
                      }}
                    >
                      <strong>Transition Path:</strong>
                    </p>
                    <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
                      {selectedDetails.pathEdges.map((e) => (
                        <div
                          key={e.id}
                          style={{
                            padding: "8px 12px",
                            background: theme === 'dark' ? '#3b4a6b' : '#e5e7eb',
                            margin: "6px 0",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            transition: 'all 0.3s ease',
                            boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
                          }}
                        >
                          <li
                            style={{
                              fontSize: "0.9rem",
                              color: theme === 'dark' ? '#d1d5db' : '#1f2937',
                              display: "inline-block",
                            }}
                          >
                            {e.sourceHandle} ➔ {e.targetHandle}
                          </li>
                        </div>
                      ))}
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => window.print()}
                  style={{
                    marginTop: 20,
                    padding: "10px 20px",
                    background: theme === 'dark' ? '#2dd4bf' : '#14b8a6',
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: 500,
                    width: '100%',
                    transition: 'all 0.3s ease',
                    boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.07)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = theme === 'dark' ? '#26c6ab' : '#0ca678';
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = theme === 'dark' ? '#2dd4bf' : '#14b8a6';
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  Print Path
                </button>
              </>
            ) : (
              <p style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: '0.9rem', letterSpacing: '-0.01em' }}>
                Select a node's ➔ button to view details.
              </p>
            )}
          </>
        )}
      </div></>

  );

};


const App = () => (
  <ReactFlowProvider>
    <FlowCanvas />
  </ReactFlowProvider>
);

export default App;
export { LineageData };