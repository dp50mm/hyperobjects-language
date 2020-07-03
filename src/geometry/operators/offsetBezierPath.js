import Bezier from 'bezier-js';
import Path from '../Path';

function offsetBezierPath(bezier_path, offset, curve_increment=0.02) {
  var offsetPath = [];
  bezier_path.points.forEach((point, i) => {
    if(i === 0) {
    } else {
      let previousPoint = bezier_path.points[i-1]
      if(point.c) {
        const cubicCurve = new Bezier(
          bezier_path.points[i-1].x,
          bezier_path.points[i-1].y,
          bezier_path.points[i].c[0].x,
          bezier_path.points[i].c[0].y,
          bezier_path.points[i].c[1].x,
          bezier_path.points[i].c[1].y,
          point.x,
          point.y
        );
        for(let t = 0; t <= 1; t+=curve_increment) {
          let pt = cubicCurve.get(t);
          let nv = cubicCurve.normal(t);
          offsetPath.push({
            x: pt.x + nv.x*-offset,
            y: pt.y + nv.y*-offset
          });
        }
      } else if(point.q) {
        const quadraticCurve = new Bezier(
          previousPoint.x,
          previousPoint.y,
          point.q.x,
          point.q.y,
          point.x,
          point.y
        );
        for(let t = 0; t <= 1; t+=curve_increment) {
          let pt = quadraticCurve.get(t);
          let nv = quadraticCurve.normal(t);
          offsetPath.push({
            x: pt.x + nv.x*-offset,
            y: pt.y + nv.y*-offset
          });
        }
      } else {
        let p = offsetLinearSegment(previousPoint, point, offset)
        offsetPath.push(p[0])
        offsetPath.push(p[1])
      }
    }

  });
  return new Path(offsetPath)
    .fill(bezier_path.fillColor)
    .fillOpacity(bezier_path.fillOpacityValue)
    .stroke(bezier_path.strokeColor)
    .strokeOpacity(bezier_path.strokeOpacityValue)
    .closed(bezier_path.closedPath);
}

function offsetLinearSegment(p1, p2, offset) {
  let direction = Math.atan2((p1.x - p2.x),(p1.y - p2.y))
  let _p1 = {
    x: p1.x - Math.cos(direction) * offset,
    y: p1.y + Math.sin(direction) * offset
  }
  let _p2 = {
    x: p2.x - Math.cos(direction) * offset,
    y: p2.y + Math.sin(direction) * offset
  }
  return [_p1, _p2]
}


export default offsetBezierPath;
