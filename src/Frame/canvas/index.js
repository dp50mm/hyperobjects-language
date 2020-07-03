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

function drawCanvasGeometry(gl, g, canvasScaling) {
  if(g.type === GROUP) {
    drawGroup(gl, g, canvasScaling)
  } else if (g.type === PATH) {
    drawPath(gl, g, canvasScaling)
  } else if (g.type === TEXT) {
    drawText(gl, g, canvasScaling)
  } else if (g.type === RECTANGLE) {
    drawRectangle(gl, g, canvasScaling)
  }
}




export default drawCanvasGeometry
