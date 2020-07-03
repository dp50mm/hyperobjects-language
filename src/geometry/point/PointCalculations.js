import distance from '../operators/distance'
import Point from '../Point'

function PointCalculations() {
  /**
   * Return the distance between this and provided point
   * @param  {[type]} p [{x: y: } point]
   * @return {[type]}   [distance]
   */
  this.distance = function(p) {
    return distance(this, p)
  }

  this.cross = function(p) {
    return this.x * p.y - this.y * p.x
  }

  this.dot = function(p) {
    return this.x * p.x + this.y * p.y
  }

  this.getLength = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  // return angle between the two points
  this.getAngle = function(_p) {
    const p1 = this
    // if no point is provided return angle between this and the origin [0,0]
    const p2 = _p ? _p : new Point({x: 0, y: 0})
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    let atan2 = Math.atan2(dx, dy)
    return atan2
  }
  this.getDirectedAngle = function(_p) {
    return 0
  }
}

export default PointCalculations
