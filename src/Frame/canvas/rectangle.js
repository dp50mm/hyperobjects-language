function drawRectangle(gl, g, transformMatrix) {
  gl.beginPath()
  gl.globalAlpha = g._strokeOpacity * g._opacity
  gl.shadowOffsetX = g._shadowOffsetX
  gl.shadowOffsetY = g._shadowOffsetY
  gl.shadowColor = g._shadowColor
  gl.shadowBlur = g._shadowBlur
  gl.strokeStyle = g._stroke
  gl.lineWidth = g._strokeWidth * transformMatrix.scaleX
  gl.rect(
    g.p1.x * transformMatrix.scaleX,
    g.p1.y * transformMatrix.scaleY,
    g.width() * transformMatrix.scaleX,
    g.height() * transformMatrix.scaleY
  )
  gl.stroke()
  gl.globalAlpha = g._fillOpacity * g._opacity
  gl.fillStyle = g._fill
  gl.fill()
  gl.closePath()
}

export default drawRectangle
