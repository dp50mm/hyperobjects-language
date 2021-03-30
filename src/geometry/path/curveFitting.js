import Path from "../Path"
import _fitCurve from "./utils/fitCurve"
import _ from "lodash"

function fitCurve(error = 20) {
    const points = this.points.map(p => [p.x, p.y])
    const bezierCurves = _fitCurve(points, error)
    var returnPoints = bezierCurves.map((curve, i, a) => {
        var prevCurve = _.get(a, i - 1, _.last(a))
        var nextCurve = _.get(a, i + 1, a[0])
        return {
            x: curve[0][0],
            y: curve[0][1],
            c: [
                {
                    x: prevCurve[1][0],
                    y: prevCurve[1][1]
                },{
                    x: prevCurve[2][0],
                    y: prevCurve[2][1]
                }
            ]
        }
    })
    var secondLastCurve = _.get(bezierCurves, bezierCurves.length - 2, false)
    var lastCurve = _.last(bezierCurves)
    if(secondLastCurve) {
        returnPoints = returnPoints.concat([
            {   
                x: lastCurve[3][0],
                y: lastCurve[3][1],
                c: [
                    {
                        x: lastCurve[1][0],
                        y: lastCurve[1][1]
                    },{
                        x: lastCurve[2][0],
                        y: lastCurve[2][1]
                    }
                ]
            }
        ])
    } else {
        returnPoints = returnPoints.concat([
            {   
                x: lastCurve[3][0],
                y: lastCurve[3][1],
            }
        ])
    }
    
    return new Path(returnPoints).copyStyle(this)
}

export default fitCurve