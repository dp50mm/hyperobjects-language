import { canvasScaling } from '../CanvasView'

function drawText(gl, g, transformMatrix) {
  gl.font = `${g._fontWeight} ${g._fontSize * transformMatrix.scaleX}px Europa`
  gl.fillStyle = g._fill
  gl.globalAlpha = g._fillOpacity * g._opacity
  gl.textAlign = g._textAnchor
  gl.textBaseline = g._alignmentBaseline
  gl.shadowColor = g._shadowColor
  gl.shadowBlur = g._shadowBlur
  gl.shadowOffsetX = g._shadowOffsetX
  gl.shadowOffsetY = g._shadowOffsetY
  if(g.multiLine) {
    g.text.forEach((t, i) => {
      gl.fillText(
        t,
        (g.x * canvasScaling.x * transformMatrix.scaleX) + transformMatrix.translateX * canvasScaling.x,
        (g.y * canvasScaling.y * transformMatrix.scaleY) + transformMatrix.translateY * canvasScaling.y
        )
    })
  } else {
    gl.fillText(
      g.text,
      (g.x * canvasScaling.x * transformMatrix.scaleX) + transformMatrix.translateX * canvasScaling.x,
      (g.y * canvasScaling.y * transformMatrix.scaleY) + transformMatrix.translateY * canvasScaling.y
      )
  }

}

export default drawText
