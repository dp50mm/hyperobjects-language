import Point from './Point'
import Styling from './Styling';
import _ from 'lodash'
import {
  RECTANGLE
} from './types'
/**
 * A specific rectangle function.
 * It differs from the rectangle shape function which is actually a path.
 * This function is used internally for example for defining a
 * bounding box from a point group or path.
 */
function Rectangle(p1, p2, attributes) {
  Styling.call(this, attributes);
  this.fillOpacity(0)
  this.p1 = new Point(p1)
  this.p2 = new Point(p2)
  this.p3 = new Point({
      x: p1.x,
      y: p2.y
    })
  this.p4 = new Point({
      x: p2.x,
      y: p1.y
  })
  this.type = RECTANGLE
  this.width = function() {
    return Math.abs(p2.x - p1.x)
  }
  this.height = function() {
    return Math.abs(p2.y - p1.y)
  }
  this.containsPoint = function(p) {
    if(_.inRange(p.x, this.p1.x, this.p2.x) && _.inRange(p.y, this.p1.y, this.p2.y)) {
      return true
    } else if(p.x.toFixed(3) == this.p1.x && _.inRange(p.y, this.p1.y, this.p2.y)) {
      return true
    } else if(p.x.toFixed(3) == this.p2.x && _.inRange(p.y, this.p1.y, this.p2.y)) {
      return true
    }
    return false
  }
  this.edges = function() {
    // returns the outline as polygon
  }
  this.containsRectangle = function(rect) {
    if(  this.containsPoint(rect.p1)
      && this.containsPoint(rect.p2)
      && this.containsPoint(rect.p3)
      && this.containsPoint(rect.p4) ) {
        return true
    }
    return false
  }
  this.overlaps = function(rect) {
    if(this.containsPoint(rect.p1)) {
      return true
    }
    if(this.containsPoint(rect.p2)) {
      return true
    }
    if(this.containsPoint(rect.p3)) {
      return true
    }
    if(this.containsPoint(rect.p4)) {
      return true
    }


    if(rect.containsPoint(this.p1)) {
      return true
    }
    if(rect.containsPoint(this.p2)) {
      return true
    }
    if(rect.containsPoint(this.p3)) {
      return true
    }
    if(rect.containsPoint(this.p4)) {
      return true
    }
    if("edges intersect " === true) {

    }
    //
    // when the rectangles completely overlap the points are not contained
    // only the lines could be intersecting
    // so check if lines intersect

    // check p1 horizontal line
    if(this.p1.x <= rect.p1.x
        && this.p2.x >= rect.p2.x
        && this.p1.y >= rect.p1.y
        && this.p1.y <= rect.p2.y
      ) {
      return true
    }
    // check p2 horizontal line
    if(this.p1.x <= rect.p1.x
        && this.p2.x >= rect.p2.x
        && this.p2.y >= rect.p1.y
        && this.p2.y <= rect.p2.y
      ) {
      return true
    }

    // check p1 vertical line
    if(this.p1.y <= rect.p1.y
        && this.p2.y >= rect.p2.y
        && this.p1.x >= rect.p1.x
        && this.p1.x <= rect.p2.x
      ) {
      return true
    }
    // check p2 vertical line
    if(this.p1.y <= rect.p1.y
        && this.p2.y >= rect.p2.y
        && this.p2.x >= rect.p1.x
        && this.p2.x <= rect.p2.x
      ) {
      return true
    }
    return false
  }
}

export default Rectangle
