"use strict";

/** 
 * Class performing the De Casteljau algorithm to evaluate a Bezier Curve.
 * This class can't be instantiate, it has to be used as a static class.
*/
class DeCasteljau {
    
    /**
     * Only throw an error in every cases, this class cannot be instantiate and shouldn't be
     */
    constructor() {
        throw "This class cannot be instantiate and can only be used as static"
    }
    
    /**
     * Performs a linear combination between two 2D points
     * @param  {Point} pa - A 2D point
     * @param  {Point} pb - A 2D point
     * @param  {Number} u - A coefficient for the linear combination
     * @param  {Number} v - A coefficient for the linear combination
     * @return {Point} - The point resulting from the linear combination
     */
    static linearCombination(pa, pb, u, v) {
        let p = new Point(pa.getX() * u + pb.getX()* v, pa.getY() * u + pb.getY() * v)
        return p;
    }
    
    /**
     * Performs a linear interpolation between two 2D points
     * @param  {Point} pa - A 2D point
     * @param  {Point} pb - A 2D point
     * @param  {Number} t - The coefficient of the linear interpolation, in range [0, 1]
     * @return {Point} - - The point resulting from the linear interpolation
     */
    static linearInterpolation(pa, pb, t) {
        return DeCasteljau.linearCombination(pa, pb, t, 1-t);
    }
    
    /**
     * Performs one step of the De Casteljau algorithm
     * @param  {Array<Point>} points - The control points of the current step
     * @param  {Number} t - The parameter t of the Bezier curve, in [0, 1]
     * @return {Array<Point>} - An new array of interpolated points
     */
    static reduction(points, t) {
        let nouveaux_points = [];
        let N = points.length;
        for(let i = 0; i < N-1; i++) {
            nouveaux_points.push(DeCasteljau.linearInterpolation(points[i], points[i+1], 1-t))
        }
        return nouveaux_points;
    }
    
    /**
     * Evaluate the Bezier curve at t
     * @param  {Array<Point>} points - An array of control points
     * @param  {Number} t - The parameter t of the Bezier curve, in [0, 1]
     * @return {Point} - The evaluated point
     */
    static pointBezierT(points, t) {
        let n = points.length;
        while(n > 1) {
            points = DeCasteljau.reduction(points, t);
            n = points.length;
        }
        return points[0];
    }

    /**
     * Evaluate the y value on a Bezier curve at t
     * @param  {Array<Point>} points - An array of control points
     * @param  {Number} t - The parameter t of the Bezier curve, in [0, 1]
     * @return {Number} - The evaluated y value
     */
    static evaluate(points, t) {
        return this.pointBezierT(points, t).getY();
    }
    
    /**
     * Discretize N points from a Bezier curve using De Casteljau algorithm
     * @param  {Array<Point>} points - An array of control points
     * @param  {Integer} N - The number of point to discretize
     * @return {Array<Point>} - The discretized points
     */
    static bezierCurveDiscretizeN(points, N) {
        let dt = 1.0/N;
        let t = dt;
    
        let curvePoints = [points[0]];
        while(t < 1.0) {
            curvePoints.push(DeCasteljau.pointBezierT(points, t));
            t += dt;
        }

        if(curvePoints[curvePoints.length - 1].getX() != 1) { // The last iteration isn't accurate because float calculation isn't precise enough in JS. We have to handle it specificaly
            curvePoints.push(DeCasteljau.pointBezierT(points, 1)); // Because float calculation isn't precise, we make sure that we compute the last point (very important one)
        }
        return curvePoints;
    }
}