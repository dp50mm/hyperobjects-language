import * as d3 from 'd3'

function generatePath(points, closePath) {
  var path = d3.path()
  if(points.length === 0) {
    return path.toString()
  }
  var p1 = points[0]

  points.forEach((p, i, a) => {
    if(i === 0) {
      // First point
      path.moveTo(p.x, p.y)
    } else {
      if(p.curveType === 'POINT_TYPE_QUADRATIC') {
        path.quadraticCurveTo(p.q.x, p.q.y, p.x, p.y)
      } else if(p.curveType === 'POINT_TYPE_CUBIC') {
        path.bezierCurveTo(p.c[0].x, p.c[0].y, p.c[1].x, p.c[1].y, p.x, p.y)
      } else {
        path.lineTo(p.x, p.y)
      }
      
      if(i === a.length - 1 && closePath) {
        // Last point, check if p1 has curve points applied
        // then draw a curve to that point

        if(p1.curveType === "POINT_TYPE_QUADRATIC") {
          path.quadraticCurveTo(p1.q.x, p1.q.y, p1.x, p1.y)
        } else if(p1.curveType === "POINT_TYPE_CUBIC") {
          path.bezierCurveTo(p1.c[0].x, p1.c[0].y, p1.c[1].x, p1.c[1].y, p1.x, p1.y)
        }
        path.closePath()
      }
    }
  })
  return path.toString()
};

export default generatePath;
