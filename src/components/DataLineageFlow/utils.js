import LineageData from "../../lineageData.json";

const { pathEdgesMap, newEdges, tracePaths } = LineageData;

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

// ✅ Moved outside
export const filterTracePath = (label, nodesList) => {
  const allPaths = tracePaths[label];

  if (!Array.isArray(allPaths)) {
    console.warn(`No tracePaths found for label: ${label}`);
    return nodesList;
  }

  const traceIds = new Set();

  if (Array.isArray(allPaths[0])) {
    allPaths.forEach((path) => {
      if (Array.isArray(path)) {
        path.forEach((id) => traceIds.add(id));
      }
    });
  } else {
    allPaths.forEach((id) => traceIds.add(id));
  }

  const expandOnlyTrace = (node) => {
    const shouldExpand = traceIds.has(node.id);
    const updatedItems = node.data?.items?.filter((item) => traceIds.has(item.label)) || [];
    let updatedNestedNodes = [];
    if (node.data?.nestedNodes?.length > 0) {
      updatedNestedNodes = node.data.nestedNodes.map(expandOnlyTrace).filter((n) => n !== null);
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

  return nodesList.map(expandOnlyTrace).filter((n) => n !== null);
};

export const showTraceFrom = (label, setNodes, setEdges, showDetailsPanel) => {
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

  setNodes((prev) => filterTracePath(label, collapseAllNodes(prev)));
  setEdges(newEdges);
  showDetailsPanel(label, newEdges);
};

export const findFullPathEdges = (edge) => {
  const source = edge.sourceHandle;
  const path = pathEdgesMap[source];
  if (!path) return [];
  return path.map((e) => e.id);
};

export const searchNodes = (nodes, searchValue) => {
  const results = [];

  const searchInNodes = (nodesList, path = []) => {
    nodesList.forEach((node) => {
      if (node.type === "dropdownNode") {
        const titleMatch = node.data?.title?.toLowerCase().includes(searchValue);
        const itemMatch = node.data?.items?.some((item) => item.label.toLowerCase().includes(searchValue));

        const childMatches = [];

        const checkNestedNodes = (nestedNodes, parentPath) => {
          nestedNodes.forEach((nested) => {
            const nestedTitleMatch = nested.data?.title?.toLowerCase().includes(searchValue);
            const nestedItemMatch = nested.data?.items?.some((item) => item.label.toLowerCase().includes(searchValue));
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
};
