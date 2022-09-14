"use strict";

/**
 * Define three Symbol objects representing RGB colors name
*/
const RGB = {
    Red: Symbol("R"),
    Green: Symbol("G"),
    Blue: Symbol("B")
}

/** Class representing a RGB color*/
class RGBColor {
    #red; // A Number, in [0, 1]
    #green; // A Number, in [0, 1]
    #blue; // A Number, in [0, 1]
    
    /**
     * RGBColor constructor
     * @param  {Number} red - Represents the red intensity on the range [0, 1]
     * @param  {Number} green - Represents the green intensity on the range [0, 1]
     * @param  {Number} blue - Represents the blue intensity on the range [0, 1]
     */
    constructor(red, green, blue) {
        if(red < 0 || red > 1 || green < 0 || green > 1 || blue < 0 || blue > 1) {
            throw "Invalid value for parameter(s) : (" + red + ", " + green + ", " + blue + ").\nValues must be included in [0,1]";
        }

        this.#red = red;
        this.#green = green;
        this.#blue = blue;
    }

    /**
     * @return {Number} - The intensity of red, in the range [0, 1]
     */
    getRed() {
        return this.#red;
    }

    /**
     * @return {Number} - The intensity of green, in the range [0, 1]
     */
    getGreen() {
        return this.#green;
    }

    /**
     * @return {Number} - The intensity of blue, in the range [0, 1]
     */
    getBlue() {
        return this.#blue;
    }

    /**
     * @return {Array<Number>} - An array of the three intensity for each color, in the order [Red, Green, Blue]
     */
    getRGB() {
        return [this.#red, this.#green, this.#blue];
    }

    /**
     * @param  {Number} red - An intensity of red, in the range [0, 1]
     */
    setRed(red) {
        this.#red = red;
    }
    
    /**
     * @param  {Number} green - An intensity of green, in the range [0, 1]
     */
    setGreen(green) {
        this.#green = green;
    }
    
    /**
     * @param  {Number} blue - An intensity of blue, in the range [0, 1]
     */
    setBlue(blue) {
        this.#blue = blue;
    }
    
    /**
     * @param  {Number} red - An intensity of red, in the range [0, 1]
     * @param  {Number} green - An intensity of green, in the range [0, 1]
     * @param  {Number} blue - An intensity of blue, in the range [0, 1]
     */
    setRGB(red, green, blue) {
        this.#red = red;
        this.#green = green;
        this.#blue = blue;
    }
}