function drawPath(gl, g, canvasScaling, pan) {
  // console.log(g.points);
  gl.beginPath()
  g.points.forEach((p, i, a) => {
    if(i === 0) {
      gl.moveTo(
        (p.x + pan.x) * canvasScaling.x,
        (p.y + pan.y) * canvasScaling.y
      )

    } else {
      drawCurveStep(gl, p, canvasScaling, pan)
    }
    if(i === a.length - 1 && g.closedPath) {
      drawCurveStep(gl, a[0], canvasScaling, pan)
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

function drawCurveStep(gl, p, scaling, pan) {
  if(p.q) {
    gl.quadraticCurveTo(
      (p.q.x + pan.x) * scaling.x,
      (p.q.y + pan.y) * scaling.y,
      (p.x + pan.x) * scaling.x,
      (p.y + pan.y) * scaling.y
      )
  } else if (p.c) {
    gl.bezierCurveTo(
      (p.c[0].x + pan.x) * scaling.x,
      (p.c[0].y + pan.y) * scaling.y,
      (p.c[1].x + pan.x) * scaling.x,
      (p.c[1].y + pan.y) * scaling.y,
      (p.x + pan.x) * scaling.x,
      (p.y + pan.y) * scaling.y
    )
  } else {
    gl.lineTo(
      (p.x + pan.x) * scaling.x,
      (p.y + pan.y) * scaling.y
    )
  }
}

export default drawPath
