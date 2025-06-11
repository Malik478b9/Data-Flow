export const headerToStackMap = {
    "header-A": "E0",
    "header-B": "E11",
    "header-C": "E21",
    "header-D": "E31",
    "header-E": "E41",
    "header-F": "E51",
    "header-G": "E61",
    "header-H": "E76",
  };
  
  export const showTraceFrom = (label, setNodes, setEdges, showDetailsPanel, lineageData) => {
    const { newEdges = [], tracePaths = {} } = lineageData;
    const tracePath = tracePaths[label] || [];
    setEdges(
      newEdges.map((e) => ({
        ...e,
        style: {
          ...e.style,
          stroke: tracePath.includes(e.source) && tracePath.includes(e.target) ? "#3b82f6" : "#ccc",
        },
      }))
    );
    showDetailsPanel?.(label, tracePath);
  };
  
  export const findFullPathEdges = (edge, pathEdgesMap) => {
    const source = edge.sourceHandle;
    const path = pathEdgesMap?.[source];
    return path?.map((e) => e.id) || [];
  };
  
  export const searchNodes = (nodes, term) => {
    return nodes.filter((n) =>
      n.data?.title?.toLowerCase().includes(term) ||
      n.data?.items?.some((item) => item.label.toLowerCase().includes(term))
    );
  };
  