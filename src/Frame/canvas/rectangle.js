function drawRectangle(gl, g, canvasScaling) {
  gl.beginPath()
  gl.globalAlpha = g._strokeOpacity * g._opacity
  gl.shadowOffsetX = g._shadowOffsetX
  gl.shadowOffsetY = g._shadowOffsetY
  gl.shadowColor = g._shadowColor
  gl.shadowBlur = g._shadowBlur
  gl.strokeStyle = g._stroke
  gl.lineWidth = g._strokeWidth * canvasScaling.x
  gl.rect(
    g.p1.x * canvasScaling.x,
    g.p1.y * canvasScaling.y,
    g.width() * canvasScaling.x,
    g.height() * canvasScaling.y
  )
  gl.stroke()
  gl.globalAlpha = g._fillOpacity * g._opacity
  gl.fillStyle = g._fill
  gl.fill()
  gl.closePath()
}

export default drawRectangle
