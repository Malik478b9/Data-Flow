export function generateGraphFromData(data) {
  const systems = new Set();
  const nodes = [];
  const edges = [];
  const paddingX = 260;
  const paddingY = 160;
  let x = 0, y = 0;

  const pathEdgesMap = {};
  const tracePaths = {};

  data.dataFlows?.forEach((flow, index) => {
    systems.add(flow.source);
    systems.add(flow.destination);

    const edge = {
      id: `e${index}`,
      source: flow.source,
      target: flow.destination,
      label: flow.dataType,
      animated: true,
      style: {
        strokeWidth: 2,
        stroke: "#3B82F6", // Blue edges as per image
        transition: "all 0.3s ease-in-out",
      },
    };
    edges.push(edge);

    if (!pathEdgesMap[flow.source]) pathEdgesMap[flow.source] = [];
    pathEdgesMap[flow.source].push(edge);

    if (!tracePaths[flow.source]) tracePaths[flow.source] = [];
    tracePaths[flow.source].push(flow.destination);
  });

  systems.forEach((sys) => {
    const flows = data.dataFlows.filter(f => f.source === sys || f.destination === sys);
    nodes.push({
      id: sys,
      type: "dropdownNode",
      position: { x, y },
      data: {
        title: sys,
        items: flows.map(f => ({ label: `${f.dataType}: ${f.description}` })),
        expanded: true,
      },
      style: {
        transition: "all 0.5s ease",
        borderRadius: "12px",
        padding: "10px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)", // Subtle shadow
        backgroundColor: "#FFFFFF", // White background
      },
    });
    x += paddingX;
    if (x > 1200) {
      x = 0;
      y += paddingY;
    }
  });

  return { initialNodes: nodes, pathEdgesMap, newEdges: edges, tracePaths };
}

export function traceNodePaths(nodeIds, pathEdgesMap, mode = "both", theme = "light") {
  const allEdges = Object.values(pathEdgesMap).flat();
  const visitedEdges = new Set();
  const resultEdges = [];
  const nodeHighlightMap = {};

  const addNode = (id, direction) => {
    if (!nodeHighlightMap[id]) {
      nodeHighlightMap[id] = direction;
    } else if (nodeHighlightMap[id] !== direction) {
      nodeHighlightMap[id] = "both";
    }
  };

  const traceForward = (currentId) => {
    for (const edge of allEdges) {
      if (edge.source === currentId && !visitedEdges.has(edge.id)) {
        visitedEdges.add(edge.id);
        resultEdges.push({
          ...edge,
          markerEnd: { type: "arrowclosed", color: theme === "dark" ? "#60A5FA" : "#3B82F6" },
          style: {
            ...edge.style,
            stroke: theme === "dark" ? "#60A5FA" : "#3B82F6", // Blue highlight
            strokeWidth: 3,
            strokeDasharray: "5,5", // Dashed line as per image
          },
        });
        addNode(edge.target, "outgoing");
        traceForward(edge.target);
      }
    }
  };

  const traceBackward = (currentId) => {
    for (const edge of allEdges) {
      if (edge.target === currentId && !visitedEdges.has(edge.id)) {
        visitedEdges.add(edge.id);
        resultEdges.push({
          ...edge,
          markerEnd: { type: "arrowclosed", color: theme === "dark" ? "#F59E0B" : "#D97706" },
          style: {
            ...edge.style,
            stroke: theme === "dark" ? "#F59E0B" : "#D97706", // Amber highlight
            strokeWidth: 3,
            strokeDasharray: "5,5", // Dashed line
          },
        });
        addNode(edge.source, "incoming");
        traceBackward(edge.source);
      }
    }
  };

  nodeIds.forEach((id) => {
    addNode(id, mode);
    if (mode === "both" || mode === "outgoing") traceForward(id);
    if (mode === "both" || mode === "incoming") traceBackward(id);
  });

  return { resultEdges, connectedNodes: nodeHighlightMap };
}

export function searchNodes(nodes, term) {
  return nodes.filter((node) =>
    node.data?.title?.toLowerCase().includes(term.toLowerCase())
  );
}