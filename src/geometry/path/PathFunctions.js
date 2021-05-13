import Path from '../Path'
import Point from '../Point'
import Segment from './Segment'
import offsetBezierPath from '../operators/offsetBezierPath'
import smoothPath from "./smoothPath"
import fitCurve from "./curveFitting"
import _ from 'lodash'
import {
  POINT
} from '../types'

/**
 * Support functions for Path items
 */
function PathFunctions() {
  this.reduce = function() {
    // console.log('simplify the path by removing segments with length 0');
    return this
  }
  this.startPoint = function() {
    return this.points[0]
  }

  this.endPoint = function() {
    return this.points[this.points.length - 1]
  }
  this.reverse = function() {
    return new Path(
      _.reverse(this.points).map((p, i, a) => {
        var next_p = false
        var prev_p = false
        if(i === 0) {
          prev_p = a[a.length-1]
        } else {
          prev_p = a[i - 1]
        }
        if(i < a.length - 1) {
          next_p = a[i + i]
        } else {
          next_p = a[0]
        }
        var c = _.get(prev_p, 'c', false)
        if(_.isArray(c)) {
          c = _.reverse(c)
        }
        return {
          x: p.x,
          y: p.y,
          q: _.get(prev_p, 'q', false),
          c: c
        }
      })
    ).copyStyle(this).closed(this.closedPath)
  }

  this.subPoints = function(a, b) {
    return new Path(this.points.filter((p, i) => {
      if(i >= a && i <=b) {
        return true
      }
      return false
    })).closed(false)
  }

  this.offset = function(distance) {
    let offset = offsetBezierPath(this, distance)
    return offset
  }
  
  this._segments = false
  this.segments = function() {
    if(this._segments === false) {
      let segments = []
      this.points.forEach((p, i, a) => {
        if(i < a.length - 1) {
          segments.push(new Segment(p, a[i+1]))
        } else {
          if(this.closedPath) {
            segments.push(new Segment(p, a[0]))
          }
        }
      })
      this._segments = segments
    }
    return this._segments
  }

  this._length = false
  this.getLength = function() {
    return this.segments().reduce((length, segment) => length + segment.getLength(), 0)
  }

  /**
   * [description]
   * @param  {[type]} path [description]
   * @return {[type]}      [description]
   */


  this.getCrossings = function(path) {
    return this.getIntersections(path)
    // return this.getIntersections(path)
  }
  this.getIntersections = function(path) {
    var self = this
    if(self === path) {
      // look for self intersects by looping through each curve section
      // and checking if it intersects with any of the other curve sections
      // on the same path
      return []
    }
    // check for bounds
    // if bounds do not overlap there are no intersects
    // getBounds returns a Rectangle object which has an "overlaps" check
    let bounds_a = self.getBounds()
    let bounds_b = path.getBounds()
    if(bounds_a.overlaps(bounds_b) === false) {
      return []
    }
    let segments_a = self.segments()
    let segments_b = path.segments()
    let intersects = []
    segments_a.forEach(segment_a => {
      segments_b.forEach(segment_b => {
        let segment_intersects = segment_a.intersections(segment_b)
        segment_intersects.forEach(intersect => {
          intersects.push(intersect)
        })
      })
    })
    return intersects
  }
  /**
   * Returns two new paths split at time
   * (i.e. 0.75 is at 3/4th of the length of the of the path for example)
   */
  this.splitAt = function(time) {
    let totalLength = this.getLength()
    let segments = this.segments()
    let splitDistance = totalLength * time + 0.01
    let i = 0
    // find the segment index for provided time
    while (i < segments.length && splitDistance > segments[i].getLength()) {
      splitDistance -= segments[i].getLength()
      i++
    }
    let path1 = new Path()
    let path2 = new Path()
    // loop through segments to build split paths
    segments.forEach((segment, _i) => {
      
      if(_i < i) {
        // add segments below split segment
        path1.addSegment(segment)
      } else if( _i === i) {
        // split segment and add first part to path1 and second path to path2
        let splitSegment = segment.splitAt(splitDistance / segment.getLength())
        path1.addSegment(splitSegment[0])
        path2.addSegment(splitSegment[1])
      } else {
        path2.addSegment(segment)
      }
    })
    return [path1, path2]
  }



  this.subPath = function(_startTime, _endTime) {
    var startTime = _startTime
    var endTime = _endTime
    if(startTime > endTime) {
      startTime = _endTime
      endTime = _startTime
    }
    if(startTime === endTime) {
      return new Path()
    }
    let totalLength = this.getLength()
    let segments = this.segments()
    let splitDistanceStart = totalLength * startTime + 0.01
    let splitDistanceEnd = totalLength * endTime + 0.01
    let start_i = 0
    let end_i = 0
    while(start_i < segments.length && splitDistanceStart > segments[start_i].getLength()) {
      splitDistanceStart -= segments[start_i].getLength()
      start_i ++
    }
    while(end_i < segments.length && splitDistanceEnd > segments[end_i].getLength()) {
      splitDistanceEnd -= segments[end_i].getLength()
      end_i ++
    }
    let subPath = new Path()
    if(start_i === end_i) {
      let segment = segments[start_i]
      segment = segment.subSegment(
        splitDistanceStart/segment.getLength(),
        splitDistanceEnd/segment.getLength()
      )
      subPath.addSegment(segment)
    } else {
      segments.forEach((segment, segment_i) => {
        if(segment_i === start_i) {
          let splitSegment = segment.subSegment(splitDistanceStart / segment.getLength(), 1)
          subPath.addSegment(splitSegment)
        } else if(segment_i > start_i && segment_i < end_i) {
          subPath.addSegment(segment)
        } else if(segment_i === end_i) {
          let splitSegment = segment.subSegment(0, splitDistanceEnd/segment.getLength())
          subPath.addSegment(splitSegment)
        }
      })
    }
    

    return subPath

  }

  this.addSegment = function(segment) {
    if(this.points.length === 0) {
      this.points.push(segment.p1)
      this.points.push(segment.p2)
    } else {
      let last_point = this.points[this.points.length-1]
      if(!last_point.equals(segment.p1) && segment.type !== "LINEAR") {
        this.points.push(segment.p1)
      }
      this.points.push(segment.p2)
    }

  }

  /**
   * Function returns true if the path is clockwise.
   * Retruns false if the path is counter clockwise
   */
  this.isClockwise = function() {
    return this.getArea() >= 0;
  }

  /**
   * Returns the area covered by the path
   */
  this.getArea = function() {
    // calculate the area of triangles for all points in the path from the starting point
    // Then calculate the curve areas and add that to the total sum.
    var area = this._area
    if(area === null) {
      area = 0
      let segments = this.segments()
      let firstPoint = this.points[0]
      segments.forEach((segment, i, a) => {
        const p1 = firstPoint
        const p2 = segment.p1
        const p3 = segment.p2
        area += 0.5 * ((p1.x - p3.x) * (p2.y - p1.y) - (p1.x - p2.x) * (p3.y - p1.y))
        const segmentArea = segment.getArea()
        area += segmentArea
      })
      this._area = area
    }
    return this._area
  }
  this._area = null


  /**
   * Checks if point lays inside the path by raycasting.
   */
  this.contains = function(p) {
    if(!_.isNumber(p.x) || !_.isNumber(p.y)) {
      return false
    }
    const bounds = this.getBounds()
    // if the point does not fall in the bounds of the path no need for raycasting
    if(bounds.containsPoint(p) === false) {
      return false
    }
    if(this.closedPath === false) {
      return false
    }
    const RAYCAST_EXTENT = 100000
    let horizontalLine = new Path([
      {
        x: -RAYCAST_EXTENT,
        y: p.y
      },
      {
        x: RAYCAST_EXTENT,
        y: p.y
      }
    ])
    let horizontalIntersects = this.getIntersections(horizontalLine)
    horizontalIntersects.push({
      x: -RAYCAST_EXTENT,
      y: p.y
    })
    horizontalIntersects.push({
      x: RAYCAST_EXTENT,
      y: p.y
    })
    horizontalIntersects = _.sortBy(horizontalIntersects, 'x')
    let toggle = false
    for(var i = 0; i + 1 < horizontalIntersects.length; i += 1) {
      let p1 = horizontalIntersects[i]
      let p2 = horizontalIntersects[i + 1]
      if(toggle) {
        if(p.x >= p1.x && p.x <= p2.x) {
          return true
        }
        toggle = false
      } else {
        toggle = true
      }
    }
    return false
  }

  this.angleAt = function(time) {
    let degree = time *0.99999999 // round it down super slightly so that exactly 1 stays on the last point
    if(this.points.length > 1) {
      let p1 = this.points[0]
      let p2 = this.points[1]
      if(this._pointsFlattened === false) {
        this.flattenPoints()
      }
      // this.flattenPoints()
      let interpolationDistance = this.totalDistance * degree
      let index = 0;
      if(interpolationDistance - this._pointsFlattened[index].distance < 0) {
        index = 0;
      } else {
        while(interpolationDistance - this._pointsFlattened[index].distance > 0) {
          interpolationDistance -= this._pointsFlattened[index].distance
          index++
          if(this.closedPath) {
            if(index > this._pointsFlattened.length-1) {
              index = 0
            }
          } else {
            if(index > this._pointsFlattened.length-2) {
              index = 0
            }
          }

        }
      }
      let time = interpolationDistance/this._pointsFlattened[index].distance
      p1 = this._pointsFlattened[index]
      if(index === this._pointsFlattened.length - 1) {
        p2 = this._pointsFlattened[0]
      } else {
        p2 = this._pointsFlattened[index + 1]
      }
      return angle(p1, p2)
    } else {
      return false
    }
  }
  this.nearest = function(_inputPoint) {
    const inputPoint = _inputPoint.type === POINT ? _inputPoint : new Point(_inputPoint)
    let segments = this.segments()
    if(segments.length === 1) {
      return segments[0].nearest(inputPoint)
    } else if(segments.length > 1) {
      let segmentNearestPoints = segments.map(segment => {
        return segment.nearest(inputPoint)
      })
      segmentNearestPoints.sort((a, b) => {
        return inputPoint.distance(a) - inputPoint.distance(b)
      })
      return segmentNearestPoints[0]
    } else {
      return this.points[0]
    }

  }
  this.smoothPath = smoothPath

  this.fitCurve = fitCurve
}

function angle(p1, p2) {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  return Math.atan2(dy, dx)
}

export default PathFunctions
