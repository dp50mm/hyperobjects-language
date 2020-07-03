
function rotatePoints(points, rotation, anchor) {
  if(points) {
    points.forEach((point) => {
      // clone the point because rotate x and y depend on the same
      const rotated_p = rotate(point)
      point.x = rotated_p.x
      point.y = rotated_p.y
      if(point.c) {
        const c_one = rotate(point.c[0])
        point.c[0].x = c_one.x
        point.c[0].y = c_one.y
        const c_two = rotate(point.c[1])
        point.c[1].x = c_two.x
        point.c[1].y = c_two.y
      }
      if(point.q) {
        const q = rotate(point.q)
        point.q.x = q.x
        point.q.y = q.y
      }
    })
  }
  function rotate(p) {
    return {
      x: ((p.x - anchor.x) * Math.cos(rotation) - (p.y - anchor.y) * Math.sin(rotation)) + anchor.x,
      y: ((p.x - anchor.x) * Math.sin(rotation) + (p.y - anchor.y) * Math.cos(rotation)) + anchor.y
    }
  }
}


export function rotatePointsMap(points, rotation, center) {
  if(points) {
    return points.map((point) => {
      if(point.c) {
        return {...point,
          x: x_rotate(point),
          y: y_rotate(point),
          c: point.c.map((c) => {
            return {...c,
              x: x_rotate(c),
              y: y_rotate(c)
            }
          })
        }
      } else {
        return {...point,
          x: x_rotate(point),
          y: y_rotate(point)
        }
      }
    })
  } else {
    return [];
  }
  function x_rotate(p) {
    return ((p.x - center.x) * Math.cos(rotation) - (p.y - center.y) * Math.sin(rotation)) + center.x;
  }
  function y_rotate(p) {
    return ((p.x - center.x) * Math.sin(rotation) + (p.y - center.y) * Math.cos(rotation)) + center.y;
  }
}



export default rotatePoints;
