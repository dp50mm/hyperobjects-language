import translatePoints from '../operators/translatePoints';
import scalePoints from '../operators/scalePoints';
import rotatePoints from '../operators/rotatePoints';

function PointTransforms() {
  this.translate = (translation) => {
    translatePoints([this], translation)
    return this
  }

  this.scale = (scaling, anchor) => {
    // if an anchor point is set first move the point based on that to 'zero'
    if(anchor) {
      translatePoints([this], {
        x: -anchor.x,
        y: -anchor.y
      })
    }
    // scale the point, either based on x and y set on the scaling object
    // when a number is provided scale x and y the same
    if(isNaN(scaling)) {
      scalePoints([this], scaling)
    } else {
      scalePoints([this], {x: scaling, y: scaling})
    }
    // move point back
    if(anchor) {
      translatePoints([this], anchor)
    }
    return this
  }
  this.rotate = (rotation, anchor) => {
    if(!anchor) {
      rotatePoints([this], rotation, {x: 0, y: 0})
    } else {
      rotatePoints([this], rotation, anchor)
    }
    return this
  }
}

export default PointTransforms
