import Bezier from 'bezier-js'

function interpolate(p1, p2, _degree) {
  if(p2.c) {
    var cubicCurve = new Bezier(
      p1.x,
      p1.y,
      p2.c[0].x,
      p2.c[0].y,
      p2.c[1].x,
      p2.c[1].y,
      p2.x,
      p2.y
    )
    return cubicCurve.get(_degree)
  } else if(p2.q) {
    var quadraticCurve = new Bezier(
      p1.x,
      p1.y,
      p2.q.x,
      p2.q.y,
      p2.x,
      p2.y
    )
    return quadraticCurve.get(_degree)
  }
  return {
    x: p1.x - (p1.x - p2.x) * _degree,
    y: p1.y - (p1.y - p2.y) * _degree
  }
}

export default interpolate
