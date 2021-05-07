import { canvasScaling } from '../CanvasView'
import _ from "lodash"

function drawText(gl, g, transformMatrix) {
  gl.font = `${g._fontWeight} ${g._fontSize * transformMatrix.scaleX}px ${_.get(g, "_fontFamily", "Europa")}`
  gl.fillStyle = g._fill
  gl.globalAlpha = g._fillOpacity * g._opacity
  gl.textAlign = g._textAnchor
  gl.textBaseline = g._alignmentBaseline
  gl.shadowColor = g._shadowColor
  gl.shadowBlur = g._shadowBlur
  gl.shadowOffsetX = g._shadowOffsetX
  gl.shadowOffsetY = g._shadowOffsetY
  const textPosition = {
    x: (g.x * canvasScaling.x * transformMatrix.scaleX) + transformMatrix.translateX * canvasScaling.x,
    y: (g.y * canvasScaling.y * transformMatrix.scaleY) + transformMatrix.translateY * canvasScaling.y
  }
  if(g._rotation === 0) {
    if(g.multiLine) {
      g.text.forEach((t, i) => {
        gl.fillText(
          t,
          textPosition.x,
          textPosition.y
          )
      })
    } else {
      gl.fillText(
        g.text,
        textPosition.x,
        textPosition.y
        )
    }
  } else {
    if(!g.multiLine) {
      gl.save()
      gl.translate(textPosition.x, textPosition.y)
      gl.rotate(g._rotation)
      gl.fillText(
        g.text,
        0,
        0
        )
      gl.restore()
    }
    
    
  }
  

}

export default drawText
