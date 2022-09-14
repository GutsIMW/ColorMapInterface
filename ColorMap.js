"use strict";

/**
 * Class modelizing a color map (Model in the MVC Design Pattern)
 */
class ColorMap {
    #redChannel; // Channel object modelizing the color red
    #greenChannel; // Channel object modelizing the color green
    #blueChannel; // Channel object modelizing the color blue

    #colors; // An array of RGBColor objects
    #size; // The size of the map, in other words the number of RGBColor objects in this.#colors.


    /**
     * ColorMap constructor
     * @param  {Channel} red - the red channel
     * @param  {Channel} green - the green channel
     * @param  {Channel} blue - the blue channel
     * @param  {Integer} mapSize - the number of color of this color map
     */
    constructor(red, green, blue, mapSize) {
        if(!red instanceof Channel || !green instanceof Channel || !blue instanceof Channel) // Exception if wrong argument
        {
            throw "The red, green and blue parameter must be instances of Channel CLass."
        }

        // Initialize each channel
        this.#redChannel = red;
        this.#greenChannel = green;
        this.#blueChannel = blue;

        this.#size = mapSize;
        this.#colors = new Array(this.#size);
        this.update(); // Update a first time the color map to make sure there is data in this.#colors
    }

    /**
     * Return a channel modelizing the color specified in argument
     * @param  {RGB} rgbColor - A RGB Symbol
     * @return {Channel} - The channel modelizing the rgbColor
     */
    getRGBChannel(rgbColor) {
        switch(rgbColor) {
            case RGB.Red:
                return this.#redChannel;
            case RGB.Green:
                return this.#greenChannel;
            case RGB.Blue:
                return this.#blueChannel;
        }
    }
    
    /**
     * @return {Array<Channel>} - the three RGB channels modelizing this color map
     */
    getRGBChannels() {
        return [this.#redChannel, this.#greenChannel, this.#blueChannel];
    }

    /**
     * @return {Integer} - the number of colors of this color map
     */
    getSize() {
        return this.#size;
    }
        
    /**
     * @param  {Integer} size - The updated number of colors of this color map
     */
    updateSize(size) {
        this.#size = size;
        this.#colors = new Array(size);
        this.update();
    }

    /**
     * @return {Array<RGBColor>} - The array of rgb colors of the color map
     */
    getColors() {
        return this.#colors;
    }
    
    /**
     * Return the color at a specified index
     * @param  {Integer} k - An index of this.#colors array
     * @return {RGBColor} - A rgb color
     */
    getColorK(k) {
        if(k < 0 || k >= this.#size) {
            throw "Index k out of range : k = " + k + "\nk must be an integer and 0 <= k < " + this.#size;
        }
        return this.#colors[k];
    }

    /**
     * Normalize a value according to the size of the color map
     * @param  {Integer} k - An index of this.#colors array
     * @return {Number} - the normalized value of parameter k
     */
    #normalize(k) {
        return k / (this.#size - 1);
    }

    /**
     * Update the array of colors according to the aspect of the rgb channels
     */
    update() {
        for(let k = 0; k < this.#size; k++) { // One iteration for each color
            let x = this.#normalize(k); // Normalize the color index because channel.evaluateX(x) operates on normalized parameters.
            
            let r = this.#redChannel.evaluateX(x); // Evaluate the intensity of the red color
            let g = this.#greenChannel.evaluateX(x); // Evaluate the intensity of the green color
            let b = this.#blueChannel.evaluateX(x); // Evaluate the intensity of the blue color

            let color = new RGBColor(r, g, b); // Create a new RGBColor object
            this.#colors[k] = color; // Update the color at index k in this.#colors array
        }
    }
}
