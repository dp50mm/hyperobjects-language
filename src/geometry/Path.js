import Geometry from './Geometry'
import PathFunctions from './path/PathFunctions'
import PathBooleans from './path/PathBooleans'
import { PATH } from './types'

import _ from 'lodash'

function Path(points, name, attributes) {
  Geometry.call(this, points, name, attributes)
  PathFunctions.call(this)
  PathBooleans.call(this)
  /**
   * Connect the points within the geometry to the geometry
   */
  this.points.forEach((p, i, a) => {
    p.geometry = this
    p.geometryIndex = i
    if(a.length > 1) {
      if(i === 0) {
        p.nextPoint = a[i+1]
      } else if(i < a.length - 1) {
        p.previousPoint = a[i-1]
        p.nextPoint = a[i+1]
      } else {
        p.previousPoint = a[i-1]
      }
    }
  })
  
  this.type = PATH
  this.closedPath = _.get(attributes, 'closedPath', false)
  this.controlsFillOpacityValue = 0.1
  this.showSegmentLengthLabels = _.get(attributes, 'showSegmentLengthLabels', false)
  
  this.reduce = function() {
    // console.log('simplify the path by removing segments with length 0');
    return this
  }
  this.closed = function(closed) {
    this.closedPath = closed
    return this
  }
}
Path.type = PATH

export default Path;
