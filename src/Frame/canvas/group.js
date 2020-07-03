function drawGroup(gl, g, canvasScaling) {
  g.points.forEach((p, i) => {
    let radius = 15;

    if(g._r) {
      radius = g._r
    }
    if(p._r) {
      radius = p._r;
    }
    gl.beginPath()
    gl.fillStyle = g.controls.fill
    if(g._fill) {
      gl.fillStyle = g._fill
    }
    gl.globalAlpha = 0.5
    gl.arc(
      p.x * canvasScaling.x,
      p.y * canvasScaling.y,
      radius * canvasScaling.x,
      0, Math.PI * 2)
    gl.globalAlpha = g._fillOpacity * g._opacity
    gl.fill()
    gl.globalAlpha = g._strokeOpacity * g._opacity
    gl.strokeStyle = g.controls.stroke
    if(g._stroke) {
      gl.strokeStyle = g._stroke
    }
    gl.lineWidth = g._strokeWidth * canvasScaling.x
    gl.lineCap = g._strokeLinecap
    gl.stroke()
    gl.closePath()
  })
}

export default drawGroup
