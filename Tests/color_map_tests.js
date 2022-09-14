"use strict";

/**
 * Class performing calculation of Open Quadratic B-Spline of degree 2, used for tests
 */
class BSplineDegree2Test {


    /**
     * * Determine the index of the part of the curve in which t lies, either 0, 1 or 2 indicating if the t parameters correspond to the first spline, the last spline or one in between
     * @param  {Array<Integer>} knots - Array of knot positions, needs to be padded.
     * @param  {Number} t - The parameter of the Bezier curve, in range [0, 1]
     * @return {Integer} - the index of the curve part
     */
    static determineCurveIndex(knots, t) { // Return either 0, 1 or 2 indicating if the t parameters correspond to the first spline, the last spline or one in between
        let k = 2;
        if(t >= knots[0] && t < knots[k + 1]) { // We are in the first curve
            return 0;
        }
        else if(t >= knots[k + 1] && t < knots[knots.length - k - 2]) { // We are in the middle
            let i = 1;
            while(knots[k + 1 + i] <= t) {
                i++;
            }
            return i;
        }
        else if(t >= knots[knots.length - k - 2] && t <= knots[knots.length - 1]){
            return knots.length - 2*k - 2; // The index of the previous previous last control point
        }
        throw "Error, t isn't included in the range defined by the array knots";
    }

    /**
     * Evaluate a B-Spline of degree 2 from an array of 3 or 4 control points
     * @param  {Array<Point>} cpoints - The control points
     * @param  {Number} t - The parameter of the Bezier curve, in range [0, 1]
     * @return {Point} - The evaluated point at t
     */
    static evaluate(cpoints, t) {
        if(cpoints.length < 3 || cpoints.length > 4) throw "For the moment, this class only suport 3 and 4 control points to modelize a curve of degree 2.";
        
        if(cpoints.length === 3) {
            if(t < 0 || t > 1) throw "Parameter t must be included in [0, 1]. t = " + t + " is invalid.";
            let newX = Math.pow(1-t, 2) * cpoints[0].getX()  + (2 * (1 - t) * t) * cpoints[1].getX() + Math.pow(t, 2) * cpoints[2].getX();
            let newY = Math.pow(1-t, 2) * cpoints[0].getY()  + (2 * (1 - t) * t) * cpoints[1].getY() + Math.pow(t, 2) * cpoints[2].getY();
            return new Point(newX, newY);
        }
        if(cpoints.length === 4) {
            if(t < 1) { // We are in the first Bézier curve
                let newX = Math.pow(1-t, 2) * cpoints[0].getX()  + ((t - Math.pow(t, 2)) + (2*t - Math.pow(t, 2))/2 ) * cpoints[1].getX() + (Math.pow(t, 2)/2) * cpoints[2].getX();
                let newY = Math.pow(1-t, 2) * cpoints[0].getY()  + ((t - Math.pow(t, 2)) + (2*t - Math.pow(t, 2))/2 ) * cpoints[1].getY() + (Math.pow(t, 2)/2) * cpoints[2].getY();
                return new Point(newX, newY);
            }
            else{ // We are in the second Bézier curve
                let newX = (Math.pow(2-t, 2)/2) * cpoints[1].getX()  + (((2*t - Math.pow(t, 2)) / 2) + (2-t)*(t-1)) * cpoints[2].getX() + Math.pow(t-1, 2) * cpoints[3].getX();
                let newY = (Math.pow(2-t, 2)/2) * cpoints[1].getY()  + (((2*t - Math.pow(t, 2)) / 2) + (2-t)*(t-1)) * cpoints[2].getY() + Math.pow(t-1, 2) * cpoints[3].getY();
                return new Point(newX, newY);
            }
        }
    }

    /**
     * Discretized n y values from an Open Quadratic B-Spline curve
     * @param  {Array<Point>} cpoints - The control points
     * @param  {} n - The number of points to discretize
     */
    static discretizeYvalue(cpoints, n) {
        let res = [];
        let deltax = 1/n * (cpoints.length - 2);
        let t = 0;
        for(let i = 0; i < n; i++) {
            res.push(this.evaluate(cpoints, t).getY());
            t += deltax;
        }
        return res;
    }
}

/**
 * Class generating images and color map for tests
 */
class Test {
    // Canvas
    #redCanvas;
    #greenCanvas;
    #blueCanvas;
    #mapCanvas;
    #testCanvas;

    // Interactiv DOM elements
    #mapSize;

    // Models
    #red;
    #green;
    #blue;
    #map;
    
    // Views
    #channelRView;
    #channelGView;
    #channelBView;
    #mapView;
    
    // Controllers
    #rController;
    #gController;
    #bController;
    #mapController;
    
    /**
     * Test constructor
     * @param  {} size=600
     */
    constructor(size = 600) {
        // Canvas
        this.#redCanvas = document.getElementById("r-canvas");
        this.#greenCanvas = document.getElementById("g-canvas");
        this.#blueCanvas = document.getElementById("b-canvas");
        this.#mapCanvas = document.getElementById("map-canvas");
        this.#testCanvas = document.getElementById("test-canvas");

        // Interactiv DOM elements
        this.#mapSize = size;
        document.getElementById("input-map-size").value = size;

        // Models
        this.#red = new Channel(RGB.Red);
        this.#green = new Channel(RGB.Green);
        this.#blue = new Channel(RGB.Blue);
        this.#map = new ColorMap(this.#red, this.#green , this.#blue, this.#mapSize);

        // Views
        this.#channelRView = new ChannelView(this.#redCanvas);
        this.#channelGView = new ChannelView(this.#greenCanvas);
        this.#channelBView = new ChannelView(this.#blueCanvas);
        this.#mapView = new ColorMapView(this.#mapCanvas);

        // Controllers
        this.#rController = new ChannelController(this.#red, this.#channelRView);
        this.#gController = new ChannelController(this.#green, this.#channelGView);
        this.#bController = new ChannelController(this.#blue, this.#channelBView);
        this.#mapController = new ColorMapController(this.#map, this.#mapView);
    }

    /**
     * Discretized n points from a liear curve
     * @param  {Number} a - Slope of the curve, a must be in [-b, 1-b]
     * @param  {Number} b - b coefficient of the curve, b must be in [0, 1]
     * @param  {Integer} n - The number of points to discretize
     */
    discretizeLinear(a, b, n) {
        if(b < 0 || b > 1 ) throw "b not in [0,1].";
        if(a < 0 - b || a > 1 - b) throw "a not in [0 - b, 1 - b]";

        let res = [];
        let deltax = 1/n;
        let x = 0;
        for(let i = 0; i < n; i++) {
            res.push(a * x + b);
            x += deltax;
        }

        return res;
    }


    /**
     * Generate a constant color map
     * @param  {Number} r - A value between [0,1], describing the intesity of red by percentage in the color map
     * @param  {Number} g - A value between [0,1], describing the intesity of green by percentage in the color map
     * @param  {Number} b - A value between [0,1], describing the intesity of blue by percentage in the color map
     */
    generateConstantMap(r, g, b) {
        this.#rController.clearChannel();
        this.#gController.clearChannel();
        this.#bController.clearChannel();

        this.#rController.moveCheckpoint(this.#rController.getCheckpointAtIndex(0), 0, r);
        this.#rController.moveCheckpoint(this.#rController.getCheckpointAtIndex(1), 1, r);

        this.#gController.moveCheckpoint(this.#gController.getCheckpointAtIndex(0), 0, g);
        this.#gController.moveCheckpoint(this.#gController.getCheckpointAtIndex(1), 1, g);
        
        this.#bController.moveCheckpoint(this.#bController.getCheckpointAtIndex(0), 0, b);
        this.#bController.moveCheckpoint(this.#bController.getCheckpointAtIndex(1), 1, b);

        this.#mapController.drawMap();
    }
    
    
    /**
     * Generate the default color map
     */
    generateDefaultMap() {
        this.#rController.clearChannel();
        this.#gController.clearChannel();
        this.#bController.clearChannel();

        this.#mapController.drawMap();
    }

    /**
     * Generate a completely white color map
     */
    generateFullWhiteColorMap() {
        this.generateConstantMap(1, 1, 1);
    }

    /**
     * Generate a completely black color map
     */
    generateFullBlackColorMap() {
        this.generateConstantMap(0, 0, 0);
    }

    /**
     * Generate a completely grey color map
     */
    generateFullGreyColorMap() {
        this.generateConstantMap(0.5, 0.5, 0.5);
    }

    /**
     * Generate a completely red color map
     */
    generateFullRedColorMap() {
        this.generateConstantMap(1, 0, 0);
    }

    /**
     * Generate a completely green color map
     */
    generateFullGreenColorMap() {
        this.generateConstantMap(0, 1, 0);
    }

    /**
     * Generate a completely blue color map
     */
    generateFullBlueColorMap() {
        this.generateConstantMap(0, 0, 1);
    }

    /**
     * Generate a black to white color map
     */
    generateBlackToWhiteMap() {
        this.#rController.clearChannel();
        this.#gController.clearChannel();
        this.#bController.clearChannel();

        this.#rController.moveCheckpoint(this.#rController.getCheckpointAtIndex(0), 0, 0);
        this.#rController.moveCheckpoint(this.#rController.getCheckpointAtIndex(1), 1, 1);

        this.#gController.moveCheckpoint(this.#gController.getCheckpointAtIndex(0), 0, 0);
        this.#gController.moveCheckpoint(this.#gController.getCheckpointAtIndex(1), 1, 1);

        this.#bController.moveCheckpoint(this.#bController.getCheckpointAtIndex(0), 0, 0);
        this.#bController.moveCheckpoint(this.#bController.getCheckpointAtIndex(1), 1, 1);

        this.#mapController.drawMap();
    }
    
    /**
     * Export a color map
     * @param  {String} fileName - The name of the exported file
     */
    exportMap(fileName) {
        const MIME_TYPE = "image/png";
        const imgURL = this.#mapCanvas.toDataURL(MIME_TYPE);

        let dlLink = document.createElement('a');
        dlLink.download = fileName;
        dlLink.download = dlLink.download;

        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
    }

    /**
     * Export a reference image
     * @param  {String} fileName - The name of the exported image
     */
    exportReference(fileName) {
        // Export the color map
        const MIME_TYPE = "image/png";
        const imgURL = this.#testCanvas.toDataURL(MIME_TYPE);
    
        let dlLink = document.createElement('a');
        dlLink.download = fileName;
        dlLink.download = dlLink.download;
    
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
    
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
        this.#testCanvas.style.display = "none";
    }

    /**
     * Create a black to white reference image
     * @param  {Integer} size - The width in pixel of the image
     */
    createBlackToWhiteReference(size) {
        let imgData = [];
        for(let i = 0; i < size; i++) {
            imgData.push((i/(size-1)) * 100);
        }
        return imgData;
    }
    
    /**
     * Draw a reference image on a canvas
     * @param  {Array<Number>} reds - Array of normalized intensities for the red channel
     * @param  {Array<Number>} greens - Array of normalized intensities for the green channel
     * @param  {Array<Number>} blues - Array of normalized intensities for the blue channel
     */
    drawTestImage(reds, greens, blues) {
        this.#testCanvas.style.display = "unset"
        let ctx = this.#testCanvas.getContext("2d");
        ctx.clearRect(0, 0, this.#testCanvas.width, this.#testCanvas.height);
        for(let j = 0; j < this.#testCanvas.width; j++) {
            let styleRGB = "rgb(" + reds[j] * 100 + "% ," + greens[j] * 100 + "% ," + blues[j] * 100 + "%)";
            ctx.fillStyle = styleRGB;
            ctx.fillRect(j, 0, 1, this.#testCanvas.offsetHeight);
        }
    }
    
    /**
     * generate and export all color map for test 0 (test constant map)
     */
    exportAllTest0Maps() {
        this.generateFullBlackColorMap();
        this.exportMap("map_test_0_full_black_" + this.#mapSize + "x10");

        this.generateFullWhiteColorMap();
        this.exportMap("map_test_0_full_white_" + this.#mapSize + "x10");

        this.generateFullGreyColorMap();
        this.exportMap("map_test_0_full_grey_" + this.#mapSize + "x10");

        this.generateFullRedColorMap();
        this.exportMap("map_test_0_full_red_" + this.#mapSize + "x10");

        this.generateFullGreenColorMap();
        this.exportMap("map_test_0_full_green_" + this.#mapSize + "x10");

        this.generateFullBlueColorMap();
        this.exportMap("map_test_0_full_blue_" + this.#mapSize + "x10");
    }

    /**
     * generate and export color map for test 1 (test black to white map)
     */
    exportTest1Map() {
        this.generateBlackToWhiteMap();
        this.exportMap("map_test_1_black_to_white_" + this.#mapSize + "x10");
    }

    /**
     * Export a linear color map, parameters are coefficients of linear functions for each channel
     * @param  {Number} ra - A coefficient of a linear curve
     * @param  {Number} rb - A coefficient of a linear curve
     * @param  {Number} ga - A coefficient of a linear curve
     * @param  {Number} gb - A coefficient of a linear curve
     * @param  {Number} ba - A coefficient of a linear curve
     * @param  {Number} bb - A coefficient of a linear curve
     */
    exportTest2Map(ra, rb, ga, gb, ba, bb) {
        this.#rController.clearChannel();
        this.#gController.clearChannel();
        this.#bController.clearChannel();

        this.#rController.moveCheckpoint(this.#rController.getCheckpointAtIndex(0), 0, rb);
        this.#rController.moveCheckpoint(this.#rController.getCheckpointAtIndex(1), 1, ra + rb);

        this.#gController.moveCheckpoint(this.#gController.getCheckpointAtIndex(0), 0, gb);
        this.#gController.moveCheckpoint(this.#gController.getCheckpointAtIndex(1), 1, ga + gb);

        this.#bController.moveCheckpoint(this.#bController.getCheckpointAtIndex(0), 0, bb);
        this.#bController.moveCheckpoint(this.#bController.getCheckpointAtIndex(1), 1, ba + bb);

        this.#mapController.drawMap();
        this.exportMap("map_test_2_linear_curve_600x10");
    }

    /**
     * Export a linear reference image, parameters are coefficients of linear functions for each channel
     * @param  {Number} ra - A coefficient of a linear curve for the red channel
     * @param  {Number} rb - A coefficient of a linear curve for the red channel
     * @param  {Number} ga - A coefficient of a linear curve for the green channel
     * @param  {Number} gb - A coefficient of a linear curve for the green channel
     * @param  {Number} ba - A coefficient of a linear curve for the blue channel
     * @param  {Number} bb - A coefficient of a linear curve for the blue channel
     */
    exportTest2Reference(ra, rb, ga, gb, ba, bb) {
        let reds = this.discretizeLinear(ra, rb, this.#mapSize);
        let greens = this.discretizeLinear(ga, gb, this.#mapSize);
        let blues = this.discretizeLinear(ba, bb, this.#mapSize);
        this.drawTestImage(reds, greens, blues);
        this.exportReference("reference_test_2_linear_curve_"+ this.#mapSize + "x10");
    }

    /**
     * Generate and export reference image and color map for test 2 (test linear color map)
     */
    exportTest2() {
        // Parameters a and b of a linear function
        let ra = -0.3;
        let rb = 0.7
        let ga = -0.1;
        let gb = 0.6;
        let ba = 0.6;
        let bb = 0.2;
    
        this.exportTest2Reference(ra, rb, ga, gb, ba, bb);
        this.exportTest2Map(ra, rb, ga, gb, ba, bb);
    }
    
    /**
     * generate and export color map for test 3 (Open Quadratic B-Spline depending on 3 control points)
     * @param  {Point} cpointsR - Control points of the red channel
     * @param  {Point} cpointsG - Control points of the green channel
     * @param  {Point} cpointsB - Control points of the blue channel
     */
    exportTest3Map(cpointsR, cpointsG, cpointsB) {
        this.#rController.clearChannel();
        this.#gController.clearChannel();
        this.#bController.clearChannel();

        this.#rController.moveCheckpoint(this.#rController.getCheckpointAtIndex(0), 0, cpointsR[0].getY());
        this.#rController.addCheckpoint(cpointsR[1].getX(), cpointsR[1].getY());
        this.#rController.moveCheckpoint(this.#rController.getCheckpointAtIndex(2), 1, cpointsR[2].getY());

        this.#gController.moveCheckpoint(this.#gController.getCheckpointAtIndex(0), 0, cpointsG[0].getY());
        this.#gController.addCheckpoint(cpointsG[1].getX(), cpointsG[1].getY());
        this.#gController.moveCheckpoint(this.#gController.getCheckpointAtIndex(2), 1, cpointsG[2].getY());

        this.#bController.moveCheckpoint(this.#bController.getCheckpointAtIndex(0), 0, cpointsB[0].getY());
        this.#bController.addCheckpoint(cpointsB[1].getX(), cpointsB[1].getY())
        this.#bController.moveCheckpoint(this.#bController.getCheckpointAtIndex(2), 1, cpointsB[2].getY());

        this.#mapController.drawMap();
        this.exportMap("map_test_3_BSpline_3CP_"+ this.#mapSize + "x10");
    }

    /**
     * generate and export reference image for test 3 (Open Quadratic B-Spline depending on 3 control points)
     * @param  {Point} cpointsR - Control points of the red channel
     * @param  {Point} cpointsG - Control points of the green channel
     * @param  {Point} cpointsB - Control points of the blue channel
     */
    exportTest3Reference(cpointsR, cpointsG, cpointsB) {
        let reds = BSplineDegree2Test.discretizeYvalue(cpointsR, this.#mapSize);
        let greens = BSplineDegree2Test.discretizeYvalue(cpointsG, this.#mapSize);
        let blues = BSplineDegree2Test.discretizeYvalue(cpointsB, this.#mapSize);
        this.drawTestImage(reds, greens, blues);
        this.exportReference("reference_test_3_BSpline_3CP_"+ this.#mapSize + "x10");
    }

    /**
     * Generate and export reference image and color map for test 3 (test Open Quadratic B-Spline depending on 3 control points color map)
     * The generated image and color map are fixed (values are predifined)
     */
    exportTest3Fixed() {
        let cpointsR = [];
        cpointsR.push(new Point(0, 0.7));
        cpointsR.push(new Point(0.4, 0.1));
        cpointsR.push(new Point(1, 0.1));

        let cpointsG = [];
        cpointsG.push(new Point(0, 0.2));
        cpointsG.push(new Point(0.5, 0.8));
        cpointsG.push(new Point(1, 0.9));

        let cpointsB = [];
        cpointsB.push(new Point(0, 0.5));
        cpointsB.push(new Point(0.6, 0.7));
        cpointsB.push(new Point(1, 0.4));

        this.exportTest3Reference(cpointsR, cpointsG, cpointsB);
        this.exportTest3Map(cpointsR, cpointsG, cpointsB);
    }

    /**
     * Generate and export reference image and color map for test 3 (test Open Quadratic B-Spline depending on 3 control points color map)
     * The generated image and color map are random
     */
    exportTest3Random() {
        let cpointsR = [];
        cpointsR.push(new Point(0, Math.random()));
        cpointsR.push(new Point(Math.random(), Math.random()));
        cpointsR.push(new Point(1, Math.random()));

        let cpointsG = [];
        cpointsG.push(new Point(0, Math.random()));
        cpointsG.push(new Point(Math.random(), Math.random()));
        cpointsG.push(new Point(1, Math.random()));

        let cpointsB = [];
        cpointsB.push(new Point(0, Math.random()));
        cpointsB.push(new Point(Math.random(), Math.random()));
        cpointsB.push(new Point(1, Math.random()));

        this.exportTest3Reference(cpointsR, cpointsG, cpointsB);
        this.exportTest3Map(cpointsR, cpointsG, cpointsB);
    }


    /**
     * generate and export color map for test 4 (Open Quadratic B-Spline depending on 4 control points)
     * @param  {Point} cpointsR - Control points of the red channel
     * @param  {Point} cpointsG - Control points of the green channel
     * @param  {Point} cpointsB - Control points of the blue channel
     */
    exportTest4Map(cpointsR, cpointsG, cpointsB) {
        this.#rController.clearChannel();
        this.#gController.clearChannel();
        this.#bController.clearChannel();

        this.#rController.moveCheckpoint(this.#rController.getCheckpointAtIndex(0), 0, cpointsR[0].getY());
        this.#rController.addCheckpoint(cpointsR[1].getX(), cpointsR[1].getY());
        this.#rController.addCheckpoint(cpointsR[2].getX(), cpointsR[2].getY());
        this.#rController.moveCheckpoint(this.#rController.getCheckpointAtIndex(3), 1, cpointsR[3].getY());

        this.#gController.moveCheckpoint(this.#gController.getCheckpointAtIndex(0), 0, cpointsG[0].getY());
        this.#gController.addCheckpoint(cpointsG[1].getX(), cpointsG[1].getY());
        this.#gController.addCheckpoint(cpointsG[2].getX(), cpointsG[2].getY());
        this.#gController.moveCheckpoint(this.#gController.getCheckpointAtIndex(3), 1, cpointsG[3].getY());

        this.#bController.moveCheckpoint(this.#bController.getCheckpointAtIndex(0), 0, cpointsB[0].getY());
        this.#bController.addCheckpoint(cpointsB[1].getX(), cpointsB[1].getY())
        this.#bController.addCheckpoint(cpointsB[2].getX(), cpointsB[2].getY())
        this.#bController.moveCheckpoint(this.#bController.getCheckpointAtIndex(3), 1, cpointsB[3].getY());

        this.#mapController.drawMap();
        this.exportMap("map_test_4_BSpline_4CP_"+ this.#mapSize + "x10");
    }

    /**
     * generate and export reference image for test 4 (Open Quadratic B-Spline depending on 4 control points)
     * @param  {Point} cpointsR - Control points of the red channel
     * @param  {Point} cpointsG - Control points of the green channel
     * @param  {Point} cpointsB - Control points of the blue channel
     */
    exportTest4Reference(cpointsR, cpointsG, cpointsB) {
        let reds = BSplineDegree2Test.discretizeYvalue(cpointsR, this.#mapSize);
        let greens = BSplineDegree2Test.discretizeYvalue(cpointsG, this.#mapSize);
        let blues = BSplineDegree2Test.discretizeYvalue(cpointsB, this.#mapSize);
        this.drawTestImage(reds, greens, blues);
        this.exportReference("reference_test_4_BSpline_4CP_"+ this.#mapSize + "x10");
    }

    /**
     * Generate and export reference image and color map for test 4 (test Open Quadratic B-Spline depending on 4 control points color map)
     * The generated image and color map are fixed (values are predifined)
     */
    exportTest4Fixed() {
        let cpointsR = [];
        cpointsR.push(new Point(0, 0.4));
        cpointsR.push(new Point(0.2, 0.9));
        cpointsR.push(new Point(0.8, 0.6));
        cpointsR.push(new Point(1, 0.1));

        let cpointsG = [];
        cpointsG.push(new Point(0, 0.7));
        cpointsG.push(new Point(0.3, 0.9));
        cpointsG.push(new Point(0.5, 0.8));
        cpointsG.push(new Point(1, 0.9));

        let cpointsB = [];
        cpointsB.push(new Point(0, 0.5));
        cpointsB.push(new Point(0.8, 0.9));
        cpointsB.push(new Point(0.9, 0.7));
        cpointsB.push(new Point(1, 0.4));

        this.exportTest4Reference(cpointsR, cpointsG, cpointsB);
        this.exportTest4Map(cpointsR, cpointsG, cpointsB);
    }

    /**
     * Generate and export reference image and color map for test 4 (test Open Quadratic B-Spline depending on 4 control points color map)
     * The generated image and color map are random
     */
    exportTest4Random() {
        let cpointsR = [];
        cpointsR.push(new Point(0, Math.random()));
        cpointsR.push(new Point(0.2, Math.random())); // Fixed x values to ensure that the points are sorted by x values
        cpointsR.push(new Point(0.6, Math.random()));
        cpointsR.push(new Point(1, Math.random()));

        let cpointsG = [];
        cpointsG.push(new Point(0, Math.random()));
        cpointsG.push(new Point(0.4, Math.random())); // Fixed x values to ensure that the points are sorted by x values
        cpointsG.push(new Point(0.8, Math.random()));
        cpointsG.push(new Point(1, Math.random()));

        let cpointsB = [];
        cpointsB.push(new Point(0, Math.random()));
        cpointsB.push(new Point(0.5, Math.random())); // Fixed x values to ensure that the points are sorted by x values
        cpointsB.push(new Point(0.7, Math.random()));
        cpointsB.push(new Point(1, Math.random()));

        this.exportTest4Reference(cpointsR, cpointsG, cpointsB);
        this.exportTest4Map(cpointsR, cpointsG, cpointsB);
    }
    
    /**
     * Generate and export all the reference images and color maps to test
     */
    run() {
        this.#redCanvas.width = this.#redCanvas.parentNode.offsetWidth;
        this.#greenCanvas.width = this.#greenCanvas.parentNode.offsetWidth;
        this.#blueCanvas.width = this.#blueCanvas.parentNode.offsetWidth;
        this.#mapCanvas.width = this.#mapCanvas.parentNode.offsetWidth;
        this.#testCanvas.width = this.#mapSize;

        this.#redCanvas.height = this.#redCanvas.parentNode.offsetHeight;
        this.#greenCanvas.height = this.#greenCanvas.parentNode.offsetHeight;
        this.#blueCanvas.height = this.#blueCanvas.parentNode.offsetHeight;
        this.#mapCanvas.height = 10;
        this.#testCanvas.height = 10;

        this.#redCanvas.style.imageRendering = "crisp-edges";
        this.#greenCanvas.style.imageRendering = "crisp-edges";
        this.#blueCanvas.style.imageRendering = "crisp-edges";
        this.#mapCanvas.style.imageRendering = "crisp-edges";
        this.#testCanvas.style.imageRendering = "crisp-edges";


        this.exportAllTest0Maps();
        this.exportTest1Map();
        this.exportTest2();
        this.exportTest3Fixed();
        this.exportTest3Random();
        this.exportTest4Fixed();
        this.exportTest4Random();
    }
}
