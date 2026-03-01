function getDistance(n1, n2) {

    const dx = n2.x - n1.x;
    const dy = n2.y - n1.y;

    return Math.sqrt(dx * dx + dy * dy);
}

// export default function dijkstra(graph, startId, endId) {

//     const { nodes, edges } = graph;

//     // Build node lookup
//     const nodeMap = new Map();
//     nodes.forEach(n => nodeMap.set(n.id, n));

//     // Build adjacency list with weights
//     const adj = new Map();
//     nodes.forEach(n => adj.set(n.id, []));

//     function distance(a, b) {
//         const dx = a.x - b.x;
//         const dy = a.y - b.y;
//         return Math.sqrt(dx * dx + dy * dy);
//     }

//     for (const e of edges) {
//         const from = e.sourceId;
//         const to = e.targetId;

//         // Avoid duplicated edges
//         if (!adj.get(from).some(n => n.id === to)) {
//             const w = distance(nodeMap.get(from), nodeMap.get(to));
//             adj.get(from).push({ id: to, weight: w });
//         }
//     }

//     // Dijkstra
//     const dist = new Map();
//     const prev = new Map();
//     const visited = new Set();

//     nodes.forEach(n => dist.set(n.id, Infinity));
//     dist.set(startId, 0);

//     while (visited.size < nodes.length) {
//         let current = null;
//         let min = Infinity;

//         for (const [id, d] of dist) {
//             if (!visited.has(id) && d < min) {
//                 min = d;
//                 current = id;
//             }
//         }

//         if (current === null) break;
//         if (current === endId) break;

//         visited.add(current);

//         for (const neighbor of adj.get(current)) {
//             if (visited.has(neighbor.id)) continue;

//             const alt = dist.get(current) + neighbor.weight;
//             if (alt < dist.get(neighbor.id)) {
//                 dist.set(neighbor.id, alt);
//                 prev.set(neighbor.id, current);
//             }
//         }
//     }

//     // Reconstruct path
//     const path = [];
//     let u = endId;

//     while (u !== undefined) {
//         path.unshift(u);
//         u = prev.get(u);
//     }

//     return {
//         path,
//         distance: dist.get(endId)
//     };

// }

export default function dijkstra2(graphg, start, end) {

    let nodes = graphg.getNodeList();
    let edges = graphg.getEdgeList();

    // Build graph from nodes & edges
    const graph = {};

    nodes.forEach((n, i) => graph[i] = {});
    // nodes.forEach((n, i) => graph[n.id] = {});

    edges.forEach(edge => {

        const sourceNode = graphg.getNodeById(edge.sourceId);
        const targetNode = graphg.getNodeById(edge.targetId);

        const w = getDistance(sourceNode, targetNode);

        graph[edge.sourceId][edge.targetId] = w;
        graph[edge.targetId][edge.sourceId] = w; // if undirected
    });

    // console.log(graph)

    const distances = {};
    const prev = {};
    const visited = new Set();
    const nodesList = Object.keys(graph);

    nodesList.forEach(n => distances[n] = Infinity);

    distances[start] = 0;

    while (visited.size < nodesList.length) {

        let current = null;
        let minDist = Infinity;

        for (let n of nodesList) {
            if (!visited.has(n) && distances[n] < minDist) {
                minDist = distances[n];
                current = n;
            }
        }

        if (current === null) {
            break;
        }

        visited.add(current);

        for (let neighbor in graph[current]) {

            if (visited.has(neighbor)) {
                continue;
            }

            const newDist = distances[current] + graph[current][neighbor];

            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                prev[neighbor] = current;
            }
        }
    }

    // Reconstruct path
    let path = [];
    let nodePath = []

    let u = end;

    while (u !== undefined) {

        const index = parseInt(u);
        const node = nodes[index];

        path.unshift(index);
        nodePath.unshift(node);
        u = prev[u];
    }

    nodePath = nodePath.filter(e => e)
    // console.log(nodePath);

    // console.log("nodesList", nodesList);
    // console.log("path", path);
    // console.log("nodePath", nodePath);

    return { path, nodePath, distance: distances[end] };
}