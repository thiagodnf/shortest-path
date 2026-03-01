export default class Graph {

    static NODE_ID = 0;

    constructor(nodes = [], edges = []) {
        this.nodes = nodes;
        this.edges = edges;
    }

    addNode(label, x, y) {

        let node = {
            id: Graph.NODE_ID++,
            label, x, y
        };

        this.nodes.push(node)

        return node;
    }

    addEdge(sourceId, targetId) {
        if (!this.exists(sourceId, targetId)) {
            this.edges.push({ sourceId, targetId });
            this.edges.push({ targetId, sourceId })
        }
    }

    getNodeById(id) {
        return this.nodes.find(node => node.id === id) || null;
    }

    exists(sourceId, targetId) {
        return this.getEdge(sourceId, targetId) !== null;
    }

    getEdge(sourceId, targetId) {
        return this.edges.find(e =>
            (e.sourceId === sourceId && e.targetId === targetId)
            ||
            (e.sourceId === targetId && e.targetId === sourceId)
        ) || null;
    }

    getEdgeByNodeId(sourceId, targetId) {
        return this.nodes.find(node => node.id === id) || null;
    }

    getDistance(n1, n2) {
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getNodeIndexOf(node) {
        return this.nodes.indexOf(node);
    }

    getNodeList() {
        return this.nodes;
    }

    getEdgeList() {
        return this.edges;
    }

    removeNode(node) {

        let edgesToRemove = [];

        for (let edge of this.edges) {

            if (edge.sourceId === node.id || edge.targetId === node.id) {
                edgesToRemove.push(edge);
            }
        }

        for (let edge of edgesToRemove) {

            const index = this.edges.indexOf(edge);

            if (index !== -1) {
                this.edges.splice(index, 1);
            }
        }

        console.log(this.edges)

        const index = this.getNodeIndexOf(node);

        if (index !== -1) {
            this.nodes.splice(index, 1);
        }
    }
}
