import translatePoints from './operators/translatePoints';
import scalePoints from './operators/scalePoints';
import rotatePoints from './operators/rotatePoints';

function Transforms() {
  this.translate = function(translation) {
    translatePoints(this.points, translation);
    return this;
  }
  this.scale = function(scaling, anchor) {
    if(anchor) {
      translatePoints(this.points, {
        x: -anchor.x,
        y: -anchor.y
      })
    }
    if(isNaN(scaling)) {
      scalePoints(this.points, scaling);
    } else {
      scalePoints(this.points, {x: scaling, y: scaling});
    }
    if(anchor) {
      translatePoints(this.points, anchor);
    }
    return this;
  }
  this.rotate = function(rotation, rotation_point) {
    if(!rotation_point) {
      rotatePoints(this.points, rotation, {x: 0, y: 0});
    } else {
      rotatePoints(this.points, rotation, rotation_point);
    }
    return this;
  }
}

export default Transforms;
