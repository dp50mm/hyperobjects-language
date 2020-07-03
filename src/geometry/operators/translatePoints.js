function translatePoints(points, translation) {
  if(points) {
    return points.forEach((point) => {
        if(point.c) {
          point.x += translation.x
          point.y += translation.y
          point.c[0].x += translation.x
          point.c[0].y += translation.y
          point.c[1].x += translation.x
          point.c[1].y += translation.y
        } else if(point.q) {
          point.x += translation.x
          point.y += translation.y
          point.q.x += translation.x
          point.q.y += translation.y
        } else {
          point.x += translation.x
          point.y += translation.y
        }
      })
  }
}

export function translatePointsMap(points, translation) {
  if(points) {
    return points.map((point) => {
        if(point.c) {
          return {...point,
            x: point.x + translation.x,
            y: point.y + translation.y,
            q: {
              x: point.q.x + translation.x,
              y: point.q.y + translation.y
            },
            c: point.c.map((c) => {
              return {...c,
                x: c.x + translation.x,
                y: c.y + translation.y
              }
            })
          }
        } else if(point.q) {
          return {...point,
            x: point.x + translation.x,
            y: point.y + translation.y,
            q: {
              x: point.q.x + translation.x,
              y: point.q.y + translation.y
            }
          }
        } else {
          return {...point,
            x: point.x + translation.x,
            y: point.y + translation.y
          }
        }
      })
  } else {
    return [];
  }
}

export default translatePoints;
