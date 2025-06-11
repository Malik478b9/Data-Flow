import React, { useState, useEffect, useMemo, useCallback } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomDropdownNode from "./components/CustomDropdownNode";
import HeaderNode from "./components/HeaderNode";
import Sidebar from "./components/Sidebar";
import ControlPanel from "./components/ControlPanel";
import rawData from "./data/data_lineage_json.json";
import { generateGraphFromData, traceNodePaths, searchNodes } from "./utils/utils";

const nodeTypes = {
  dropdownNode: CustomDropdownNode,
  header: HeaderNode,
};

function App() {
  const { initialNodes: rawInitialNodes, pathEdgesMap, newEdges, tracePaths } = generateGraphFromData(rawData);

  // Collapse all dropdown nodes by default
  const initialNodes = rawInitialNodes.map((node) => {
    if (node.type === "dropdownNode") {
      return {
        ...node,
        data: {
          ...node.data,
          expanded: false, // force collapse by default
        },
      };
    }
    return node;
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(newEdges);
  const [theme, setTheme] = useState("light");
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [selectedPathEdgeIds, setSelectedPathEdgeIds] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pathFilterMode, setPathFilterMode] = useState("both");

  const expandAll = () => {
    setNodes((nds) =>
      nds.map((n) =>
        n.type === "dropdownNode"
          ? { ...n, data: { ...n.data, expanded: true, theme } }
          : { ...n, data: { ...n.data, theme } }
      )
    );
  };

  const collapseAll = () => {
    setNodes((nds) =>
      nds.map((n) =>
        n.type === "dropdownNode"
          ? { ...n, data: { ...n.data, expanded: false, theme } }
          : { ...n, data: { ...n.data, theme } }
      )
    );
  };

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const handleNodeClick = (event, node) => {
    // Find all edges originating from this node (outgoing) or going to it (incoming)
    const matchingEdges = pathEdgesMap[node.id] || [];

    // Highlight each individual edge with blue as per the image
    const resultEdges = matchingEdges.map((edge) => ({
      ...edge,
      markerEnd: { type: "arrowclosed", color: "#3B82F6" }, // Blue highlight
      style: {
        ...edge.style,
        stroke: "#3B82F6", // Blue color
        strokeWidth: 3,
        strokeDasharray: "5,5", // Dashed line
      },
    }));

    // Highlight both source and destination nodes
    const connectedNodes = {};
    matchingEdges.forEach((edge) => {
      connectedNodes[edge.source] = "source";
      connectedNodes[edge.target] = "target";
    });

    setSelectedNodes([node.id]);
    setEdges(resultEdges);
    setHighlightedNodes(connectedNodes);
    setSelectedPathEdgeIds(resultEdges.map((e) => e.id));
    setSelectedDetails({ label: node.id, pathEdges: resultEdges });
    setIsSidebarOpen(true);
  };

  const updateNodesWithProps = useCallback(
    (nodesList) => {
      return nodesList.map((node) => {
        return {
          ...node,
          data: {
            ...node.data,
            theme,
            expanded: node.data.expanded,
            onSelect: () => handleNodeClick(null, node),
            toggleExpanded: () =>
              setNodes((prev) =>
                prev.map((n) =>
                  n.id === node.id ? { ...n, data: { ...n.data, expanded: !n.data.expanded } } : n
                )
              ),
          },
        };
      });
    },
    [theme, setNodes]
  );

  const updatedNodes = useMemo(() => updateNodesWithProps(nodes), [nodes, updateNodesWithProps]);

  return (
    <div style={{ height: "100vh", width: "100vw", background: theme === "dark" ? "#0F172A" : "#F3F4F6" }}>
      <ControlPanel
        theme={theme}
        toggleTheme={toggleTheme}
        expandAll={expandAll}
        collapseAll={collapseAll}
        resetView={() => setEdges(newEdges)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <ReactFlow
        nodes={updatedNodes}
        edges={edges.map((edge) => ({
          ...edge,
          style: {
            ...edge.style,
            stroke: selectedPathEdgeIds.includes(edge.id)
              ? theme === "dark"
                ? "#60A5FA"
                : "#3B82F6" // Blue highlight as per image
              : edge.style?.stroke || "#9CA3AF",
            strokeWidth: selectedPathEdgeIds.includes(edge.id) ? 3 : 2,
            strokeDasharray: selectedPathEdgeIds.includes(edge.id) ? "5,5" : undefined, // Dashed when highlighted
            opacity: selectedPathEdgeIds.length ? (selectedPathEdgeIds.includes(edge.id) ? 1 : 0.2) : 1,
          },
        }))}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background variant="dots" gap={16} size={1} color={theme === "dark" ? "#4B5563" : "#D1D5DB"} />
      </ReactFlow>

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        selectedDetails={selectedDetails}
        theme={theme}
      />
    </div>
  );
}

export default App;