export default class CanvasUtils {

    static clear(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    static drawLine(ctx, p1, p2, options = {}) {

        const defaults = {
            color: "gray",
            lineWidth: 6
        };

        const config = { ...defaults, ...options };

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);   // start point (x, y)
        ctx.lineTo(p2.x, p2.y); // end point (x, y)
        ctx.strokeStyle = config.color;
        ctx.lineWidth = config.lineWidth;
        ctx.stroke();
    }

    static drawText(ctx, x, y, text, options = {}) {

        const defaults = {
            color: "black",
            fontSize: 20,
            textAlign: "left"
        };

        const config = { ...defaults, ...options };

        ctx.font = `${config.fontSize}px Arial`;
        ctx.textAlign = config.textAlign;
        ctx.textBaseline = "middle";

        ctx.fillStyle = config.color;
        ctx.fillText(text, x, y);
    }

    static drawCircle(ctx, x, y, radius = 50, options = {}) {

        const defaults = {
            fillColor: "black",
            lineWidth: 0,
            dash: [],
            strokeColor: null
        };

        const config = { ...defaults, ...options };

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);

        if (config.fillColor) {
            ctx.fillStyle = config.fillColor;
            ctx.fill();
        }

        if (config.strokeColor && config.lineWidth > 0) {

            ctx.strokeStyle = config.strokeColor;
            ctx.lineWidth = config.lineWidth;

            if (config.dash.length !== 0) {
                ctx.setLineDash(config.dash);
            }

            ctx.stroke();
        }

        ctx.restore();
    }
}