import Geometry from './Geometry'
import PathFunctions from './path/PathFunctions'
import PathBooleans from './path/PathBooleans'
import Point from './Point'
import { LINE } from "./types"

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
        const p1 = this.points[0]
        const p2 = this.points[1]
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
}

export default Line