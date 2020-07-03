import { POINT, POINT_TYPES } from './types';
import Matrix from './Matrix'
import _ from 'lodash'


import PointTransforms from './point/PointTransforms'
import PointCalculations from './point/PointCalculations'

let point_id = 0;

function Point(point) {
  point_id += 1;

  PointTransforms.call(this)
  PointCalculations.call(this)

  this.x = _.get(point, 'x', 0);
  this.y = _.get(point, 'y', 0);
  this.z = _.get(point, 'z', 0);
  let q = false; // quadratic control points
  let c = false; // cubic control points
  let a = false; // arc control points

  // Old way of constraining
  // Should be depracated for a rectangle constraint
  // Multiple example models still depend on this so when its removed
  // the example scripts need to be updated
  this.constraints = {
    show: _.get(point, 'constraints.show', false),
    x: {
      min: _.get(point, 'constraints.x.min', false),
      max: _.get(point, 'constraints.x.max', false)
    },
    y: {
      min: _.get(point, 'constraints.y.min', false),
      max: _.get(point, 'constraints.y.max', false)
    },
    z: {
      min: _.get(point, 'constraints.z.min', false),
      max: _.get(point, 'constraints.z.max', false)
    }
  }
  this.constraint = _.get(point, 'constraint', false)



  this.cssClasses = _.get(point, 'cssClasses', [""]);
  this.r = _.get(point, 'r', false)
  this.stroke = _.get(point, 'stroke', false);
  this.strokeWidth = _.get(point, 'strokeWidth', false);
  this.strokeOpacity = _.get(point, 'strokeOpacity', false);
  this.fill = _.get(point, 'fill', false);
  this.attributes = _.get(point, 'attributes', {})
  this.label = _.get(point, 'label', false)

  let angle = _.get(point, 'angle', false);
  let length = _.get(point, 'length', false);
  if(angle && length) {
    this.x += Math.cos(-angle + Math.PI * 0.5) * length
    this.y += Math.sin(-angle + Math.PI * 0.5) * length
  }




  let hasControlPoints = false;
  let connectHandles = [false, false];
  let curve_type = POINT_TYPES.LINEAR;

  if(point.q !== undefined && point.q) {
    q = {...point.q,
      dragging: false
    };
    hasControlPoints = true;
    curve_type = POINT_TYPES.QUADRATIC;
  } else if(point.c !== undefined) {
    c = point.c;
    hasControlPoints = true;
    curve_type = POINT_TYPES.CUBIC;
  } else if(point.a) {
    a = point.a;
    hasControlPoints = true;
    curve_type = POINT_TYPES.ARC;
  }

  this.q = q;
  this.c = c;
  this.a = a;
  this.hasControlPoints = hasControlPoints;
  this.connectHandles = connectHandles
  // Geometry the point is a part of
  this.geometry = false
  this.geometryIndex = false
  this.nextPoint = false
  this.previousPoint = false
  this.type = POINT;
  this.curveType = curve_type
  this.dragging = false;
  this.id = point_id;
  this.type = POINT;
  this.editable = false;
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
  /**
   * Called by the Geometry object when the geometry is extracted
   * to be converted to JSON to prevent circularity.
   */
  this.removeConnections = function() {
    this.geometry = false
    this.geometryIndex = false
    this.nextPoint = false
    this.previousPoint = false
  }
  this.matrixTransform = () => {
    // returns transformed points
    return this.matrix.transformPoint(this)
  }
  this.extract = () => {
    return {
      x: this.x,
      y: this.y,
      z: this.z
    }
  }
  this.getValues = function() {
    if(this.c) {
      return [
        this.x,
        this.y,
        this.c[0].x,
        this.c[0].y,
        this.c[1].x,
        this.c[1].y,
      ]
    } else if(this.q) {
      return [
        this.x,
        this.y,
        this.q.x,
        this.q.y
      ]
    } else {
      return [
        this.x,
        this.y
      ]
    }
  }
  this.copy = () => {
    return new Point(this)
  }

  this.equals = function(p) {
    if(arraysEqual(this.getValues(), p.getValues())) {
      return true
    }
    return false
  }
}


function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

export default Point;
