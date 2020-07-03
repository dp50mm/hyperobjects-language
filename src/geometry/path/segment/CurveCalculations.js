/**
 * Custom bezier curve functions for faster implementations compared to bezier.js
 */
import {
  TYPES
} from '../Segment'

function CurveCalculations() {
  this.curveCalculations = {
    interpolate: function(time) {
      if(this.type === TYPES.CUBIC) {
        return interpolateCubic(this.p1, this.p2, this.c, time)
      } else if (this.type === TYPES.QUADRATIC) {
        return interpolateQuadratic(this.p1, this.p2, this.q, time)
      } else if (this.type === TYPES.LINEAR) {
        return this.interpolate(time)
      }
      return {
        x: 0,
        y: 0
      }
    }
  }
}


function interpolateQuadratic(p1, p2, q, time) {

}

function interpolateCubic(p1, p2, c, time) {

}

export default CurveCalculations
