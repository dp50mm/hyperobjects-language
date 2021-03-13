import Geometry from './Geometry'
import PathFunctions from './path/PathFunctions'
import PathBooleans from './path/PathBooleans'
import { PATH } from './types'

import _ from 'lodash'

function Path(points, name, attributes) {
  Geometry.call(this, points, name, attributes)
  PathFunctions.call(this)
  PathBooleans.call(this)

  
  this.type = PATH
  this.closedPath = _.get(attributes, 'closedPath', false)
  this.controlsFillOpacityValue = 0.1
  this.showSegmentLengthLabels = _.get(attributes, 'showSegmentLengthLabels', false)
  this.setShowSegmentLengthLabels = function(showing) {
    this.showSegmentLengthLabels = showing
    return this
  }
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
