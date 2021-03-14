import Geometry from './Geometry'
import PathFunctions from './path/PathFunctions'
import PathBooleans from './path/PathBooleans'
import Point from './Point'
import { LINE } from "./types"
import _ from "lodash"

function line_intersect(x1, y1, x2, y2, x3, y3, x4, y4)
{
    var ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denom == 0) {
        return null;
    }
    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
    ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
    return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ua * (y2 - y1),
        seg1: ua >= 0 && ua <= 1,
        seg2: ub >= 0 && ub <= 1
    };
}

function Line(points, name, attributes) {
    Geometry.call(this, points, name, attributes)
    PathFunctions.call(this)
    PathBooleans.call(this)
    
    this.type = LINE
    if(this.points.length > 2) {
        this.points = this.points.slice(0, 2)
    }
    this._showExtend = true
    this.showExtend = function(_showExtend) {
        this._showExtend = _showExtend
        return this
    }

    // returns the points for a line within the bounds
    this.extendToBounds = function(bounds) {
        const p1 = _.get(this, "points[0]", false)
        const p2 = _.get(this, "points[1]", false)
        if(!_.every([p1, p2])) {
            return [new Point({x: 0, y: 0}), new Point({x: 0, y: 0})]
        }
        return [
            new Point({x: p1.x - 10000, y: p1.y}).rotate(-p1.getAngle(p2) + Math.PI * 0.5, p1)
            ,new Point({x: p1.x + 10000, y: p1.y}).rotate(-p1.getAngle(p2) + Math.PI * 0.5, p1)
        ]
    }
    this.lineIntersect = function(secondLine) {
        return line_intersect(
            this.points[0].x,
            this.points[0].y,
            this.points[1].x,
            this.points[1].y,
            secondLine.points[0].x,
            secondLine.points[0].y,
            secondLine.points[1].x,
            secondLine.points[1].y,
        )
    }
    this.angleToLine = function(secondLine) {
        if(this.points.length !== 2) {
            return 0
        }
        if(secondLine.points.length !== 2) {
            return 0
        }
        const A1x = this.points[0].x
        const A1y = this.points[0].y
        const A2x = this.points[1].x
        const A2y = this.points[1].y
        const B1x = secondLine.points[0].x
        const B1y = secondLine.points[0].y
        const B2x = secondLine.points[1].x
        const B2y = secondLine.points[1].y

        const dAx = A2x - A1x;
        const dAy = A2y - A1y;
        const dBx = B2x - B1x;
        const dBy = B2y - B1y;
        var angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
        if(angle < 0) {angle = angle * -1;}
        return angle
    }
}

export default Line