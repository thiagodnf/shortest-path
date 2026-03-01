// import dijkstra from "./dijkstra.js";
import dijkstra from "./dijkstra.js";
import CanvasUtils from "./utils/CanvasUtils.js";
import Options from "./enums/Options.js";
import Graph from "./Graph.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const btnAddNodeEl = document.getElementById('btn-add-node');
const btnAddEdgeEl = document.getElementById('btn-add-edge');
const btnMoveEl = document.getElementById('btn-move');
const btnRemoveEl = document.getElementById('btn-remove');

let mouse = null;
let selectedEl = null;

let SELECTED_OPTION = Options.MOVE_NODE;

let SETTINGS = {
    RADIUS: 40,
    COLOR_EDGE_SELECTED: "#55606F",
    COLOR_EDGE_NON_SELECTED: "#DFE0E2",
    COLOR_EDGE_SELECTING: "blue",
}

const graph = new Graph()

graph.addNode("A", 50, 350);
graph.addNode("B", 250, 500);
graph.addNode("C", 50, 150);
graph.addNode("3", 250, 150);
graph.addNode("1", 450, 250);
graph.addNode("2", 350, 50);
graph.addNode("Z", 550, 150);

graph.addEdge(0, 1);
graph.addEdge(0, 2);
graph.addEdge(1, 2);
graph.addEdge(1, 3);
graph.addEdge(1, 4);
graph.addEdge(3, 4);
graph.addEdge(2, 3);
graph.addEdge(2, 4);
graph.addEdge(3, 5);
graph.addEdge(4, 6);
graph.addEdge(5, 6);
graph.addEdge(2, 5);

function getDistance(n1, n2) {
    const dx = n2.x - n1.x;
    const dy = n2.y - n1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    const availableHeight = window.innerHeight - rect.top - 20;

    canvas.style.height = availableHeight + "px";
    canvas.width = rect.width;
    canvas.height = availableHeight;
}

function drawRectangle(x1, y1, x2, y2, w, h, color = "blue", globalAlpha = 1.0) {

    ctx.beginPath();
    ctx.globalAlpha = globalAlpha;

    // Calculate center
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;

    // Calculate angle
    const angle = Math.atan2(y2 - y1, x2 - x1);

    ctx.save(); // save state
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.fillRect(-w / 2, -h / 2, w, h); // centered
    ctx.restore(); // restore state
}

function drawTextAngled(x1, y1, x2, y2, text, globalAlpha = 1.0) {

    ctx.beginPath();
    ctx.globalAlpha = globalAlpha;

    // Calculate center
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;

    // Calculate angle
    const angle = Math.atan2(y2 - y1, x2 - x1);

    ctx.save(); // save state
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.font = '15px Arial';
    ctx.fillStyle = 'white';

    ctx.fillText(text, 0, 0);
    ctx.restore(); // restore state
}

function drawNode({ id, x, y, label }) {

    let color = "#9BC8E3";

    if (label === "A") color = "#5DAE32";
    else if (label === "Z") color = "#B12A29";

    CanvasUtils.drawCircle(ctx, x, y, SETTINGS.RADIUS, {
        fillColor: color,
        lineWidth: 2,
        strokeColor: "#57616E",
        dash: [8, 5]
    });

    const options = { color: "white", fontSize: SETTINGS.RADIUS / 3, textAlign: "center" };

    CanvasUtils.drawText(ctx, x, y - 25, id, options);
    CanvasUtils.drawText(ctx, x - 25, y, id, options);
    CanvasUtils.drawText(ctx, x, y + 25, id, options);
    CanvasUtils.drawText(ctx, x + 25, y, id, options);
}

function drawEdge(s, t, color = "red", globalAlpha = 1.0) {

    let n1 = graph.getNodeById(s)
    let n2 = graph.getNodeById(t)

    let x1 = n1.x;
    let y1 = n1.y;
    let x2 = n2.x;
    let y2 = n2.y;

    const distance = getDistance(n1, n2);

    CanvasUtils.drawLine(ctx, n1, n2, { color });

    drawRectangle(x1, y1, x2, y2, 60, 20, color, globalAlpha);

    drawTextAngled(x1, y1, x2, y2, parseInt(distance))

    CanvasUtils.drawCircle(ctx, x1, y1, SETTINGS.RADIUS / 4, {
        fillColor: "#57616E"
    });

    CanvasUtils.drawCircle(ctx, x2, y2, SETTINGS.RADIUS / 4, {
        fillColor: "#57616E"
    });
}

function draw() {

    CanvasUtils.clear(ctx);

    update();

    if (SELECTED_OPTION === Options.ADD_EDGE) {
        if (selectedEl) {
            CanvasUtils.drawLine(ctx, selectedEl, mouse, { color: SETTINGS.COLOR_EDGE_SELECTING });
        }
    }

    requestAnimationFrame(draw);
}

function update() {

    const { nodePath, distance } = dijkstra(graph, 0, Graph.NODE_ID - 1);
    
    let selectedEdges = new Set()

    for (let i = 0; i < nodePath.length - 1; i++) {
        selectedEdges.add(`${nodePath[i].id}_${nodePath[i + 1].id}`)
    }

    for (let node of graph.nodes) {
        drawNode(node);
    }

    for (let { sourceId, targetId } of graph.edges) {

        let edge_1 = `${sourceId}_${targetId}`;
        let edge_2 = `${targetId}_${sourceId}`;

        if (selectedEdges.has(edge_1) || selectedEdges.has(edge_2)) {
            drawEdge(sourceId, targetId, SETTINGS.COLOR_EDGE_SELECTED, 1.0);
        } else {
            drawEdge(sourceId, targetId, SETTINGS.COLOR_EDGE_NON_SELECTED, 0.2);
        }
    }

    let text = `${nodePath.map(e => e.label).join(" ")} | ${parseInt(distance)}px`;

    CanvasUtils.drawText(ctx, 5, 15, text, { color: "red", fontSize: 15 })
}

function getMouseLocation(e) {

    const rect = canvas.getBoundingClientRect();

    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}

// check if mouse is inside circle
function isInside(mouse, node) {

    const dx = mouse.x - node.x;
    const dy = mouse.y - node.y;

    return dx * dx + dy * dy <= SETTINGS.RADIUS * SETTINGS.RADIUS;
}

function selectNode() {

    for (let node of graph.nodes) {
        if (isInside(mouse, node)) {
            return node;
        }
    }

    return null;
}

function onMouseDown(e) {

    if (SELECTED_OPTION === Options.ADD_NODE) {
        graph.addNode("T", mouse.x, mouse.y);
    } else {
        selectedEl = selectNode()
    }

    if (SELECTED_OPTION === Options.REMOVE_NODE && selectedEl) {
        graph.removeNode(selectedEl);
    }
}

function onMouseMove(e) {

    mouse = getMouseLocation(e);

    if (SELECTED_OPTION === Options.MOVE_NODE) {
        if (selectedEl) {
            selectedEl.x = mouse.x;
            selectedEl.y = mouse.y;
        }
    }
}

function onMouseUp(e) {

    if (SELECTED_OPTION === Options.ADD_EDGE) {

        if (selectedEl) {

            let targetNode = selectNode();

            if (targetNode) {

                if (selectedEl.id !== targetNode.id) {

                    graph.addEdge(selectedEl.id, targetNode.id);
                }
            }
        }
    }

    selectedEl = null;
}

/**
 * Disable the default browser context menu on canvas element.
 */
function onContextMenu(e) {
    e.preventDefault();
}

canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('contextmenu', onContextMenu);

window.addEventListener('resize', resizeCanvas);

btnAddNodeEl.addEventListener('click', (e) => { SELECTED_OPTION = Options.ADD_NODE; });
btnAddEdgeEl.addEventListener('click', (e) => { SELECTED_OPTION = Options.ADD_EDGE; });
btnMoveEl.addEventListener('click', (e) => { SELECTED_OPTION = Options.MOVE_NODE; });
btnRemoveEl.addEventListener('click', (e) => { SELECTED_OPTION = Options.REMOVE_NODE; });

resizeCanvas();
draw();