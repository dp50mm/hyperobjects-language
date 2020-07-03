function drawText(gl, g, canvasScaling) {
  gl.font = `${g._fontWeight} ${g._fontSize * canvasScaling.x}px Europa`
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
        g.x * canvasScaling.x ,
        g.y * canvasScaling.y + + g._lineHeight * i * canvasScaling.y)
    })
  } else {
    gl.fillText(
      g.text,
      g.x * canvasScaling.x,
      g.y * canvasScaling.y)
  }

}

export default drawText
