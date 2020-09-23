import { canvasScaling } from '../CanvasView'

function drawPath(gl, g, transformMatrix) {
  // console.log(g.points);
  gl.beginPath()
  g.points.forEach((p, i, a) => {
    if(i === 0) {
      gl.moveTo(
        (p.x * canvasScaling.x * transformMatrix.scaleX) + transformMatrix.translateX * canvasScaling.x,
        (p.y * canvasScaling.y * transformMatrix.scaleY) + transformMatrix.translateY * canvasScaling.y
      )

    } else {
      drawCurveStep(gl, p, transformMatrix)
    }
    if(i === a.length - 1 && g.closedPath) {
      drawCurveStep(gl, a[0], transformMatrix)
    }
  })

  gl.globalAlpha = g._strokeOpacity * g._opacity
  gl.shadowOffsetX = g._shadowOffsetX
  gl.shadowOffsetY = g._shadowOffsetY
  gl.shadowColor = g._shadowColor
  gl.shadowOpacity = g._shadowOpacity
  gl.shadowBlur = g._shadowBlur
  gl.strokeStyle = g._stroke
  gl.lineWidth = g._strokeWidth * canvasScaling.x
  gl.lineCap = g._strokeLinecap
  gl.lineJoin = g._strokeLinejoin
  // console.log('line width: ', gl.lineWidth, 'strokestyle: ', gl.strokeStyle, ' globalApha: ', gl.globalAlpha);

  gl.stroke()
  if(g.closedPath) {
    gl.globalAlpha = g._fillOpacity * g._opacity
    gl.fillStyle = g._fill
    gl.fill()
  }
  gl.closePath()
}

function drawCurveStep(gl, p, transformMatrix) {
  if(p.q) {
    gl.quadraticCurveTo(
      (p.q.x * canvasScaling.x * transformMatrix.scaleX) + transformMatrix.translateX * canvasScaling.x,
      (p.q.y * canvasScaling.y * transformMatrix.scaleY) + transformMatrix.translateY * canvasScaling.y,
      (p.x * canvasScaling.x * transformMatrix.scaleX) + transformMatrix.translateX * canvasScaling.x,
      (p.y * canvasScaling.y * transformMatrix.scaleY) + transformMatrix.translateY * canvasScaling.y
      )
  } else if (p.c) {
    gl.bezierCurveTo(
      (p.c[0].x * canvasScaling.x * transformMatrix.scaleX) + transformMatrix.translateX * canvasScaling.x,
      (p.c[0].y * canvasScaling.y * transformMatrix.scaleY) + transformMatrix.translateY * canvasScaling.y,
      (p.c[1].x * canvasScaling.x * transformMatrix.scaleX) + transformMatrix.translateX * canvasScaling.x,
      (p.c[1].y * canvasScaling.y * transformMatrix.scaleY) + transformMatrix.translateY * canvasScaling.y,
      (p.x * canvasScaling.x * transformMatrix.scaleX) + transformMatrix.translateX * canvasScaling.x,
      (p.y * canvasScaling.y * transformMatrix.scaleY) + transformMatrix.translateY * canvasScaling.y
    )
  } else {
    gl.lineTo(
      (p.x * canvasScaling.x * transformMatrix.scaleX + transformMatrix.translateX * canvasScaling.x),
      (p.y * canvasScaling.y * transformMatrix.scaleY + transformMatrix.translateY * canvasScaling.y)
    )
  }
}

export default drawPath
