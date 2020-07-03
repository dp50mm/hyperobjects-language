import findIntersection from './findIntersection'

function getSlope(line) {
  let dx = line[1].x - line[0].x
  let dy = line[1].y - line[0].y
  return Math.atan2(dy, dx)
}
function getIntersect(l1, l2) {
  let slope1 = getSlope(l1)
  let slope2 = getSlope(l2)
  if(slope1 === slope2) {
    return false
  }
  let intersect = checkLineIntersection(
    l1[0].x,
    l1[0].y,
    l1[1].x,
    l1[1].y,
    l2[0].x,
    l2[0].y,
    l2[1].x,
    l2[1].y,
  );
  if(intersect.onLine1) {
    return intersect
  } else if(intersect.onLine2) {
    return intersect
  }
  return false
}

function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
/*
        // it is worth noting that this should be the same as:
        x = line2StartX + (b * (line2EndX - line2StartX));
        y = line2StartX + (b * (line2EndY - line2StartY));
        */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
};

function selfIntersects(path) {
  let intersects = []
  /**
   * Loop through all points of the path
   * Get the next edge and assign it to p1, p2
   *
   * Loop through all points for each point
   */
  path.points.forEach((p, i, a) => {
    let p1 = p
    let p2 = false
    if(i === a.length -1) {
      if(path.closedPath) {
        console.log(path);
        p2 = a[0]
      }
    } else {
      p2 = a[i+1]
    }
    if(p1 && p2) {
      /**
       * IMPLEMENT IF STATEMENT PER POINT TYPE
       */
      path.points.forEach((_p, _i, _a) => {
        if(true) {
          let _p1 = _p
          let _p2 = false
          if(_i === _a.length -1) {
            if(path.closedPath) {
              _p2 = _a[0]
            }
          } else {
            _p2 = _a[i+1]
          }
          if(_p1 && _p2) {
            // let intersect = getIntersect([p1, p2], [_p1, _p2])
            let intersect = checkLineIntersection(p1.x, p1.y, p2.x, p2.y, _p1.x, _p1.y, _p2.x, _p2.y)
            if(!pointsAreTheSame(intersect, p1)
            && !pointsAreTheSame(intersect, p2)
            && !pointsAreTheSame(intersect, _p1)
            && !pointsAreTheSame(intersect, _p2)) {
              if(intersect.onLine1) {
                intersects.push(intersect)
              } else if(intersect.onLine2) {
                intersects.push(intersect)
              }
            }
          }
        }
      })
    }
  })
  return intersects
}

function pointsAreTheSame(p1, p2) {
  let rounding = 100;
  if(Math.round(p1.x*rounding) === Math.round(p2.x*rounding)
    && Math.round(p1.y*rounding) === Math.round(p2.y)*rounding) {
    return true;
  }
  return false
}

export default selfIntersects
