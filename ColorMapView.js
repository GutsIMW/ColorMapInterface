"use strict";

/**
 * Class displaying a color map (View in the MVC Design Pattern)
 */
class ColorMapView {
    #canvas; // A HTML canvas displaying the color map

    /**
     * ColorMapView constructor
     * @param  {HTMLCanvasElement} canvas - A HTML canvas that will display the color map
     */
    constructor(canvas) {
        this.#canvas = canvas;
    }

    /**
     * Format an RGBColor object to an array of three percentages representing the intensities of red, green and blue
     * @param  {RGBColor} rgbColor - An rgb color to format
     * @return {Array<Number>} - An array of 3 number in [0, 100]
     */
    formatToRGBPercentage(rgbColor) {
        let red = rgbColor.getRed();
        let green = rgbColor.getGreen();
        let blue = rgbColor.getBlue();
        if(red < 0 || red > 1 || green < 0 || green > 1 || blue < 0 || blue > 1) {
            throw "Invalid value for RGBColor object : " + color;
        }

        return [red * 100, green * 100, blue * 100];
    }

    /**
     * Draw the color map on this.#canvas
     * @param  {ColorMap} colorMap - A color map model
     * @param  {Boolean} forExport=false - Indicates if this drawing is made in order to export the drawn map right after
     */
    draw(colorMap, forExport = false) {
        // We store the script in a function to be able to be able to chose how to execute it later
        let drawing = () => {
            if(!colorMap instanceof ColorMap) { // Throws an exception if the colorMap parameter is not an instance of ColorMap class
                throw "Invalid method parameter: " + colorMap + " is not an instance of ColorMap class";
            }

            let ctx = this.#canvas.getContext("2d");
            ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height); // Completely clears the canvas

            for(let l = 0; l < this.#canvas.width; l++) { // Loop through each column of pixel of the canvas one by one
                let k = Math.floor((l * colorMap.getSize()) / this.#canvas.width); // Determine the index of the color in the color map to draw
                let p = colorMap.getColorK(k); // Get the color in the color map model at the index k
                
                let rgbPercentage = this.formatToRGBPercentage(p); // Format the RGBColor object to an array of 3 percentages
                
                let styleRGB = "rgb(" + rgbPercentage[0] + "% ," + rgbPercentage[1] + "% ," + rgbPercentage[2] + "%)"; // Define the color of the pixel to draw
                ctx.fillStyle = styleRGB;
                ctx.fillRect(l, 0, 1, this.#canvas.offsetHeight); // Draw the column of pixel in the color styleRGB
            }
        };

        // Decide how to execute the drawing script
        if(forExport) { // Then execute the script right now
            drawing();
        }
        else { // Then execute the script only once before computing a new frame (If the screen framerate is 60fps then only draw the map 60 times per second)
            window.requestAnimationFrame(drawing); // Optimizes the program execution speed
        }
    }
}
