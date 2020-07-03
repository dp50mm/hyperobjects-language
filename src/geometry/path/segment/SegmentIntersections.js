import findIntersection from '../../operators/findIntersection'
import { TYPES } from '../Segment'
import _ from 'lodash'
// import * as math from 'mathjs'
/**
 * Rounding the intersect for float errors
 */
const rounding = 10000

function SegmentIntersections() {
  /**
   * Get intersections between this segment and provided segment
   * If no segment is provided it should return the self intersections
   */
  this.intersections = function(segment) {
    // if this segment is cubic
    if(this.type === TYPES.CUBIC) {
      // and if provided segment is cubic
      if(segment.type === TYPES.CUBIC) {
        // first check if bounds overlap
        if(this.bounds.overlaps(segment.bounds)) {
          // check if curves overlap
          return []
        }

      } else if (segment.type === TYPES.QUADRATIC) {

      } else if(segment.type === TYPES.LINEAR) {
        return this.bezier.intersects(segment).map(intersect => this.bezier.get(intersect))
      }
    } else if(this.type === TYPES.QUADRATIC) {
      if(segment.type === TYPES.CUBIC) {

      } else if (segment.type === TYPES.QUADRATIC) {

      } else if(segment.type === TYPES.LINEAR) {
        return this.bezier.intersects(segment).map(intersect => this.bezier.get(intersect))
      }
    } else if(this.type === TYPES.LINEAR) {
      if(segment.type === TYPES.CUBIC) {
        return segment.bezier.intersects(this).map(intersect => segment.bezier.get(intersect))
      } else if (segment.type === TYPES.QUADRATIC) {
        return segment.bezier.intersects(this).map(intersect => segment.bezier.get(intersect))
      } else if (segment.type === TYPES.LINEAR) {
        const intersect = findIntersection(
          [this.p1,
          this.p2,
          segment.p1,
          segment.p2]
        )
        intersect.x = Math.round(intersect.x * rounding)/rounding
        intersect.y = Math.round(intersect.y * rounding)/rounding
        if(segment.p1.y === segment.p2.y) {
          intersect.y = segment.p1.y
        }
        if(segment.p1.x === segment.p2.x) {
          intersect.x = segment.p1.x
        }
        if(inRange(intersect.x, this.p1.x, this.p2.x)
          && inRange(intersect.x, segment.p1.x, segment.p2.x)) {
          if(inRange(intersect.y, this.p1.y, this.p2.y)
            && inRange(intersect.y, segment.p1.y, segment.p2.y)) {
            return [intersect]
          }
        }

      }

    }

    return []
  }

  // Returns the time values for the intersects
  this.intersectionsTimes = function(segment) {
    let times = []
    if(this.type === TYPES.CUBIC) {
      ///
      /// THIS CUBIC
      ///
      if (segment.type === TYPES.CUBIC) {
        let intersects = this.bezier.intersects(segment.bezier)
        intersects.forEach(intersect => {
          const intersect_time = parseFloat(intersect.split('/')[0])
          times.push(intersect_time)
        })
      } else if (segment.type === TYPES.QUADRATIC) {
        let intersects = this.bezier.intersects(segment.bezier)
        intersects.forEach(intersect => {
          const intersect_time = parseFloat(intersect.split('/')[0])
          times.push(intersect_time)
        })
      } else if(segment.type === TYPES.LINEAR) {
        let intersectTimes = this.bezier.intersects({
          p1: segment.p1,
          p2: segment.p2
        })
        intersectTimes.forEach(time => {
          times.push(time)
        })
      }
    } else if (this.type === TYPES.QUADRATIC) {
      ///
      /// THIS QUADRATIC
      ///
      if (segment.type === TYPES.CUBIC) {
        let intersects = this.bezier.intersects(segment.bezier)
        intersects.forEach(intersect => {
          const intersect_time = parseFloat(intersect.split('/')[0])
          times.push(intersect_time)
        })
      } else if (segment.type === TYPES.QUADRATIC) {
        let intersects = this.bezier.intersects(segment.bezier)
        intersects.forEach(intersect => {
          const intersect_time = parseFloat(intersect.split('/')[0])
          times.push(intersect_time)
        })
      } else if(segment.type === TYPES.LINEAR) {
        let intersectTimes = this.bezier.intersects({
          p1: segment.p1,
          p2: segment.p2
        })
        intersectTimes.forEach(time => {
          times.push(time)
        })
      }
    } else if (this.type === TYPES.LINEAR) {
      ///
      /// THIS LINEAR
      ///
      if (segment.type === TYPES.CUBIC) {
        let intersectTimes = segment.bezier.intersects(
          {
            p1: this.p1,
            p2: this.p2
          }
        )
        intersectTimes.forEach(q_segment_time => {
          let p = segment.bezier.get(q_segment_time)
          let time = this.p1.distance(p) / this.getLength()
          times.push(time)
        })
      } else if (segment.type === TYPES.QUADRATIC) {
        let intersectTimes = segment.bezier.intersects(
          {
            p1: this.p1,
            p2: this.p2
          }
        )
        intersectTimes.forEach(q_segment_time => {
          let p = segment.bezier.get(q_segment_time)
          let time = this.p1.distance(p) / this.getLength()
          times.push(time)
        })
      } else if(segment.type === TYPES.LINEAR) {
        const intersect = findIntersection(
          [this.p1,
          this.p2,
          segment.p1,
          segment.p2]
        )
        intersect.x = Math.round(intersect.x * rounding)/rounding
        intersect.y = Math.round(intersect.y * rounding)/rounding
        if(segment.p1.y === segment.p2.y) {
          intersect.y = segment.p1.y
        }
        if(segment.p1.x === segment.p2.x) {
          intersect.x = segment.p1.x
        }
        if(inRange(intersect.x, this.p1.x, this.p2.x)
          && inRange(intersect.x, segment.p1.x, segment.p2.x)) {
          if(inRange(intersect.y, this.p1.y, this.p2.y)
            && inRange(intersect.y, segment.p1.y, segment.p2.y)) {
              let time = this.p1.distance(intersect) / this.getLength()
              times.push(time)
          }
        }

      }
    }
    return times
  }
}

const roundingError = 0.0001
function inRange(val, bound_a, bound_b) {
  if(val === bound_a) {
    return true
  }
  if(val === bound_b) {
    return true
  }
  if(_.inRange(val, bound_a - roundingError, bound_b + roundingError)) {
    return true
  }
  return false
}

/**
 * Using Math.js to find intersectionsTimes


 const _intersect = math.intersect(
   [this.p1.x, this.p1.y],
   [this.p2.x, this.p2.y],
   [segment.p1.x, segment.p1.y],
   [segment.p2.x, segment.p2.y]
 )
 if(_intersect !== null) {
   const intersect = {
     x: _intersect[0],
     y: _intersect[1]
   }
   intersect.x = Math.round(intersect.x * rounding)/rounding
   intersect.y = Math.round(intersect.y * rounding)/rounding
   if(segment.p1.y === segment.p2.y) {
     intersect.y = segment.p1.y
   }
   if(segment.p1.x === segment.p2.x) {
     intersect.x = segment.p1.x
   }
   if(inRange(intersect.x, this.p1.x, this.p2.x)
     && inRange(intersect.x, segment.p1.x, segment.p2.x)) {
     if(inRange(intersect.y, this.p1.y, this.p2.y)
       && inRange(intersect.y, segment.p1.y, segment.p2.y)) {
         let time = this.p1.distance(intersect) / this.getLength()
         times.push(time)
     }
   }
 }






 const _intersect = math.intersect(
   [this.p1.x, this.p1.y],
   [this.p2.x, this.p2.y],
   [segment.p1.x, segment.p1.y],
   [segment.p2.x, segment.p2.y]
 )
 if(_intersect !== null) {
   const intersect = {
     x: _intersect[0],
     y: _intersect[1]
   }
   intersect.x = Math.round(intersect.x * rounding)/rounding
   intersect.y = Math.round(intersect.y * rounding)/rounding
   if(segment.p1.y === segment.p2.y) {
     intersect.y = segment.p1.y
   }
   if(segment.p1.x === segment.p2.x) {
     intersect.x = segment.p1.x
   }
   if(inRange(intersect.x, this.p1.x, this.p2.x)
     && inRange(intersect.x, segment.p1.x, segment.p2.x)) {
     if(inRange(intersect.y, this.p1.y, this.p2.y)
       && inRange(intersect.y, segment.p1.y, segment.p2.y)) {
       return [intersect]
     }
   }
 }

 */

export default SegmentIntersections
