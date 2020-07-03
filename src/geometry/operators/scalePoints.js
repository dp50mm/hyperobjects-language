function scalePoints(points, scaling) {
  if (points) {
    points.forEach((point) => {
      if (point.c) {
        point.x *= scaling.x
        point.y *= scaling.y
        point.c[0].x *= scaling.x
        point.c[0].y *= scaling.y
        point.c[1].x *= scaling.x
        point.c[1].y *= scaling.y
      } else if (point.q) {
        point.x *= scaling.x
        point.y *= scaling.y
        point.q.x *= scaling.x
        point.q.y *= scaling.y
      } else {
        point.x *= scaling.x
        point.y *= scaling.y
      }
    })
  }
}

export function scalePointsMap(points, scaling) {
  if (points) {
    return points.map((point) => {
      if (point.c) {
        return {...point,
          x: point.x * scaling.x,
          y: point.y * scaling.y,
          c: point.c.map((c) => {
            return {...c,
              x: c.x * scaling.x,
              y: c.y * scaling.y
            }
          })
        }
      } else if (point.q) {
        return {...point,
          x: point.x * scaling.x,
          y: point.y * scaling.y,
          q: {
            x: point.q.x * scaling.x,
            y: point.q.y * scaling.y
          }
        }
      } else {
        return {...point,
          x: point.x * scaling.x,
          y: point.y * scaling.y
        }
      }
    })
  } else {
    return [];
  }

}

export default scalePoints;
