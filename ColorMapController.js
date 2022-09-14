"use strict";

/**
 * Class controlling a color map model (Controller in the MVC Design Pattern)
 */
class ColorMapController {
    #colorMapModel; // Instance of ColorMap class, the color map model
    #colorMapView; // Instance of ColorMapView class, the color map view
    
    /**
     * ColorMapController constructor
     * @param  {ColorMap} colorMapModel - the color map model (MVC Design Patter)
     * @param  {ColorMapView} colorMapView - the color map view (MVC Design Patter)
     */
    constructor(colorMapModel, colorMapView) {
        if(!colorMapModel instanceof ColorMap || !colorMapView instanceof ColorMapView) {
            throw "Invalid parameter : " + colorMapModel + ", " + colorMapView;
        }
        this.#colorMapModel = colorMapModel;
        this.#colorMapView = colorMapView;
    }

    /**
     * Update the size of the color map model and draw the updated color map
     * @param  {Integer} size - update the size of the color map in the MVC model
     */
    setMapSize(size) {
        this.#colorMapModel.updateSize(size);
        this.#colorMapView.draw(this.#colorMapModel);
    }

    
    /**
     * Refresh the color map model
     */
    updateMapModel() {
        this.#colorMapModel.update();
    }

    /**
     * Update and display the color map
     * @param  {Boolean} forExport=false - Indicates if this drawing is made in order to export the drawn map right after
     */
    drawMap(forExport = false) {
        this.updateMapModel(); // Ensure that the model is updated
        this.#colorMapView.draw(this.#colorMapModel, forExport);
    }
}