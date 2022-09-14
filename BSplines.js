"use strict";

/** Class modelizing Matrices and performing Matrices calculation */
class Matrix {
    
    array; // An array of 2 dimensions, containing the matrix items
    
    /**
     * Matrix constructor
     * @param  {Array<Array<Number>>} array - the matrix items
     */
    constructor(array) {
        if(array.length === 0) {
            throw "Error, can't create an empty matrix."
        }
        if(!(array[0] instanceof Array)) {
            throw "The element of the parameter array must be instances of Array class.";
        }

        let lineSize = array[0].length != undefined ? array[0].length : 1;
        for(let i = 1; i < array.length; i++) {
            let condition = (array[i].length != undefined) ? array[i].length : 1;
            if(lineSize != condition) {
                throw "Error, different size of line";
            }
            lineSize = array[i].length != undefined ? array[i].length : 1
        }
        this.array = array;
    }

    
    /**
     * @param  {Integer} i - An index of line
     * @param  {Integer} j - an index of column
     * @return {number} - The matrix item at line i and column j
     */
    getElement(i, j) {
        return this.array[i][j];
    }
    
    /**
     * @return {Array<Number>} - The dimensions of the matrix, first element is the number of line and second element is the number of column
     */
    dimension() {
        return [this.array.length, this.array[0].length != undefined ? this.array[0].length : 1];
    }

    /**
     * Check if two matries have the same dimensions
     * @param  {Matrix} m1 - A first matrix
     * @param  {Matrix} m2 - A second matrix
     */
    static haveSameDimension(m1, m2) {
        let m1Dim = m1.dimension();
        let m2Dim = m2.dimension();
        return m1Dim[0] === m2Dim[0] && m1Dim[1] === m2Dim[1];

    }

    /**
     * Add two matrices
     * @param  {Matrix} m1 - A first matrix
     * @param  {Matrix} m2 - A second matrix
     * @return {Matrix} - The matrix resulting in the addition of m1 and m2
     */
    static add(m1, m2) {
        if(!this.haveSameDimension(m1, m2)) {
            throw "Matrices in parameter don't have the same dimensions : m1 Dimensions are equal to " + m1.dimension() + " while m2 Dimensions are equal to " + m2.dimension();
        }
        let mRes = [];
        for(let i = 0; i < m1.dimension()[0]; i++) {
            let newLine = [];
            for(let j = 0; j < m1.dimension()[1]; j++) {
                newLine.push(m1.getElement(i,j) + m2.getElement(i,j)); 
            }
            mRes.push(newLine);
        }
        return new Matrix(mRes);
    }

    /**
     * Performs a scalar product
     * @param  {Number} k - A scalar
     * @param  {Matrix} m - A matrix to multiply by the scalar k
     * @return {Matrix} - The matrix resulting in the sclar product of m by k
     */
    static scalarProduct(k, m) {
        if(!m instanceof Matrix) {
            throw "Error, parameter m1 must be an instance of Matrix class.";
        }
        let mRes = [];
        for(let i = 0; i < m.dimension()[0]; i++) {
            let newLine = [];
            for(let j = 0; j < m.dimension()[1]; j++) {
                newLine.push(m.getElement(i,j) * k);
            }
            mRes.push(newLine);
        }
        return new Matrix(mRes);
    }

    
    /**
     * Performs the product of two matrices, the number of column of m1 must be equal to the number of line of m2
     * @param  {Matrix} m1 - A first matrix
     * @param  {Matrix} m2 - A second matrix
     * @return {Matrix} - The matrix resulting in the product of m1 and m2
     */
    static product(m1, m2) {
        if(m1.dimension()[1] != m2.dimension()[0]) {
            throw "Error, cannot multiply these two matrices, the number of column of m1 is different than the number of line of m2";
        }
        let mRes = [];
        for(let i = 0; i < m1.dimension()[0]; i++) {
            let newLine = [];
            for(let j = 0; j < m2.dimension()[1]; j++) {
                let newElem = 0;
                for(let k = 0; k < m1.dimension()[1]; k++) {
                    newElem += m1.getElement(i, k) * m2.getElement(k, j)
                }
                newLine.push(newElem);
            }
            mRes.push(newLine);
        }
        return new Matrix(mRes);
    }

    /**
     * @return - The aray of items in this matrix
     */
    toString() {
        return this.array;
    }
}


/** 
 * Class performing B-Splines calculations to evaluate a Bezier Curve.
 * This class can't be instantiate, it has to be used as a static class.
*/
class BSplines {

    /**
     * Only throw an error in every cases, this class cannot be instantiate and shouldn't be
     */
    constructor() {
        throw "This class cannot be instantiate and can only be used as static"
    }

    // The next 3 matrices are used for the open B-Splines algorithm
    static M1 = Matrix.scalarProduct(1/2, new Matrix([ // The matrix used to evaluate the first part of a B-Spline
        [2, -4, 2],
        [-3, 4, 0],
        [1, 0, 0]
    ]));

    static M2 = Matrix.scalarProduct(1/2, new Matrix([ // The matrix used to evaluate the intermediate parts of a B-Spline
        [1, -2, 1],
        [-2, 2, 1],
        [1, 0, 0]
    ]));

    static M3 = Matrix.scalarProduct(1/2, new Matrix([ // The matrix used to evaluate the last part of a B-Spline
        [1, -2, 1],
        [-3, 2, 1],
        [2, 0, 0]
    ]));

    /**
     * Compute the knot vector of an Open B-Spline of degree k and dependent of n control points
     * @param  {Integer} k - The degree of the curve
     * @param  {Integer} n - The number of control points
     * @return {Array<Integer>} - A knot vector, padded
     */
    static knotVectorOpenBSpline(k, n) {
        if(k > n) {
            throw "Error, the degree k of the curve must be less than or equal to the number n of control points.";
        }
        
        let m = k + n + 1; // m is the size of the knot vector
        let knotVec = [];

        let i = 0;
        let j = 0;
        for(i; i <= k; i++) { // Same value for the k + 1 first elements 
            knotVec.push(j);
        }
        for(i; i < m - k; i++) {
            j++;
            knotVec.push(j);
        }
        for(i; i < m; i ++) { // Same value for the k + 1 last elements
            knotVec.push(j);
        }
        return knotVec;
    }

    /**
     * Determine the index of the part of the curve in which t lies, either 0, 1 or 2 indicating if the t parameters correspond to the first spline, the last spline or one in between
     * @param  {Array<Integer>} knots - Array of knot positions, needs to be padded
     * @param  {Number} t - The parameter t of the Bezier curve, in range [0, 1]
     * @param  {Integer} k - The degree of the curve
     * @returns {Integer} - The index of the part of the curve in which t lies, either 0, 1 or 2 indicating if the t parameters correspond to the first spline, the last spline or one in between
     */
    static determineCurveIndex(knots, t, k) { // Return either 0, 1 or 2 indicating if the t parameters correspond to the first spline, the last spline or one in between
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
     * Evaluate the Open Quadratic B-Spline at t
     * @param  {Array<Point>} cpoints - The control points
     * @param  {Number} t - The parameter t of the Bezier curve, in range [0, 1]
     * @return {Point} - The evaluated point
     */
    static evaluateOpenQuadraticBSpline(cpoints, t) {
        if(cpoints.length < 3) {
            throw "Error, not enough control point to generate an open uniform quadratic B-Spline curve.";
        }
        cpoints.forEach(element => {
            if(!(element instanceof Point)) {
                throw "Error, the array cpoints does not contain only Point objects.";
            }
        });

        let k = 2; // k is the degree of the curve (quadratic then k ===2)
        let knots = this.knotVectorOpenBSpline(k, cpoints.length);
        let curveIndex = this.determineCurveIndex(knots, t, k);
        let P = cpoints.slice(curveIndex, curveIndex + 3); // An array of 3 control points

        let M = curveIndex === 0 ? this.M1 : curveIndex === cpoints.length - 3 ? this.M3 : this.M2; // A Matrix of coefficient
        let T = new Matrix([ // A Matrix of coefficient t from degree 0 to 2 (quadratic)
            [Math.pow(t - curveIndex, 2)],
            [t - curveIndex],
            [1],
        ]);
        
        let Px = new Matrix([
            [P[0].getX(), P[1].getX(), P[2].getX()],
        ])

        let Py = new Matrix([
            [P[0].getY(), P[1].getY(), P[2].getY()],
        ])

        let tmp = Matrix.product(M, T);
        tmp = [Matrix.product(Px, tmp).getElement(0,0), Matrix.product(Py, tmp).getElement(0,0)];
        let result = new Point(tmp[0], tmp[1]);
        return result;
    }
    
    /**
     * Discretize N points of an Open Quadratic B-Spline
     * @param  {Array<Point>} cpoints - The control points
     * @param  {Integer} N - The number of points to discretize
     * @return {Array<Point>} The discretized points
     */
    static discretizeOpenQuadraticBSpline(cpoints, N) {
        if(cpoints.length <= 3) return DeCasteljau.bezierCurveDiscretizeN(cpoints, N); // If only 3 control points or less, same as a simple Bézier curve

        let curvePoints = []
        let knots = this.knotVectorOpenBSpline(2, cpoints.length);
        let dt = 1.0/N * knots[knots.length - 1];
        let t = 0;

        while(t < knots[knots.length - 1]) {
            curvePoints.push(this.evaluateOpenQuadraticBSpline(cpoints, t));
            t+= dt;
        }
        if(curvePoints[curvePoints.length - 1].getX() != 1) { // The last ieration isn't accurate because float calculation isn't precise enough. We have to handle it specificaly
            curvePoints.push(this.evaluateOpenQuadraticBSpline(cpoints, knots[knots.length - 1])); // Because float calculation isn't precise, we make sure that we compute the last point (very important one)
        }

        return curvePoints;
    }
}