import Bezier from 'bezier-js';

function segmentLength(p1, p2) {
    if(p2.c) {
      const cubicCurve = new Bezier(
        p1.x,
        p1.y,
        p2.c[0].x,
        p2.c[0].y,
        p2.c[1].x,
        p2.c[1].y,
        p2.x,
        p2.y
      )
      return cubicCurve.length()
    } else if(p2.q) {
      const quadraticCurve = new Bezier(
        p1.x,
        p1.y,
        p2.q.x,
        p2.q.y,
        p2.x,
        p2.y
      )
      return quadraticCurve.length()
    }
    let x = p1.x - p2.x
    let y = p1.y - p2.y
    return Math.sqrt(x * x + y * y);
  }
  
export default segmentLength