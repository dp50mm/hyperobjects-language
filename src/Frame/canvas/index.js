import drawGroup from './group'
import drawPath from './path'
import drawText from './text'
import drawRectangle from './rectangle'
import {
  GROUP,
  PATH,
  TEXT,
  RECTANGLE
} from '../../geometry/types';

function drawCanvasGeometry(gl, g, canvasScaling, pan) {
  if(g.type === GROUP) {
    drawGroup(gl, g, canvasScaling, pan)
  } else if (g.type === PATH) {
    drawPath(gl, g, canvasScaling, pan)
  } else if (g.type === TEXT) {
    drawText(gl, g, canvasScaling, pan)
  } else if (g.type === RECTANGLE) {
    drawRectangle(gl, g, canvasScaling, pan)
  }
}




export default drawCanvasGeometry
