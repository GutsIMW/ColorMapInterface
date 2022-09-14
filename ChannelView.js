"use strict";

/**
 * Class displaying a channel (View in the MVC Design Pattern)
 */
class ChannelView {
    #canvas; // A HTML canvas displaying this channel
    #checkpointWidth; // Define the width of the checkpoint drawings
    
    /**
     * ChannelView constructor
     * @param  {HTMLCanvasElement} canvas - The canvas displaying this channel
     */
    constructor(canvas) {
        this.#canvas = canvas;
        this.#checkpointWidth = 20;
    }
    
    /**
     * @return {HTMLCanvasElement} - The canvas displaying this channel
     */
    getCanvas() {
        return this.#canvas;
    }

    /**
     * @return {Number} - The width of the checkpoint drawings (in pixel)
     */
    getCheckpointWidth() {
        return this.#checkpointWidth;
    }
    
    /**
     * @param  {Number} width - A number of pixel
     */
    setCheckpointWidth(width) {
        if(width < 0) { // Cannot define a negative width
            throw "Invalid parameter width: " + width + " . Please enter a positiv number";
        }
        this.#checkpointWidth = width;
    }
    
    /**
     * Format an array of Point objects normalized in [0,1] to an array of Point objects normalized in the range defined by the resolution of the canvas and to the direction of Y axis in canvas (up to down)
     * @param  {Array<Point>} points - array of Point objects normalized in [0,1]
     * @return {Array<Point>} - array of Point objects normalized in the range defined by the resolution of the canvas and to the direction of Y axis in canvas (up to down)
     */
    formatNormalizedPointsToCanvasDimension(points) {
        let formatedPoints = [];
        points.forEach(p => {
            let fp = new Point(p.getX() * this.#canvas.width, this.#canvas.height - (p.getY() * this.#canvas.height));
            formatedPoints.push(fp);
        });
        return formatedPoints;
    }
    
    /**
     * Draw the checkpoints only
     * @param  {Channel} channel - the channel containing the checkpoints to draw
     */
    drawCheckpoints(channel) {
        let ctx = this.#canvas.getContext("2d");
        ctx.font = '10px serif'; // Define a font size and style for writing the coordinates of the checkpoints
        ctx.lineWidth = 1; // Define a width for the checkpoints border

        let formatedCheckpoints = this.formatNormalizedPointsToCanvasDimension(channel.getCheckpoints()); // Format the checkpoints to the canvas resolution
        for(let i = 0; i < formatedCheckpoints.length; i++) {
            if(i == 0 || i == formatedCheckpoints.length - 1) { // The first and last checkpoint are drawn in a different color
                ctx.fillStyle = "#c90076"
            }
            else {
                ctx.fillStyle = "#e3bd13"; // Define the color of the checkpoint drawing
            }
            ctx.beginPath();
            ctx.rect(formatedCheckpoints[i].getX() - (this.#checkpointWidth/2), formatedCheckpoints[i].getY() - (this.#checkpointWidth/2) , this.#checkpointWidth, this.#checkpointWidth); // Draw a square with the coordinates of the checkpoint as its center
            ctx.fill();
            ctx.stroke();


            ctx.fillStyle = "#FFFFFF" // Define the color of the font
            ctx.fillText("[" + Math.round(channel.getCheckpoints()[i].getX()*100) + "%, " + Math.round(channel.getCheckpoints()[i].getY()*100) + "%]", formatedCheckpoints[i].getX(), formatedCheckpoints[i].getY()); // Write the coordinates of the checkpoint
        }
    }

    /**
     * Draw the discretized curve of the specified channel
     * @param  {Channel} channel - the channel to display
     */
    draw(channel) { 
        window.requestAnimationFrame(() => { // Executes this block only once for each frame (If the framerate is equal to 60 fps, then this block can be executed only 60 times at most)
                if(!channel instanceof Channel) {
                    throw "Invalid method parameter: " + channel + " is not an instance of Channel class";
                }
                
                let ctx = this.#canvas.getContext("2d");
                ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height); // Completely clears the canvas
                this.drawCheckpoints(channel); // Start by drawing only the checkpoints

                let tmpPoints = channel.getDiscretizedCurve();
                let fPoints = this.formatNormalizedPointsToCanvasDimension(tmpPoints) // Format the points to the canvas resolution

                ctx.beginPath();
                ctx.moveTo(fPoints[0].getX(), fPoints[0].getY());
                for(let i = 1; i < fPoints.length; i++) {
                    ctx.lineTo(fPoints[i].getX(), fPoints[i].getY()); // Draw a line between two points
                }
                ctx.lineWidth = 2; // Define a width for the curve
                ctx.strokeStyle = "#060308"; // Define a color for the curve drawing
                ctx.stroke();
        });
    }
}