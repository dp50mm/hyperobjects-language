import Styling from './Styling';
import Transforms from './Transforms';
import Point from './Point';
import Matrix from './Matrix'
import Path from './Path'
import interpolate from './path/interpolate'
import Group from './Group'
import getBounds from './path/getBounds'
import flattenPoints from './path/flattenPoints'
import segmentLength from './path/segmentLength'
import {
  PATH,
  GROUP
} from './types'
import _ from 'lodash'

var geometry_id = 0;

function Geometry(points, name, attributes) {
  Transforms.call(this);
  Styling.call(this, attributes);
  geometry_id += 1;
  let geometryName = `GEOMETRY-${geometry_id}`;
  if(name !== undefined) {
    geometryName = name;
  }
  this.name = geometryName;
  this.id = geometry_id;
  this.unit = 'px';
  this._export = false;
  this.showBounds = false;
  this.export = function(shouldExport) {
    this._export = shouldExport
    return this
  }
  this.clone = function() {
    return _.cloneDeep(this)
  }
  this.copy = function() {
    if(this.type === PATH) {
      return new Path(this.points)
        .copyStyle(this)
        .closed(this.closedPath)
        .export(this._export)
    }
    if(this.type === GROUP) {
      return new Group(this.points)
        .copyStyle(this)
        .export(this._export)
    }
    return _.clone(this, true)
  }
  this.length = function() {
    return this.points.reduce((acc, p, i, a) => {
      if(i === a.length -1) {
        if(this.closedPath) {
          return acc += segmentLength(p, a[0])
        } else {
          return acc
        }
      } else {
        return acc += segmentLength(p, a[i+1])
      }
    }, 0)
  }
  this.getBounds = function() {
    return getBounds(this.points)
  }
  this.extract = function() {
    let copy = this.clone()
    copy.points.forEach(p => p.removeConnections())
    copy._pointsFlattened = false
    return copy
  }
  this.connectPoints = function() {
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
  }

  this._pointsFlattened = false
  this.flattenPoints = function() {
    flattenPoints(this)
  }

  this.simpleInterpolate = function(_degree) {
    let degree = _degree * 0.99999999
    const length = this.length()
    if(this.points.length > 1) {
      let interpolationDistance = length * degree
      let index = 0
      let nextDistance = segmentLength(this.points[0], this.points[1])

      while (interpolationDistance - nextDistance > 0) {
        interpolationDistance -= nextDistance
        index++
        nextDistance = segmentLength(this.points[index], this.points[index+1])
      }
      return interpolate(this.points[index], this.points[index + 1], interpolationDistance/nextDistance)
    } else if(this.points.length === 1) {
      return this.points[0].copy()
    } else {
      return new Point({x: 0, y: 0})
    }
  }
  this.interpolate = function(_degree) {
    let degree = _degree *0.99999999 // round it down super slightly so that exactly 1 stays on the last point
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
      let calculatedDegree = interpolationDistance/this._pointsFlattened[index].distance
      p1 = this._pointsFlattened[index]
      if(index === this._pointsFlattened.length - 1) {
        p2 = this._pointsFlattened[0]
      } else {
        p2 = this._pointsFlattened[index + 1]
      }
      return interpolate(p1, p2, calculatedDegree)
    } else if(this.points.length === 1) {
      return this.points[0]
    } else {
      return new Point({x: 0, y: 0})
    }
  }
  if(points !== undefined) {
    this.points = points.map((point) => {
      return new Point(point);
    })
    this.connectPoints()
  } else {
    this.points = []
  }
  this.center = function() {
    if(this.points.length > 1) {
      let center = {
        x: 0,
        y: 0,
        z: 0,
        count: 0
      }
      this.points.forEach((p) => {
        center.x += p.x
        center.y += p.y
        center.z += p.z
        center.count += 1
        if(p.c) {
          p.c.forEach(c_p => {
            center.x += c_p.x
            center.y += c_p.y
            center.count += 1
          })
        } else if(p.q) {
          center.x += p.q.x
          center.y += p.q.y
          center.count += 1
        }
      })
      center.x = center.x / center.count
      center.y = center.y / center.count
      center.z = center.z / center.count
      return new Point(center)
    } else {
      return this.points[0]
    }
  }
  this.matrix = false

  this.addMatrix = (a, b, c, d, tx, ty) => {
    let _a = _.get(a, 'a', false)
    if(_a) {
      let _b = _.get(a, 'b', 0)
      let _c = _.get(a, 'c', 0)
      let _d = _.get(a, 'd', 0)
      let _tx = _.get(a, 'tx', 0)
      let _ty = _.get(a, 'ty', 0)
      this.matrix = new Matrix(_a, _b, _c, _d, _tx, _ty)
      return this
    } else {
      this.matrix = new Matrix(a, b, c, d, tx, ty)
      return this
    }


  }
  this.matrixTransform = () => {
    // returns transformed points
    this.points = this.points.map((p) => {
      return this.matrix.transformPoint(p)
    })
    return this
  }

  this.isEqual = (g) => {
    return this.points.every((p, i) => {
      return p.equals(g.points[i])
    })
  }

  this.addPoint = (p) => {
    this.points.forEach(p => p.selected = false)
    this.points.push(new Point(p))
  }
}




export default Geometry;
