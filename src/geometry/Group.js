import Geometry from './Geometry'
import Point from './Point'
import { GROUP, POINT } from './types'

function Group(points, name) {
  Geometry.call(this, points, name)
  this.type = GROUP
  this.nearest = function(_inputPoint) {
    let points = this.points.slice()
    let inputPoint = _inputPoint.type === POINT ? _inputPoint : new Point(_inputPoint)
    points.sort((a, b) => {
      return inputPoint.distance(a) - inputPoint.distance(b)
    })
    return points[0]
  }
}

export default Group;
