import { canvasScaling } from '../CanvasView'
import text_path from './textPath'

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
  if(g.showSegmentLengthLabels) {
    const segments = g.segments()
    gl.font = "18px Europa";
    gl.textAlign = "center";
    gl.textBaseline = "bottom";
    gl.strokeStyle =  "transparent";
    gl.fillStyle = 'black'
    gl.lineWidth = 0;
    segments.forEach(segment => {
      var points = []
      if(segment.type === "linear") {
        points = points.concat([
          [
            (segment.p1.x * canvasScaling.x * transformMatrix.scaleX) + transformMatrix.translateX * canvasScaling.x,
            (segment.p1.y * canvasScaling.y * transformMatrix.scaleY) + transformMatrix.translateY * canvasScaling.y
          ],
          [
            (segment.p2.x * canvasScaling.x * transformMatrix.scaleX) + transformMatrix.translateX * canvasScaling.x,
            (segment.p2.y * canvasScaling.y * transformMatrix.scaleY) + transformMatrix.translateY * canvasScaling.y
          ]
        ])
      } else {
        segment.lut().filter((lut_p, i) => i % 10 === 0).forEach(lut_p => {
          points = points.concat([
            (lut_p.x  * canvasScaling.x * transformMatrix.scaleX) + transformMatrix.translateX * canvasScaling.x,
            (lut_p.y * canvasScaling.y * transformMatrix.scaleY) + transformMatrix.translateY * canvasScaling.y
          ])
        })
      }
      
      gl.textPath(`${_.round(segment.getLength(), 1)}mm`, points)
    })
      
  }

  gl.globalAlpha = g._strokeOpacity * g._opacity
  gl.shadowOffsetX = g._shadowOffsetX
  gl.shadowOffsetY = g._shadowOffsetY
  gl.shadowColor = g._shadowColor
  gl.shadowOpacity = g._shadowOpacity
  gl.shadowBlur = g._shadowBlur
  gl.strokeStyle = g._stroke
  var strokeWidth = g._strokeWidth
  if(g._scaledStrokeWidth) {
    strokeWidth = strokeWidth / canvasScaling.x * 4
  } else {
    strokeWidth = strokeWidth * transformMatrix.scaleX
  }
  gl.lineWidth = strokeWidth
  gl.lineCap = g._strokeLinecap
  gl.lineJoin = g._strokeLinejoin
  var strokeDasharray = g._strokeDasharray
  if(_.isNumber(strokeDasharray)) strokeDasharray / canvasScaling.x
  if(strokeDasharray === 0) {
    gl.setLineDash([])
  } else {
    gl.setLineDash([strokeDasharray])
  }
  gl.setLineDash([g._strokeDasharray * canvasScaling.x])

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
