"use strict";


/** Class representing a point*/
class Point {
    #x; // A number, representing an x coordinate
    #y; // A number, representing an y coordinate
    
    /**
     * Point constructor
     * @param  {Number} x - An x coordinate
     * @param  {Number} y - An y coordinate
     */
    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }
    
    /**
     * @return {Number} - The x coordinate
     */
    getX() {
        return this.#x;
    }

    /**
     * @param  {Number} x - An x coordinate
     */
    setX(x) {
        this.#x = x;
    }

    /**
     * @return - The y coordinate
     */
    getY() {
        return this.#y;
    }
    
    /**
     * @param  {Number} y - An y coordinate
     */
    setY(y) {
        this.#y = y;    
    }
}

/** Class representing a checkpoint*/
class Checkpoint extends Point{
    #colorName; // A RGB Symbol, indicates which channel this checkpoint belongs to
    
    /**
     * Checkpoint constructor
     * @param  {Number} x - An x coordinate
     * @param  {Number} y - An y coordinate
     * @param  {Symbol} colorName  - A RGB Symbol, indicates a color name
     */
    constructor(x, y, colorName) {
        if(colorName != RGB.Red && colorName != RGB.Green && colorName != RGB.Blue) {
            throw "Invalid color name, must be an instance of RGB."
        }

        super(x, y);
        this.#colorName = colorName;
    }

    /**
     * @return {Symbol} - The color name representing the channel this checkpoint belongs to
     */
    getColorName() {
        return this.#colorName;
    }
}