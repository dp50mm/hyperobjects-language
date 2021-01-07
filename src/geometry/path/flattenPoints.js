import Bezier from 'bezier-js'
import segmentLength from './segmentLength'


function flattenPoints(path) {
    let curvesFlattened = []
    let totalDistance = 0;
    const lutSteps = 50
    path.points.forEach((p, i, a) => {
        var nextPoint = false
        if(i === a.length - 1) {
        if(path.closedPath) {
            nextPoint = a[0]
        }
        } else {
        nextPoint = a[i+1]
        }
        if(nextPoint) {
        if(nextPoint.c) {
            const curve = new Bezier(
            p.x,
            p.y,
            nextPoint.c[0].x,
            nextPoint.c[0].y,
            nextPoint.c[1].x,
            nextPoint.c[1].y,
            nextPoint.x,
            nextPoint.y
            )
            let lut = curve.getLUT(lutSteps)
            curvesFlattened = curvesFlattened.concat(lut)
        } else if(nextPoint.q) {
            const curve = new Bezier(
            p.x,
            p.y,
            nextPoint.q.x,
            nextPoint.q.y,
            nextPoint.x,
            nextPoint.y
            )
            let lut = curve.getLUT(lutSteps)
            curvesFlattened = curvesFlattened.concat(lut)
        } else {
            curvesFlattened.push(p)
        }
        } else {
            curvesFlattened.push(p)
        }
    })
    curvesFlattened = curvesFlattened.map((p) => {
        return {
        ...p,
        q: false,
        c: false
        }
    })
    let distances = curvesFlattened.map((p, i, a) => {
        if(i === a.length-1) {
        if(path.closedPath) {
            totalDistance = totalDistance + segmentLength(p, a[0])
        }
        return {
            ...p,
            distance: segmentLength(p, a[0])
        }
        } else {
        totalDistance = totalDistance + segmentLength(p, a[i+1])
        return {
            ...p,
            distance: segmentLength(p, a[i+1])
        }
        }
    })
    path._pointsFlattened = distances
    path.totalDistance = totalDistance
    return path
}

export default flattenPoints