import React, { useState } from "react";
import LineageData from "../../lineageData.json";

const TraceGridView = ({
  selectedNodes,
  setSelectedNodes,
  pathFilterMode,
  setPathFilterMode,
  traceNodePaths,
  setSelectedDetails,
  setSelectedPathEdgeIds,
  setHighlightedNodes,
  wrappedSetIsSidebarOpen,
  highlightedNodes,
  theme,
  handleNodeFocus
}) => {
  const headers = [
    { label: "Header A", id: "E0" },
    { label: "Header B", id: "E11" },
    { label: "Header C", id: "E21" },
    { label: "Header D", id: "E31" },
    { label: "Header E", id: "E41" },
    { label: "Header F", id: "E51" },
    { label: "Header G", id: "E61" },
    { label: "Header H", id: "E76" },
  ];

  const [traceCollapsedData, setTraceCollapsedData] = useState(null);

  const columnData = {};
  headers.forEach(({ id }) => {
    columnData[id] = [];
  });

  Object.entries(LineageData.tracePaths).forEach(([nodeId, trace]) => {
    const paths = Array.isArray(trace[0]) ? trace : [trace];
    paths.forEach((path) => {
      for (let i = 0; i < path.length - 1; i++) {
        const curr = path[i];
        const next = path[i + 1];
        if (columnData[curr] && !columnData[curr].includes(next)) {
          columnData[curr].push(next);
        }
      }
    });
  });

  const handleSelect = (nodeId) => {
    const updated = [nodeId];
    const { resultEdges, connectedNodes } = traceNodePaths(updated);

    setSelectedNodes(updated);
    setHighlightedNodes(connectedNodes);
    setSelectedPathEdgeIds(resultEdges.map((edge) => edge.id));

    const trace = LineageData.tracePaths[nodeId] || [];
    const traceText = Array.isArray(trace[0])
      ? trace.map((path) => path.join(" → ")).join(" / ")
      : trace.join(" → ");

    setSelectedDetails({
      label: `${pathFilterMode} path for ${nodeId}`,
      pathEdges: resultEdges,
      nodeInfo: [
        {
          id: nodeId,
          title: nodeId,
          description: traceText,
          pathMode: pathFilterMode,
        },
      ],
    });

    wrappedSetIsSidebarOpen(true);
    if (handleNodeFocus) handleNodeFocus(nodeId);
    setTraceCollapsedData(null); // reset trace view
  };

  const handleTraceClick = () => {
    if (!selectedNodes.length) return;
    const nodeId = selectedNodes[0];
    const trace = LineageData.tracePaths[nodeId];
    if (!trace) return;
    const path = Array.isArray(trace[0]) ? trace[0] : trace;

    const collapsed = {};
    headers.forEach(({ id }) => (collapsed[id] = []));
    for (let i = 0; i < path.length - 1; i++) {
      const current = path[i];
      const next = path[i + 1];
      if (collapsed[current]) collapsed[current].push(next);
    }
    setTraceCollapsedData(collapsed);
  };

  const displayData = traceCollapsedData || columnData;
  const maxRows = Math.max(...Object.values(displayData).map((col) => col.length));

  return (
    <div style={{ padding: 80, overflowX: "auto" }}>
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "8px",
        marginBottom: "20px",
      }}>
        <button onClick={() => setPathFilterMode("both")} style={{
          padding: "6px 10px",
          background: pathFilterMode === "both" ? (theme === "dark" ? "#3b82f6" : "#2563eb") : (theme === "dark" ? "#374151" : "#e5e7eb"),
          color: pathFilterMode === "both" ? "#ffffff" : (theme === "dark" ? "#d1d5db" : "#1f2937"),
          border: "none", borderRadius: 6, cursor: "pointer", fontSize: "13px", fontWeight: pathFilterMode === "both" ? "bold" : "normal"
        }}>Both</button>
        <button onClick={() => setPathFilterMode("incoming" )} style={{
          padding: "6px 10px",
          background: pathFilterMode === "incoming" ? (theme === "dark" ? "#f59e0b" : "#d97706") : (theme === "dark" ? "#374151" : "#e5e7eb"),
          color: pathFilterMode === "incoming" ? "#ffffff" : (theme === "dark" ? "#d1d5db" : "#1f2937"),
          border: "none", borderRadius: 6, cursor: "pointer", fontSize: "13px", fontWeight: pathFilterMode === "incoming" ? "bold" : "normal"
        }}>In</button>
        <button onClick={() => setPathFilterMode("outgoing" )} style={{
          padding: "6px 10px",
          background: pathFilterMode === "outgoing" ? (theme === "dark" ? "#60a5fa" : "#3b82f6") : (theme === "dark" ? "#374151" : "#e5e7eb"),
          color: pathFilterMode === "outgoing" ? "#ffffff" : (theme === "dark" ? "#d1d5db" : "#1f2937"),
          border: "none", borderRadius: 6, cursor: "pointer", fontSize: "13px", fontWeight: pathFilterMode === "outgoing" ? "bold" : "normal"
        }}>Out</button>
        <button onClick={handleTraceClick} style={{
          padding: "6px 10px",
          background: theme === "dark" ? "#4ade80" : "#22c55e",
          color: "#ffffff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "13px"
        }}>Trace</button>
        <button onClick={() => {
          setSelectedNodes([]);
          setHighlightedNodes([]);
          setSelectedPathEdgeIds([]);
          setSelectedDetails(null);
          wrappedSetIsSidebarOpen(false);
          setTraceCollapsedData(null);
        }} style={{
          padding: "6px 10px",
          background: theme === "dark" ? "#ef4444" : "#dc2626",
          color: "#ffffff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "13px"
        }}>Clear</button>
      </div>
      <table style={{ borderCollapse: "collapse", width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h.id} style={{ border: "1px solid #ccc", padding: 8, background: "#f9fafb" }}>
                {h.label}<br />{h.id}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(maxRows)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map(h => {
                const nodeId = displayData[h.id][rowIndex];
                return (
                  <td
                    key={h.id + rowIndex}
                    style={{
                        border: "1px solid #ccc",
                        padding: 8,
                        cursor: nodeId ? "pointer" : "default",
                        fontWeight: selectedNodes.includes(nodeId) ? "bold" : "normal",
                        backgroundColor:
                          nodeId && highlightedNodes?.[nodeId] === "incoming"
                            ? "#fcd34d"
                            : nodeId && highlightedNodes?.[nodeId] === "outgoing"
                            ? "#bfdbfe"
                            : nodeId && highlightedNodes?.[nodeId] === "both"
                            ? "#e9d5ff"
                            : selectedNodes.includes(nodeId)
                            ? "#dbeafe"
                            : "#fff",
                        transition: "background-color 0.3s ease",
                      }}
                    onClick={() => nodeId && handleSelect(nodeId)}
                  >
                    {nodeId || ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TraceGridView;