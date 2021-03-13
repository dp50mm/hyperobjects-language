import drawGroup from './group'
import drawPath from './path'
import drawText from './text'
import drawRectangle from './rectangle'
import {
  GROUP,
  PATH,
  LINE,
  TEXT,
  RECTANGLE
} from '../../geometry/types';

function drawCanvasGeometry(gl, g, transformMatrix) {
  if(g.type === GROUP) {
    drawGroup(gl, g, transformMatrix)
  } else if (g.type === PATH) {
    drawPath(gl, g, transformMatrix)
  } else if (g.type === LINE) {
    drawPath(gl, g, transformMatrix)
  } else if (g.type === TEXT) {
    drawText(gl, g, transformMatrix)
  } else if (g.type === RECTANGLE) {
    drawRectangle(gl, g, transformMatrix)
  }
}




export default drawCanvasGeometry
