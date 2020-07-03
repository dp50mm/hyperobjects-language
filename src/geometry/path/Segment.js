import Bezier from 'bezier-js'
import Point from '../Point'
import getBounds from './getBounds'
import SegmentIntersections from './segment/SegmentIntersections'
import CurveCalculations from './segment/CurveCalculations'
import SegmentOffset from './segment/SegmentOffset'

import _ from 'lodash'

/**
 * Segment object represents one Path segment
 * It is currently not used in the external library API
 * but it is used as an internal object to calculate intersects
 * and other operations.
 */




export const TYPES = {
  LINEAR: 'LINEAR',
  CUBIC: 'CUBIC',
  QUADRATIC: 'QUADRATIC'
}


function isPoint(p) {
  if(p.type === 'POINT') {
    return true
  }
  return false
}

function Segment(p1, p2) {
  SegmentIntersections.call(this)
  CurveCalculations.call(this)
  SegmentOffset.call(this)
  this.p1 = isPoint(p1) ? p1 : new Point(p1)
  this.p2 = isPoint(p2) ? p2 : new Point(p2)
  this.type = TYPES.LINEAR
  this.bezier = false
  this._lut = false
  this.lut = function() {
    if(this._lut === false) {
      let steps = 1000
      this._lut = _.range(steps).map(val => {
        return this.interpolate(val / steps)
      })
    }
    return this._lut
  }
  this.bounds = getBounds([p1, p2])
  if(p2.c) {
    this.type = TYPES.CUBIC
    this.bezier = new Bezier(
      p1.x,
      p1.y,
      p2.c[0].x,
      p2.c[0].y,
      p2.c[1].x,
      p2.c[1].y,
      p2.x,
      p2.y
    )
  } else if (p2.q) {
    this.type = TYPES.QUADRATIC
    this.bezier = new Bezier(
      p1.x,
      p1.y,
      p2.q.x,
      p2.q.y,
      p2.x,
      p2.y
    )
  } else {

  }


  /**
   * Returns an array of segments for each part of the segment cut by the provided segment
   */
  this.cut = function(path) {
    // calculate the time intervals at which the intersects take place
    const pathSegments = path.segments()
    let times = []
    pathSegments.forEach(segment => {
      const foundTimes = this.intersectionsTimes(segment)
      if(foundTimes.length > 0) {
        foundTimes.forEach(time => {
          times.push(time)
        })
      }
    })
    times.sort((a, b) => a - b)
    // then use subSegment function to create new segments based on times

    if(times.length === 0) {
      return [this]
    } else {
      let allTimes = [0].concat(times).concat([1])
      let segments = []
      allTimes.forEach((time, i, a) => {
        if(i < a.length - 1) {
          let nextTime = a[i+1]
          segments.push(this.subSegment(time, nextTime))
        }
      })
      return segments
    }
    return []
  }

  this.getValues = function(matrix) {
    if(this.type === TYPES.CUBIC) {
      return [
        this.p1.x,
        this.p1.y,
        this.p2.c[0].x,
        this.p2.c[0].y,
        this.p2.c[1].x,
        this.p2.c[1].y,
        this.p2.x,
        this.p2.y
      ]
    } else if (this.type === TYPES.QUADRATIC) {
      return [
        this.p1.x,
        this.p1.y,
        this.p2.q.x,
        this.p2.q.y,
        this.p2.q.x,
        this.p2.q.y,
        this.p2.x,
        this.p2.y
      ]
    } else if (this.type === TYPES.LINEAR) {
      return [
        this.p1.x,
        this.p1.y,
        this.p1.x,
        this.p1.y,
        this.p2.x,
        this.p2.y,
        this.p2.x,
        this.p2.y
      ]
    }
  }

  this.getLength = function() {
    let values = this.getValues()
    if(this.type === TYPES.CUBIC) {
      return this.bezier.length()
    } else if(this.type === TYPES.QUADRATIC) {
      return this.bezier.length()
    } else if(this.type === TYPES.LINEAR) {
      const dx = values[6] - values[0]
      const dy = values[7] - values[1]
      return Math.sqrt(dx * dx + dy * dy)
    }
  }
  this.width = function() {
    return this.p2.x - this.p1.x
  }
  this.height = function() {
    return this.p2.y - this.p1.y
  }
  this.splitAt = function(time) {
    if(this.type === TYPES.CUBIC) {
      return [
        new Segment({x: 0, y: 0}, {x: 0, y: 0}),
        new Segment({x: 0, y: 0}, {x: 0, y: 0})
      ]
    } else if(this.type === TYPES.QUADRATIC) {
      return [
        new Segment({x: 0, y: 0}, {x: 0, y: 0}),
        new Segment({x: 0, y: 0}, {x: 0, y: 0})
      ]
    } else if(this.type === TYPES.LINEAR) {
      return [
        new Segment(
          p1,
          {
            x: this.p1.x + this.width() * time,
            y: this.p1.y + this.height() * time
          }
        ),
        new Segment(
          {
            x: this.p2.x - this.width() * (1 - time),
            y: this.p2.y - this.height() * (1 - time)
          },
          p2
        )
      ]
    }
  }

  // returns a segment at from time_a, time_b
  this.subSegment = function(time_a, time_b) {
    if(this.type === TYPES.CUBIC) {
      let split_bezier = this.bezier.split(time_a, time_b)
      return new Segment(
        split_bezier.points[0],
        {...split_bezier.points[3],
          c: [
            split_bezier.points[1],
            split_bezier.points[2]
          ]
        }
      )
    } else if(this.type === TYPES.QUADRATIC) {
      let split_bezier = this.bezier.split(time_a, time_b)
      return new Segment(
        split_bezier.points[0],
        {
          ...split_bezier.points[2],
          q: split_bezier.points[1]
        }
      )
    } else if(this.type === TYPES.LINEAR) {
      const _rounding = 10000
      return new Segment(
          {
            x: Math.round((this.p1.x + this.width() * time_a) * _rounding)/_rounding,
            y: Math.round((this.p1.y + this.height() * time_a)*_rounding)/_rounding
          },
          {
            x: Math.round((this.p1.x + this.width() * time_b)*_rounding)/_rounding,
            y: Math.round((this.p1.y + this.height() * time_b)*_rounding)/_rounding
          }
        )
    }
  }

  this.interpolate = function(time) {
    if(this.bezier) {
      return this.bezier.get(time)
    } else {
      const p1 = this.p1
      const p2 = this.p2
      return {
        x: p1.x - (p1.x - p2.x) * time,
        y: p1.y - (p1.y - p2.y) * time
      }
    }
  }
  this.angle = function() {
    if(this.bezier) {
      return false
    } else {

    }
  }
  this.angleAt = function(time) {
    if(this.bezier) {
      return this.bezier.derivative(time)
    } else {
      return {
        dx: p1.x / p2.x,
        dy: p1.y / p2.y
      }
    }
  }
  this.extend = function(multiplier) {
    let dx = this.p2.x - this.p1.x
    let dy = this.p2.y - this.p1.y
    if(multiplier > 0) {
      return new Segment(this.p1, {
        x: this.p2.x + dx * multiplier,
        y: this.p2.y + dy * multiplier
      })
    } else {
      return new Segment({
        x: this.p1.x + dx * multiplier,
        y: this.p1.y + dy * multiplier
      }, this.p2)
    }
  }
  this._area = false
  this.getArea = function() {
    if(this._area === false) {
      switch (this.type) {
        case TYPES.LINEAR:
          this._area = 0
          break
        case TYPES.CUBIC:
        case TYPES.QUADRATIC:
          let area = 0
          const lut = this.lut()
          const p1 = lut[0]
          lut.forEach((p, i, a) => {
            if(i < a.length-1) {
              const p2 = p
              const p3 = a[i+1]
              area += 0.5 * ((p1.x - p3.x) * (p2.y - p1.y) - (p1.x - p2.x) * (p3.y - p1.y))
            }
          })
          this._area = area
          break
        default:
          break
      }
    }
    return this._area
  }
  this.nearest = function(inputPoint) {
    switch (this.type) {
      case TYPES.LINEAR:
        const t = (this.bounds.width() + this.bounds.height()) / this.getLength()
        const p = interpolate(this.p1, this.p2,
          Math.max(0, Math.min(1, project(p1, p2, inputPoint)))
          )
        return p
        break
      case TYPES.CUBIC:
      case TYPES.QUADRATIC:
        return this.bezier.project(inputPoint)
        break
      default:
        break
    }
  }
}

function interpolate(p1, p2, t) {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t
  }
}

function project(p1, p2, p3) {
  const x21 = p2.x - p1.x, y21 = p2.y - p1.y;
  const x31 = p3.x - p1.x, y31 = p3.y - p1.y;
  return (x31 * x21 + y31 * y21) / (x21 * x21 + y21 * y21);
}


export default Segment
