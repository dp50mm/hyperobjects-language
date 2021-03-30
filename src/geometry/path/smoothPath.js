import Path from "../Path"
import _ from "lodash"

/**
 * @param {*} steps 
 * Amount of steps used to interpolate through the path
 * 
 * @param {*} stepSize
 * Percentage of steps averaged together in new points
 * 
 * @param {*} toCurve 
 * Toggle whether path is a series of linear segments between points
 * or returnpath is curve fitted to a series of bezier segments.
 * 
 * @returns Path
 */
function smoothPath(steps = 100, stepSize = 0.1, toCurve = false) {
    if(stepSize >= 1) {
        console.warn("smoothPath function requires a stepsize lower than 1.")
        return new Path([])
    }
    if(stepSize === 0) {
        return new Path(this.points.slice()).copyStyle(this)
    }
    const points = _.range(steps).map(val => {
        return this.interpolate(val/steps)
    })
    const averagedPoints = _.range(steps).map(_i => {
        const includedPoints = _.range(Math.floor(steps * stepSize)).map(_j => {
            const i = (_i + _j) % steps
            return points[i]
        })
        return {
            x: _.mean(includedPoints.map(p => p.x)),
            y: _.mean(includedPoints.map(p => p.y)),
            z: _.mean(includedPoints.map(p => _.get(p, 'z', 0)))
        }
    })
    return new Path(averagedPoints).copyStyle(this)
}

export default smoothPath