import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import ReactFlow, { addEdge, MiniMap, Controls, Background, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import { useReactFlow } from "reactflow";
import { useLocation } from 'react-router-dom';
import LineageData from "../../lineageData.json";
import CustomDropdownNode from "./CustomDropdownNode";
import HeaderNode from "./HeaderNode";
import Sidebar from "./Sidebar";
import ControlPanel from "./ControlPanel";
import { headerToStackMap, showTraceFrom, findFullPathEdges, searchNodes } from "./utils";
import TraceGridView from "./TraceGridView";
import { filterTracePath } from "./utils";

const nodeTypes = {
  dropdownNode: CustomDropdownNode,
  header: HeaderNode,
};

const FlowCanvas = () => {

  const routeLocation = useLocation();
  const uploadedData = routeLocation.state?.uploadedJson;
  const { pathEdgesMap, newEdges, initialNodes } = uploadedData || LineageData;

  const { setCenter } = useReactFlow();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const reactFlowRef = useRef(null);
  const [theme, setTheme] = useState("light");
  const [viewMode, setViewMode] = useState("flow");
  //print button
  const printSelectedNode = () => {
    if (selectedNodes.length > 0) {
      const nodeId = selectedNodes[0];
      const nodeData = nodes.find((n) => n.id === nodeId)?.data;

      // Path edges from tracePaths
      const tracePath = Array.isArray(LineageData.tracePaths?.[nodeId]) ? LineageData.tracePaths[nodeId] : [];


      // Build pretty path edges
      const formattedTraceEdges = [];
      if (tracePath.length > 1) {for (let i = 0; i < tracePath.length - 1; i++) {
        const from = tracePath[i];
        const to = tracePath[i + 1];

        // Try to find matching edge in pathEdgesMap for sub-label
        const allEdges = Object.values(pathEdgesMap).flat();
        const matching = allEdges.find(e => e.source === from && e.target === to);
        const internalLabel = matching ? `(${matching.sourceHandle || from} → ${matching.targetHandle || to})` : '';

        formattedTraceEdges.push(`${i + 1}. ${from} → ${to} ${internalLabel}`);
      }

      const printableWindow = window.open('', '_blank');
      if (printableWindow) {
        printableWindow.document.write(`
          <html>
            <head>
              <title>Print Node</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; color: #1f2937; }
                h2 { margin-top: 24px; }
                .trace-box {
                  background: #e5e7eb;
                  padding: 10px 14px;
                  margin: 8px 0;
                  border-radius: 8px;
                  font-weight: 500;
                }
                pre {
                  background: #f3f4f6;
                  padding: 10px;
                  border-radius: 6px;
                  font-size: 0.9rem;
                }
              </style>
            </head>
            <body>
              <h2>Node Details</h2>
              <p><strong>Node ID:</strong> ${nodeId}</p>
              <p><strong>Title:</strong> ${nodeData?.title || 'N/A'}</p>
              <p><strong>Description:</strong> ${nodeData?.description || 'No description available'}</p>
  
              <h2>Trace Path Edges</h2>
              ${formattedTraceEdges.length > 0
            ? formattedTraceEdges.map(t => `<div class="trace-box">${t}</div>`).join('')
            : '<p>No trace path available.</p>'}
  
              <h2>Raw Node Data</h2>
              <pre>${JSON.stringify(nodeData, null, 2)}</pre>
            </body>
          </html>
        `);
        printableWindow.document.close();
        printableWindow.print();
      }
    } else {
      alert("No node selected to print.");
    } }
  };



  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const wrappedSetIsSidebarOpen = useCallback(
    (value) => {
      console.log("Setting isSidebarOpen to:", value);
      setIsSidebarOpen(value);
    },
    [setIsSidebarOpen]
  );
  const [nodes, setNodes, rawOnNodesChange] = useNodesState(initialNodes);
  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => {
        let updated = [...nds];

        changes.forEach((change) => {
          if (change.type === "position" && change.id && change.position) {
            Object.entries(headerToStackMap).forEach(([headerId, stackId]) => {
              if (change.id === stackId) {
                const stackNode = nds.find((n) => n.id === stackId);
                const headerNode = nds.find((n) => n.id === headerId);

                if (stackNode && headerNode) {
                  const offsetX = stackNode.position.x - headerNode.position.x;
                  const offsetY = stackNode.position.y - headerNode.position.y;

                  updated = updated.map((n) => {
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
    },
    [rawOnNodesChange, setNodes]
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const wrappedSetEdges = useCallback(
    (newEdges) => {
      console.log("Updating edges in ReactFlow:", newEdges);
      setEdges(newEdges);
    },
    [setEdges]
  );
  //node selections
  const [selectedPathEdgeIds, setSelectedPathEdgeIds] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [pathFilterMode, setPathFilterMode] = useState("both");
  const [selectedNodes, setSelectedNodes] = useState([]);

  useEffect(() => {
    let allEdges = [];
    Object.values(pathEdgesMap).forEach((edges) => {
      allEdges = [...allEdges, ...edges];
    });
    wrappedSetEdges(allEdges);
    console.log("pathEdgesMap contents:", pathEdgesMap);
  }, [wrappedSetEdges]);
  const headers = ["E0", "E11", "E21", "E31", "E41", "E51", "E61", "E76"];

  const renderGridView = () => {
    if (selectedNodes.length > 0) {
      const nodeId = selectedNodes[0];
      const trace = LineageData.tracePaths[nodeId] || [];

      return (
        <div style={{ padding: 30, overflowX: "auto" }}>
          <h2 style={{ marginBottom: 12 }}>Trace Path for <code>{nodeId}</code></h2>
          <table style={{ borderCollapse: "collapse", width: "100%", textAlign: "center" }}>
            <thead>
              <tr>
                {headers.map(h => (
                  <th key={h} style={{ border: "1px solid #ccc", padding: 8, background: "#f9fafb" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {headers.map(h => {
                  const found = trace.find((n, idx) => idx < trace.length - 1 && trace[idx] === h);
                  const next = found ? trace[trace.indexOf(found) + 1] : "";
                  return <td key={h} style={{ border: "1px solid #ccc", padding: 8 }}>{next}</td>;
                })}
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    const allTraces = Object.entries(LineageData.tracePaths).flatMap(([nodeId, trace]) => {
      const row = {};
      for (let i = 0; i < trace.length - 1; i++) {
        const current = trace[i];
        const next = trace[i + 1];
        if (headers.includes(current)) {
          row[current] = next;
        }
      }
      return [row];
    });

    return (
      <div style={{ padding: 30, overflowX: "auto" }}>
        <h2 style={{ marginBottom: 12 }}>📊 Full Trace Path Grid</h2>
        <table style={{ borderCollapse: "collapse", width: "100%", textAlign: "center" }}>
          <thead>
            <tr>
              {headers.map(h => (
                <th key={h} style={{ border: "1px solid #ccc", padding: 8, background: "#f1f5f9" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allTraces.map((row, idx) => (
              <tr key={idx}>
                {headers.map(h => (
                  <td key={h} style={{ border: "1px solid #ccc", padding: 8 }}>
                    {row[h] || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };



  const traceNodePaths = useCallback(
    (nodeIds) => {
      const allEdges = Object.values(pathEdgesMap).flat();
      const visitedEdges = new Set();
      const resultEdges = [];
      const nodeHighlightMap = {}; // nodeId -> 'incoming' | 'outgoing' | 'both'

      const addNode = (id, direction) => {
        if (!nodeHighlightMap[id]) {
          nodeHighlightMap[id] = direction;
        } else if (nodeHighlightMap[id] !== direction) {
          nodeHighlightMap[id] = 'both';
        }
      };
//forward trace path
      const traceForward = (currentId) => {
        for (const edge of allEdges) {
          const isSourceMatch = edge.source === currentId || edge.sourceHandle === currentId;
          if (isSourceMatch && !visitedEdges.has(edge.id)) {
            visitedEdges.add(edge.id);
            resultEdges.push({
              ...edge,
              markerEnd: { type: "arrowclosed", color: theme === "dark" ? "#60a5fa" : "#3b82f6" },
              style: { ...edge.style, stroke: theme === "dark" ? "#60a5fa" : "#3b82f6", strokeWidth: 3, strokeDasharray: "5,5" },
            });
            const nextId = edge.targetHandle || edge.target;
            addNode(nextId, "outgoing");
            traceForward(nextId);
          }
        }
      };
//backword tracepath
      const traceBackward = (currentId) => {
        for (const edge of allEdges) {
          const isTargetMatch = edge.target === currentId || edge.targetHandle === currentId;
          if (isTargetMatch && !visitedEdges.has(edge.id)) {
            visitedEdges.add(edge.id);
            resultEdges.push({
              ...edge,
              markerEnd: { type: "arrowclosed", color: theme === "dark" ? "#f59e0b" : "#d97706" },
              style: { ...edge.style, stroke: theme === "dark" ? "#f59e0b" : "#d97706", strokeWidth: 3, strokeDasharray: "5,5" },
            });
            const prevId = edge.sourceHandle || edge.source;
            addNode(prevId, "incoming");
            traceBackward(prevId);
          }
        }
      };

      nodeIds.forEach((nodeId) => {
        addNode(nodeId, pathFilterMode);
        if (pathFilterMode === "both" || pathFilterMode === "outgoing") traceForward(nodeId);
        if (pathFilterMode === "both" || pathFilterMode === "incoming") traceBackward(nodeId);
      });

      return { resultEdges, connectedNodes: nodeHighlightMap };
    },
    [theme, pathFilterMode]
  );

//reset view function
  const resetView = useCallback(() => {
    setNodes(
      initialNodes.map((node) => {
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
              return nestedNodes.map((nested) => ({
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
      })
    );

    let allEdges = [];
    Object.values(pathEdgesMap).forEach((edges) => {
      allEdges = [...allEdges, ...edges];
    });
    wrappedSetEdges(allEdges);

    setSelectedDetails(null);
    setHighlightedNodes([]);
    setSelectedPathEdgeIds([]);
    setSelectedNodes([]);
  }, [setNodes, wrappedSetEdges, theme]);
//json file rendering blocks
  const handleJsonDownload = () => {
    const data = {
      initialNodes,
      pathEdgesMap,
      newEdges,
      tracePaths: LineageData.tracePaths,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lineageData.json";
    a.click();
    URL.revokeObjectURL(url);
  };


  const handleDropdownSelect = useCallback(
    ({ label }) => {
      if (!label) {
        setSelectedNodes([]);
        let allEdges = Object.values(pathEdgesMap).flat();
        wrappedSetEdges(allEdges);
        setHighlightedNodes([]);
        setSelectedDetails(null);
        wrappedSetIsSidebarOpen(false);
        setSelectedPathEdgeIds([]);
        return;
      }

      console.log("Selected:", label);
      setSelectedNodes((prev) => {
        if (prev.includes(label)) {
          const updatedNodes = prev.filter((id) => id !== label);
          if (updatedNodes.length === 0) {
            let allEdges = Object.values(pathEdgesMap).flat();
            wrappedSetEdges(allEdges);
            setHighlightedNodes([]);
            setSelectedDetails(null);
            wrappedSetIsSidebarOpen(false);
            setSelectedPathEdgeIds([]);
            return updatedNodes;
          }
          const { resultEdges, connectedNodes } = traceNodePaths(updatedNodes);
          wrappedSetEdges(resultEdges);
          setHighlightedNodes(connectedNodes);
          setSelectedPathEdgeIds(resultEdges.map((edge) => edge.id));

          const nodeDetails = updatedNodes.map((nodeId) => {
            const nodeData = nodes.flatMap((n) =>
              n.type === "dropdownNode" ? [n, ...(n.data?.nestedNodes || [])] : [n]
            ).find((n) => n.id === nodeId)?.data;
            return { id: nodeId, title: nodeData?.title || nodeId, description: nodeData?.description || "No description available" };
          });

          let pathTypeLabel;
          switch (pathFilterMode) {
            case "incoming":
              pathTypeLabel = "Incoming paths";
              break;
            case "outgoing":
              pathTypeLabel = "Outgoing paths";
              break;
            default:
              pathTypeLabel = "Complete paths";
          }

          setSelectedDetails({
            label: `${pathTypeLabel} for selected nodes`,
            pathEdges: resultEdges,
            nodeInfo: nodeDetails.map((node) => ({
              id: node.id,
              title: node.title,
              description: node.description,
              pathMode: pathFilterMode,
            })),
          });

          wrappedSetIsSidebarOpen(true);
          return updatedNodes;
        } else {
          const updatedNodes = [...prev, label];
          const { resultEdges, connectedNodes } = traceNodePaths(updatedNodes);
          wrappedSetEdges(resultEdges);
          setHighlightedNodes(connectedNodes);
          setSelectedPathEdgeIds(resultEdges.map((edge) => edge.id));

          const nodeDetails = updatedNodes.map((nodeId) => {
            const nodeData = nodes.flatMap((n) =>
              n.type === "dropdownNode" ? [n, ...(n.data?.nestedNodes || [])] : [n]
            ).find((n) => n.id === nodeId)?.data;
            return { id: nodeId, title: nodeData?.title || nodeId, description: nodeData?.description || "No description available" };
          });

          let pathTypeLabel;
          switch (pathFilterMode) {
            case "incoming":
              pathTypeLabel = "Incoming paths";
              break;
            case "outgoing":
              pathTypeLabel = "Outgoing paths";
              break;
            default:
              pathTypeLabel = "Complete paths";
          }

          setSelectedDetails({
            label: `${pathTypeLabel} for selected nodes`,
            pathEdges: resultEdges,
            nodeInfo: nodeDetails.map((node) => ({
              id: node.id,
              title: node.title,
              description: node.description,
              pathMode: pathFilterMode,
            })),
          });

          wrappedSetIsSidebarOpen(true);
          return updatedNodes;
        }
      });
    },
    [wrappedSetEdges, setHighlightedNodes, setSelectedDetails, wrappedSetIsSidebarOpen, traceNodePaths, pathFilterMode, nodes, setSelectedPathEdgeIds]
  );
//parent toggle node 
  const handleTraceCheckboxToggle = (nodeId) => {
    setSelectedNodes((prev) => {
      if (prev.includes(nodeId)) {
        const updatedNodes = prev.filter((id) => id !== nodeId);
        if (updatedNodes.length === 0) {
          let allEdges = Object.values(pathEdgesMap).flat();
          wrappedSetEdges(allEdges);
          setHighlightedNodes([]);
          setSelectedDetails(null);
          setSelectedPathEdgeIds([]);
          return updatedNodes;
        }
        const { resultEdges, connectedNodes } = traceNodePaths(updatedNodes);
        wrappedSetEdges(resultEdges);
        setHighlightedNodes(connectedNodes);
        setSelectedPathEdgeIds(resultEdges.map((edge) => edge.id));
        return updatedNodes;
      } else {
        const updatedNodes = [...prev, nodeId];
        const { resultEdges, connectedNodes } = traceNodePaths(updatedNodes);
        wrappedSetEdges(resultEdges);
        setHighlightedNodes(connectedNodes);
        setSelectedPathEdgeIds(resultEdges.map((edge) => edge.id));
        return updatedNodes;
      }
    });
  };
//parent toggle expand node
  const toggleExpanded = useCallback(
    (id) => {
      const toggleNodeExpanded = (nodesList) => {
        return nodesList.map((node) => {
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

      setNodes((prevNodes) => toggleNodeExpanded(prevNodes));
    },
    [setNodes, theme]
  );

  const expandAll = useCallback(() => {
    const expandAllNodes = (nodesList) => {
      return nodesList.map((node) => {
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
            updatedNode.data.nestedNodes = expandAllNodes(updatedNode.data.nestedNodes); // ✅ already recursive
          }
  
          return updatedNode;
        }
        return { ...node, data: { ...node.data, theme } };
      });
    };
  
    setNodes((prevNodes) => expandAllNodes(prevNodes));
  }, [setNodes, theme]);
  

  const collapseAll = useCallback(() => {
    const collapseAllNodes = (nodesList) => {
      return nodesList.map((node) => {
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
            updatedNode.data.nestedNodes = collapseAllNodes(updatedNode.data.nestedNodes);
          }

          return updatedNode;
        }
        return { ...node, data: { ...node.data, theme } };
      });
    };

    setNodes((prevNodes) => collapseAllNodes(prevNodes));
  }, [setNodes, theme]);

  const showDetailsPanel = (label, pathEdges) => {
    setSelectedDetails({ label, pathEdges });
    const nodeIds = new Set(pathEdges.flatMap((edge) => [edge.source, edge.target]));
    setHighlightedNodes([...nodeIds]);
    setSelectedPathEdgeIds(pathEdges.map((edge) => edge.id));
    wrappedSetIsSidebarOpen(true);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const updateNodesWithCallbacks = useMemo(
    () => {
      return (nodesList) => {
        return nodesList.map((node) => {
          if (node.type === "dropdownNode") {
            const updatedNode = {
              ...node,
              data: {
                ...node.data,
                onSelect: handleDropdownSelect,
                toggleExpanded,
                setEdges: wrappedSetEdges,
                onShowDetails: showDetailsPanel,
                onShowTrace: (label) => showTraceFrom(label, setNodes, wrappedSetEdges, showDetailsPanel),
                traceNodePaths,
                theme,
                isHighlighted: highlightedNodes,  //each seelct nodes individually
                pathEdgesMap,
                isSelected: selectedNodes,
                onTraceCheckboxToggle: handleTraceCheckboxToggle,
                setIsSidebarOpen: wrappedSetIsSidebarOpen,
              },
            };
            console.log("Callbacks for node", node.id, ":", {
              onSelect: updatedNode.data.onSelect,
              traceNodePaths: updatedNode.data.traceNodePaths,
            });

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
              isHighlighted: !!highlightedNodes[node.id],

              isSelected: selectedNodes.includes(node.id),
              onTraceCheckboxToggle: handleTraceCheckboxToggle,
            },
          };
        });
      };
    },
    [handleDropdownSelect, toggleExpanded, wrappedSetEdges, setNodes, theme, highlightedNodes, selectedNodes, traceNodePaths, wrappedSetIsSidebarOpen]
  );

  const updatedNodes = useMemo(() => updateNodesWithCallbacks(nodes), [nodes, updateNodesWithCallbacks]);

  useEffect(() => {
    if (searchTerm) {
      const results = searchNodes(nodes, searchTerm);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, nodes]);

  useEffect(() => {
    if (selectedNodes.length > 0) {
      const { resultEdges, connectedNodes } = traceNodePaths(selectedNodes);
      wrappedSetEdges(resultEdges);
      setHighlightedNodes(connectedNodes);
      setSelectedPathEdgeIds(resultEdges.map((edge) => edge.id));

      const nodeDetails = selectedNodes.map((nodeId) => {
        const nodeData = nodes.find((n) => n.id === nodeId)?.data;
        return { id: nodeId, title: nodeData?.title || nodeId, description: nodeData?.description || "No description available" };
      });

      let pathTypeLabel;
      switch (pathFilterMode) {
        case "incoming":
          pathTypeLabel = "Incoming paths";
          break;
        case "outgoing":
          pathTypeLabel = "Outgoing paths";
          break;
        default:
          pathTypeLabel = "Complete paths";
      }

      setSelectedDetails({
        label: `${pathTypeLabel} for selected nodes`,
        pathEdges: resultEdges,
        nodeInfo: nodeDetails.map((node) => ({
          id: node.id,
          title: node.title,
          description: node.description,
          pathMode: pathFilterMode,
        })),
      });
    }
  }, [pathFilterMode, selectedNodes, nodes, traceNodePaths, wrappedSetEdges, setHighlightedNodes, setSelectedDetails, setSelectedPathEdgeIds]);

  const handleNodeSelection = (node) => {
    setSelectedNodes((prev) => {
      if (prev.includes(node.id)) {
        const updatedNodes = prev.filter((id) => id !== node.id);
        if (updatedNodes.length === 0) {
          let allEdges = Object.values(pathEdgesMap).flat();
          wrappedSetEdges(allEdges);
          setHighlightedNodes([]);
          setSelectedDetails(null);
          setSelectedPathEdgeIds([]);
          wrappedSetIsSidebarOpen(false);
          return updatedNodes;
        }
        const { resultEdges, connectedNodes } = traceNodePaths(updatedNodes);
        wrappedSetEdges(resultEdges);
        setHighlightedNodes(connectedNodes);
        setSelectedPathEdgeIds(resultEdges.map((edge) => edge.id));
//single node selection functionlity incoming ,outgiong,both
        const nodeDetails = updatedNodes.map((nodeId) => {
          const nodeData = nodes.find((n) => n.id === nodeId)?.data;
          return { id: nodeId, title: nodeData?.title || nodeId, description: nodeData?.description || "No description available" };
        });

        let pathTypeLabel;
        switch (pathFilterMode) {
          case "incoming":
            pathTypeLabel = "Incoming paths";
            break;
          case "outgoing":
            pathTypeLabel = "Outgoing paths";
            break;
          default:
            pathTypeLabel = "Complete paths";
        }

        setSelectedDetails({
          label: `${pathTypeLabel} for selected nodes`,
          pathEdges: resultEdges,
          nodeInfo: nodeDetails.map((node) => ({
            id: node.id,
            title: node.title,
            description: node.description,
            pathMode: pathFilterMode,
          })),
        });

        return updatedNodes;
      } else {
        const updatedNodes = [...prev, node.id];
        const { resultEdges, connectedNodes } = traceNodePaths(updatedNodes);
        wrappedSetEdges(resultEdges);
        setHighlightedNodes(connectedNodes);
        setSelectedPathEdgeIds(resultEdges.map((edge) => edge.id));

        const nodeDetails = updatedNodes.map((nodeId) => {
          const nodeData = nodes.find((n) => n.id === nodeId)?.data;
          return { id: nodeId, title: nodeData?.title || nodeId, description: nodeData?.description || "No description available" };
        });

        let pathTypeLabel;
        switch (pathFilterMode) {
          case "incoming":
            pathTypeLabel = "Incoming paths";
            break;
          case "outgoing":
            pathTypeLabel = "Outgoing paths";
            break;
          default:
            pathTypeLabel = "Complete paths";
        }

        setSelectedDetails({
          label: `${pathTypeLabel} for selected nodes`,
          pathEdges: resultEdges,
          nodeInfo: nodeDetails.map((node) => ({
            id: node.id,
            title: node.title,
            description: node.description,
            pathMode: pathFilterMode,
          })),
        });

        wrappedSetIsSidebarOpen(true);
        return updatedNodes;
      }
    });
  };
//collapse on double click functionlity



  const handleNodeClick = (event, node) => {
    handleNodeSelection(node);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: theme === "dark" ? "linear-gradient(145deg, #0f172a, #1e293b)" : "#f3f4f6",
        color: theme === "dark" ? "#d1d5db" : "#1f2937",
        transition: "all 0.3s ease",
        position: "relative",
      }}
    >
      <div style={{ flex: 1, position: "relative" }}>
        <ControlPanel
          theme={theme}
          toggleTheme={toggleTheme}
          expandAll={expandAll}
          collapseAll={collapseAll}
          resetView={resetView}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setViewMode={setViewMode}
          viewMode={viewMode}
          printSelectedNode={printSelectedNode}
        />

        {viewMode === "flow" ? (
          <ReactFlow
            ref={reactFlowRef}
            nodes={updatedNodes.map((node) => ({
              ...node,
              style: {
                ...node.style,
                transition: "all 0.3s ease",
                boxShadow:
                  highlightedNodes[node.id] === 'incoming'
                    ? '0 0 0 2px orange'
                    : highlightedNodes[node.id] === 'outgoing'
                      ? '0 0 0 2px blue'
                      : highlightedNodes[node.id] === 'both'
                        ? '0 0 0 2px purple'
                        : 'none',
                border: selectedNodes.includes(node.id) || highlightedNodes[node.id] !== undefined
                  ? (theme === "dark" ? "2px solid #60a5fa" : "2px solid #3b82f6")
                  : node.style?.border || "none",
              },
            }))}
            edges={edges.map((edge) => {
              const isHighlighted = selectedPathEdgeIds.includes(edge.id);
              return {
                ...edge,
                style: {
                  ...edge.style,
                  stroke: isHighlighted ? (theme === "dark" ? "#60a5fa" : "#3b82f6") : (theme === "dark" ? "#6b7280" : "#9ca3af"),
                  strokeWidth: isHighlighted ? 4 : 2,
                  strokeDasharray: "5,5",
                  opacity: selectedPathEdgeIds.length === 0 ? 1 : isHighlighted ? 1 : 0.2,
                  transition: "all 0.3s ease",
                },
              };
            })}
            onEdgeMouseEnter={(event, edge) => {
              const fullPath = findFullPathEdges(edge);
              setSelectedPathEdgeIds(fullPath);
              const nodeIds = new Set(
                fullPath.flatMap((id) => {
                  const edgeObj = edges.find((e) => e.id === id);
                  return edgeObj ? [edgeObj.source, edgeObj.target] : [];
                })
              );
              setHighlightedNodes([...nodeIds]);
            }}
            onEdgeMouseLeave={() => {
              if (selectedNodes.length === 0) {
                setSelectedPathEdgeIds([]);
                setHighlightedNodes([]);
              }
            }}
            onNodeClick={handleNodeClick}
            onEdgeClick={(event, edge) => {
              const label = edge.sourceHandle;
              const fullPathEdgeObjects = pathEdgesMap[label] || [];
              const fullPathIds = fullPathEdgeObjects.map((e) => e.id);
              setSelectedPathEdgeIds(fullPathIds);
              setSelectedDetails({
                label,
                pathEdges: fullPathEdgeObjects,
              });
              const nodeIds = new Set(fullPathEdgeObjects.flatMap((e) => [e.source, edge.target]));
              setHighlightedNodes([...nodeIds]);
              wrappedSetIsSidebarOpen(true);
            }}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            //drag and connect the nodes manually
            onConnect={(params) =>
              wrappedSetEdges((eds) =>
                addEdge(
                  {
                    ...params,
                    id: `${params.source}-${params.sourceHandle}-${params.target}`,
                    style: {
                      stroke: theme === "dark" ? "#6b7280" : "#9ca3af",
                      strokeWidth: 2,
                      strokeDasharray: "5,5",
                    },
                  },
                  eds
                )
              )
            }
            nodeTypes={nodeTypes}
            fitView
          >
            <MiniMap
              nodeColor={() => (theme === "dark" ? "#4b5563" : "#d1d5db")}
              maskColor={theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.2)"}
              style={{ bottom: 90 }}
            />
            <Controls style={{ bottom: 90 }} />
            <Background color={theme === "dark" ? "#374151" : "#e5e7eb"} gap={16} />
          </ReactFlow>
        ) : (
          <TraceGridView
            selectedNodes={selectedNodes}
            setSelectedNodes={setSelectedNodes}
            pathFilterMode={pathFilterMode}
            setPathFilterMode={setPathFilterMode}
            traceNodePaths={traceNodePaths}
            setSelectedDetails={setSelectedDetails}
            setSelectedPathEdgeIds={setSelectedPathEdgeIds}
            setHighlightedNodes={setHighlightedNodes}
            wrappedSetIsSidebarOpen={wrappedSetIsSidebarOpen}
            theme={theme}
            highlightedNodes={highlightedNodes}
          />

        )}

       { /* filter buttons for in and out */ }
        {selectedNodes.length > 0 && viewMode === "flow" && (
          <div style={{
            position: "absolute",
            bottom: 110,
            left: 45,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            background: theme === "dark" ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
            padding: "12px",
            borderRadius: "8px",
            boxShadow: theme === "dark" ? "0 3px 10px rgba(0, 0, 0, 0.5)" : "0 3px 10px rgba(0, 0, 0, 0.07)",
          }}>
            <div style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: theme === "dark" ? "#d1d5db" : "#1f2937",
              textAlign: "center"
            }}>
              Path Filter for Selected Nodes
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setPathFilterMode("both")} style={{
                padding: "6px 10px",
                background: pathFilterMode === "both" ? (theme === "dark" ? "#3b82f6" : "#2563eb") : (theme === "dark" ? "#374151" : "#e5e7eb"),
                color: pathFilterMode === "both" ? "#ffffff" : (theme === "dark" ? "#d1d5db" : "#1f2937"),
                border: "none", borderRadius: 6, cursor: "pointer", fontSize: "13px", fontWeight: pathFilterMode === "both" ? "bold" : "normal",
              }}>Both</button>
              <button onClick={() => setPathFilterMode("incoming")} style={{
                padding: "6px 10px",
                background: pathFilterMode === "incoming" ? (theme === "dark" ? "#f59e0b" : "#d97706") : (theme === "dark" ? "#374151" : "#e5e7eb"),
                color: pathFilterMode === "incoming" ? "#ffffff" : (theme === "dark" ? "#d1d5db" : "#1f2937"),
                border: "none", borderRadius: 6, cursor: "pointer", fontSize: "13px", fontWeight: pathFilterMode === "incoming" ? "bold" : "normal",
              }}>In</button>
              <button onClick={() => setPathFilterMode("outgoing")} style={{
                padding: "6px 10px",
                background: pathFilterMode === "outgoing" ? (theme === "dark" ? "#60a5fa" : "#3b82f6") : (theme === "dark" ? "#374151" : "#e5e7eb"),
                color: pathFilterMode === "outgoing" ? "#ffffff" : (theme === "dark" ? "#d1d5db" : "#1f2937"),
                border: "none", borderRadius: 6, cursor: "pointer", fontSize: "13px", fontWeight: pathFilterMode === "outgoing" ? "bold" : "normal",
              }}>Out</button>
              <button onClick={() => {
                setSelectedNodes([]);
                let allEdges = [];
                Object.values(pathEdgesMap).forEach((edges) => {
                  allEdges = [...allEdges, ...edges];
                });
                wrappedSetEdges(allEdges);
                setHighlightedNodes([]);
                setSelectedDetails(null);
                setSelectedPathEdgeIds([]);
                wrappedSetIsSidebarOpen(false);
              }} style={{
                padding: "6px 10px",
                background: theme === "dark" ? "#ef4444" : "#dc2626",
                color: "#ffffff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "13px",
              }}>Clear</button>
            </div>
          </div>
        )}

        <button
          onClick={() => wrappedSetIsSidebarOpen(!isSidebarOpen)}
          style={{
            position: "absolute",
            top: 30,
            right: 20,
            padding: "10px",
            background: theme === "dark" ? "#3b4a6b" : "#d1d5db",
            color: theme === "dark" ? "#d1d5db" : "#1f2937",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            boxShadow: theme === "dark" ? "0 2px 8px rgba(0, 0, 0, 0.5)" : "0 2px 8px rgba(0, 0, 0, 0.07)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = theme === "dark" ? "#4b5a7b" : "#e5e7eb";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = theme === "dark" ? "#3b4a6b" : "#d1d5db";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isSidebarOpen ? (
              <path d="M6 18L18 6M6 6l12 12"></path>
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18"></path>
            )}
          </svg>
        </button>
      </div>

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={wrappedSetIsSidebarOpen}
        selectedDetails={selectedDetails}
        theme={theme}
        selectedNodes={selectedNodes}
        toggleTheme={toggleTheme}
        expandAll={expandAll}
        collapseAll={collapseAll}
        resetView={resetView}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
    </div>
  );

};

export default FlowCanvas;