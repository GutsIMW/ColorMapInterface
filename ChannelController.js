"use strict";

/**
 * Class controlling a channel (Controller in the MVC Design Pattern)
 */
class ChannelController {
    #channelModel; // Instance of Channel class, the channel model
    #channelView; // Instance of ChannelView class, the channel view
    
    /**
     * ChannelController constructor
     * @param  {Channel} channelModel
     * @param  {ChannelView} channelView
     */
    constructor(channelModel, channelView) {
        if(!channelModel instanceof Channel || !channelView instanceof ChannelView) {
            throw "Invalid parameter : " + channelModel + ", " + channelView;
        }

        this.#channelModel = channelModel;
        this.#channelView = channelView;
    }
    
    /**
     * @return {Integer} - The number of checkpoints in the channel model
     */
    getCheckpointsLength() {
        return this.#channelModel.getCheckpoints().length;
    }
    
    /**
     * @return {Array<Checkpoint>} - An array of all the checkpoints in the channel model
     */
    getCheckpoints() {
        return this.#channelModel.getCheckpoints();
    }
    
    /**
     * Determine if the coordinates (x,y) are inside a checkpoint drawing, used when the user click to add a checkpoint
     * @param  {Number} x - x coordinate, in [0, 1]
     * @param  {Number} y - y coordinate, in [0, 1]
     * @return {Integer} - The index of the checkpoint drawn at (x,y), -1 if there is no checkpoint drawn there
     */
    checkIfClickedOnACheckpoint(x, y) {
        let checkpoints = this.#channelModel.getCheckpoints();
        let i = 0;
        let res = false;
        let checkpointWidthNormalized = this.#channelView.getCheckpointWidth() / this.#channelView.getCanvas().width; // Checkpoint size depends on canvas resolution so we normalize eveything
        let checkpointHeightNormalized = this.#channelView.getCheckpointWidth() / this.#channelView.getCanvas().height;
        while(i < checkpoints.length && !res) { // Check if (x,y) is inside a checkpoint for each checkpoint one by one
            res =   Math.abs(checkpoints[i].getX() - x) <= Math.abs(checkpointWidthNormalized/2)
                && Math.abs(checkpoints[i].getY() -  y) <= Math.abs(checkpointHeightNormalized/2);
            i++;
        }
        return res ? i - 1 : -1; // Return the index of the checkpoint if there is one at (x, y) or -1 if not
    }
    
    /**
     * Display the channel
     */
    draw() {
        this.#channelView.draw(this.#channelModel);
    }
    
    /**
     * Add a checkpoint at (x, y) coordinates
     * @param  {Number} x - An x coordinate, in [0, 1]
     * @param  {Number} y - An y coordinate, in [0, 1]
     */
    addCheckpoint(x, y) {
        this.#channelModel.addCheckpoint(x, y);
        this.draw(); // Draw the updated channel
    }

    
    /**
     * Move a specified checkpoint to (x, y) coordinates
     * @param  {Checkpoint} checkpoint - The checkpoint to move
     * @param  {Number} x - An x coordinate, in [0, 1]
     * @param  {Number} y - An y coordinate, in [0, 1]
     */
    moveCheckpoint(checkpoint, x, y) {
        this.#channelModel.moveCheckpoint(checkpoint, x, y);
        this.draw(); // Draw the updated channel
    }

    /**
     * Remove a specified checkpoint
     * @param  {Checkpoint} checkpoint - The checkpoint to remove
     */
    removeCheckpoint(checkpoint) {
        this.#channelModel.removeCheckpoint(checkpoint);
        this.draw(); // Draw the updated channel
    }

    /**
     * Return the checkpoint at the index i
     * @param  {Integer} i - The index of a checkpoint to get
     * @return {Checkpoint} - The checkpoint at index i
     */
    getCheckpointAtIndex(i) {
        return this.#channelModel.getCheckpointAtIndex(i);
    }
    
    /**
     * Redefined the channel as at its instantiation
     */
    clearChannel() {
        this.#channelModel.clearChannel();
        this.draw(); // Draw the updated channel
    }
}