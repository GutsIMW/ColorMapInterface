"use strict";

/** Class used to initialize the program and to handle event*/
class Main {
    // Canvas
    #redCanvas; // The canvas displaying the red channel
    #greenCanvas; // The canvas displaying the green channel
    #blueCanvas; // The canvas displaying the blue channel
    #mapCanvas; // The canvas displaying the color map

    // Interactiv DOM elements
    #mapSize; // The size of the color map
    #mapSizeInput; // The input field for defining the size of the color map
    #filenameInput; // The input field for defining the filename of the exported color map
    #checkpointButton; // The button activating/disabling the control point placement functionality
    #testButton; // The button generating a black to white color map, mainly used for debug purpose
    #exportButton; // The button used to export the color map

    // Models
    #red; // Channel object, The red channel model
    #green; // Channel object, The green channel model
    #blue; // Channel object, The blue channel model
    #map; // ColorMap object, The color map model
    
    // Views
    #channelRView; // ChannelView object, the red channel view
    #channelGView; // ChannelView object, the green channel view
    #channelBView; // ChannelView object, the blue channel view
    #mapView; // ColorMapView object, the color map view
    
    // Controllers
    #rController; // ChannelController object, the red channel controller
    #gController; // ChannelController object, the green channel controller
    #bController; // ChannelController object, the blue channel controller
    #mapController; // ColorMapController object, the color map controller

    // Attributes needed for event management
    #checkpointMoved; // A reference to the checkpoint currently moved if there is one, null if not
    #checkpointPositionning; // A boolean indicating if the user is adding new checkpoints or not
    
    /**
     * Main constructor
     * @param  {Integer} size=50 - The initial size of the map, canbe modified later at any time by the user using the interface
     */
    constructor(size = 50) {
        // Canvas
        this.#redCanvas = document.getElementById("r-canvas");
        this.#greenCanvas = document.getElementById("g-canvas");
        this.#blueCanvas = document.getElementById("b-canvas");
        this.#mapCanvas = document.getElementById("map-canvas");

        // Interactiv DOM elements
        this.#mapSize = size;
        document.getElementById("input-map-size").value = size;

        this.#mapSizeInput = document.getElementById("input-map-size");
        this.#filenameInput = document.getElementById("map-filename");
        this.#checkpointButton = document.getElementById("button-checkpoint");
        this.#testButton = document.getElementById("button-test");
        this.#exportButton = document.getElementById("button-export");

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


        this.#checkpointMoved = null;
        this.#checkpointPositionning = false;
    }
    
    /**
     * Return a random Integer in [min, max] 
     * @param  {Integer} min - The minimum border
     * @param  {Integer} max - The maximum border
     * @return {Integer}  - A random Integer in [min, max]
     */
    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min +1)) + min;
    }
    
    /**
     * Generate a random color map, mainly used for debug purpose
     */
    generateRandomMap() {
        this.#rController.clearChannel();
        this.#gController.clearChannel();
        this.#bController.clearChannel();

        this.#rController.moveCheckpoint(this.#rController.getCheckpointAtIndex(0), Math.random(), Math.random());
        this.#gController.moveCheckpoint(this.#gController.getCheckpointAtIndex(1), Math.random(), Math.random());
        this.#rController.addCheckpoint(Math.random(), Math.random());
        this.#rController.addCheckpoint(Math.random(), Math.random());
        
        this.#gController.moveCheckpoint(this.#gController.getCheckpointAtIndex(0), Math.random(), Math.random());
        this.#gController.moveCheckpoint(this.#gController.getCheckpointAtIndex(1), Math.random(), Math.random());
        this.#gController.addCheckpoint(Math.random(), Math.random());
        this.#gController.addCheckpoint(Math.random(), Math.random());
        
        this.#bController.moveCheckpoint(this.#bController.getCheckpointAtIndex(0), Math.random(), Math.random());
        this.#bController.moveCheckpoint(this.#bController.getCheckpointAtIndex(1), Math.random(), Math.random());
        this.#bController.addCheckpoint(Math.random(), Math.random());
        this.#bController.addCheckpoint(Math.random(), Math.random());
        
        let rand = this.getRandomIntInclusive(0, 10);
        for(let i = 0; i<rand; i++) {
            if(Math.random() <= 0.5) {
                this.#rController.addCheckpoint(Math.random(), Math.random());
            }
            if(Math.random() <= 0.5) {
                this.#gController.addCheckpoint(Math.random(), Math.random());
            }
            if(Math.random() <= 0.5) {
                this.#bController.addCheckpoint(Math.random(), Math.random());
            }
        }
        
        this.#mapController.drawMap();
    }
    /**
     * Generate the initial map, used when initializing the program
     */
    generateDefaultMap() {
        // Clear all channel one by one
        this.#rController.clearChannel();
        this.#gController.clearChannel();
        this.#bController.clearChannel();

        // Draw the updated map
        this.#mapController.drawMap();
    }

    
    /**
     * Normalize coordinates
     * @param  {Number} x - An x coordinate
     * @param  {Number} y - An y coordinate
     * @param  {Integer} width - A number of pixel
     * @param  {Integer} height - A number of pixel
     * @return {Array<Number>} - Normalized coordinates
     */
    normalizeCoordinates(x, y, width, height) {
        let xNormalized = x/width;
        let yNormalized = y/height;
        return [xNormalized, yNormalized];
    }

    
    /**
     * Add the event listener and handler for generating the test map (black to white map)
     */
    addTestMapEvent() {
        // The event is triggered by the testButton button
        this.#testButton.addEventListener("click", (e) => {
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
        });
    }
    
    /**
     * Add the event listeners and handlers forall functionnality related to clicking on a checkpoint : Moving the point or removing the point
     */
    addClickOnCheckpointEvent() {
        // The event is triggered when the left click of the mouse end
        document.addEventListener('mouseup', (e) => { // Hande end of dragging event
            this.#checkpointMoved = null
        }, true);

        let channelsCanvas = document.getElementsByClassName("curve-canvas");
        for (let canvas of channelsCanvas) {
            // Find the checkpoint clicked to either move it or remove it
            // The event is triggered by the left click of the mouse on the channels canvas
            canvas.addEventListener("mousedown", (e) => {
                let rect = e.target.getBoundingClientRect();
                let x = e.clientX - rect.left;
                let y = rect.height - (e.clientY - rect.top);
                
                let normalizedCoordinates = this.normalizeCoordinates(x, y, rect.width, rect.height);
                let xNormalized = normalizedCoordinates[0];
                let yNormalized = normalizedCoordinates[1];
                let checkpointIndex = null;
                
                let controller = e.target.id[0] === "r" ? this.#rController : e.target.id[0] === "g" ? this.#gController : e.target.id[0] === "b" ? this.#bController: null;
                if(!controller) {
                    throw "error, invalid id : " + e.id
                }
                
                checkpointIndex = controller.checkIfClickedOnACheckpoint(xNormalized, yNormalized);
                if(e.button === 1 && checkpointIndex > 0 && checkpointIndex != controller.getCheckpointsLength() - 1) { // Middle mouse button remove a checkpoint (not allowed for first and last checkpoints)
                    controller.removeCheckpoint(controller.getCheckpointAtIndex(checkpointIndex));
                    this.#mapController.drawMap();
                }
                else if (e.button === 0) {
                    this.#checkpointMoved = controller.getCheckpointAtIndex(checkpointIndex);
                }
            });

            // Move a checkpoint at mouse position
            // The event is triggered when the mouse move
            canvas.addEventListener('mousemove', (e) => {
                if(!this.#checkpointMoved) { // If no checkpoint to move, then we don't have to run this function
                    return;
                }

                let controller = e.target.id[0] === "r" ? this.#rController : e.target.id[0] === "g" ? this.#gController : e.target.id[0] === "b" ? this.#bController: null;
                if(!controller) {
                    throw "error, invalid id : " + e.target.id
                }

                const canvas = e.target; // The current canvas which the user interact with
                let rect = canvas.getBoundingClientRect();
                let x = e.clientX - rect.left; // x position within the element.
                let y = rect.height - (e.clientY - rect.top);  // y position within the element.
                
                let normalizedCoordinates = this.normalizeCoordinates(x, y, rect.width, rect.height); // In the model, everything is normalized
                let xNormalized = normalizedCoordinates[0];
                let yNormalized = normalizedCoordinates[1];

                if(x <= canvas.offsetWidth && x >= 0 && y <= canvas.offsetHeight && y >= 0) {
                    controller.moveCheckpoint(this.#checkpointMoved, xNormalized, yNormalized);
                    this.#mapController.drawMap();
                }
            });
        }
    }

    /**
     * Add the event listener and handler for adding checkpoint
     */
    addCheckpointPositioningEvent() {
        const channelsCanvas = document.getElementsByClassName("curve-canvas");
        for (let canvas of channelsCanvas) {
            // Add checkpoint at the position of the mouse
            // The event is triggered by the left click on the channels canvas
            canvas.addEventListener("click", (e) => {
                if(!this.#checkpointPositionning) {
                        return;
                }

                let rect = e.target.getBoundingClientRect();
                let x = e.clientX - rect.left;
                let y = rect.height - (e.clientY - rect.top);
    
                let normalizedCoordinates = this.normalizeCoordinates(x, y, rect.width, rect.height);
                let xNormalized = normalizedCoordinates[0];
                let yNormalized = normalizedCoordinates[1];
    
                let controller = e.target.id[0] === "r" ? this.#rController : e.target.id[0] === "g" ? this.#gController : e.target.id[0] === "b" ? this.#bController: null;
                if(!controller) {
                    throw "error, invalid id : " + e.target.id;
                }
                controller.addCheckpoint(xNormalized, yNormalized)
                this.#mapController.drawMap();
            });
        }

        // Set a variable that indicates if we are using the checkpoint positionning feature or not
        this.#checkpointButton.addEventListener("click", (e) => {
            this.#checkpointPositionning = !this.#checkpointPositionning;
            if(this.#checkpointPositionning) {
                this.#checkpointButton.style.backgroundColor = "#d94025";
                this.#checkpointButton.innerHTML = "Press to disable Checkpoint Positioning";
            }
            else {
                this.#checkpointButton.style.backgroundColor = "#66d366";
                this.#checkpointButton.innerHTML = "Press to enable Checkpoint Positioning";
            }
        });
    }

    /**
     * Add the event listener and handler for modifying the size of the color map
     */
    addMapResizeEvent() {
        // The event is triggered when modifying the value in the input field mapSizeInput
        this.#mapSizeInput.addEventListener("input", (e) => {
            this.#mapSize = this.#mapSizeInput.value;
            this.#mapController.setMapSize(this.#mapSize);
            this.#mapController.drawMap();
        });  
    }

    /**
     * Add the event listener and handler for exporting the color map
     */
    addExportMapPNGEvent() {
        // The event is triggered by clicking on the exportButton button
        this.#exportButton.addEventListener("click", (e) => {
            this.#mapCanvas.width = this.#mapSize; // We modify the width resolution of the canvas just for the exportation of the map, to fit the size of the map
            this.#mapController.drawMap(true); // Need to redraw the map after changing the resolution of the canvas
            
            const MIME_TYPE = "image/png";
            const imgURL = this.#mapCanvas.toDataURL(MIME_TYPE);
        
            let dlLink = document.createElement('a');
            dlLink.download = this.#filenameInput.value;

            let currentdate = new Date(); 
            let datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + "_"  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds() + "_";
            dlLink.download = datetime + dlLink.download;
            console.log(dlLink.download)

            dlLink.href = imgURL;
            dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
        
            document.body.appendChild(dlLink);
            dlLink.click();
            document.body.removeChild(dlLink);

            this.#mapCanvas.width = this.#mapCanvas.parentNode.offsetWidth;
            this.#mapController.drawMap();
        });
    }

    /**
     * Add the event listener and handler for cleaning the channels
     */
    addClearEvent() {
        // The event is triggered by clicking on the button with the id "button-clear-r"
        document.getElementById("button-clear-r").addEventListener("click", (e) => {
            this.#rController.clearChannel();
            this.#mapController.drawMap();
        });
        // The event is triggered by clicking on the button with the id "button-clear-g"
        document.getElementById("button-clear-g").addEventListener("click", (e) => {
            this.#gController.clearChannel();
            this.#mapController.drawMap();
        });
        // The event is triggered by clicking on the button with the id "button-clear-b"
        document.getElementById("button-clear-b").addEventListener("click", (e) => {
            this.#bController.clearChannel();
            this.#mapController.drawMap();
        });
    }


    
    /**
     * Add all the event listeners and handlers
     */
    addAllEvents() {
        this.addTestMapEvent();
        this.addCheckpointPositioningEvent();
        this.addClickOnCheckpointEvent();
        this.addMapResizeEvent();
        this.addExportMapPNGEvent();
        this.addClearEvent();
    }

    /**
     * Initialize the program
     */
    run() {
        this.#redCanvas.width = this.#redCanvas.parentNode.offsetWidth;
        this.#greenCanvas.width = this.#greenCanvas.parentNode.offsetWidth;
        this.#blueCanvas.width = this.#blueCanvas.parentNode.offsetWidth;
        this.#mapCanvas.width = this.#mapCanvas.parentNode.offsetWidth;

        this.#redCanvas.height = this.#redCanvas.parentNode.offsetHeight;
        this.#greenCanvas.height = this.#greenCanvas.parentNode.offsetHeight;
        this.#blueCanvas.height = this.#blueCanvas.parentNode.offsetHeight;
        this.#mapCanvas.height = 10;

        this.#redCanvas.style.imageRendering = "crisp-edges";
        this.#greenCanvas.style.imageRendering = "crisp-edges";
        this.#blueCanvas.style.imageRendering = "crisp-edges";
        this.#mapCanvas.style.imageRendering = "crisp-edges";

        // this.generateRandomMap();
        this.generateDefaultMap();
        this.#rController.draw();
        this.#gController.draw();
        this.#bController.draw();
        this.#mapController.drawMap();

        this.addAllEvents();
    }
}



// Launch the program
// const mode = prompt("Enter 1 to launch tests or press any key to continue normally.\nThere is no interaction in test mode.");
// if(parseInt(mode)   === 1) {
//     let test = new Test();
//     test.run()
// }
// else {
//     let main = new Main();
//     main.run()
// }

let main = new Main();
main.run()