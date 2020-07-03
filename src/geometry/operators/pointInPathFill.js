import findIntersection from './findIntersection';
import Bezier from 'bezier-js';

function pointInPathFill(point, path) {
   const line = {
    p1: {
      x: -10000,
      y: point.y
    },
    p2: {
      x: 10000,
      y: point.y
    }
  };
  var intersects = [];
  path.points.forEach(function(p, i, a) {
    if(p.q === true) {
      console.log("quadratic curve");
    } else if (p.c) {
      var curve = new Bezier(
        a[i-1].x,
        a[i-1].y,
        p.c[0].x,
        p.c[0].y,
        p.c[1].x,
        p.c[1].y,
        p.x,
        p.y);
      var curve_intersects = curve.intersects(line);
      curve_intersects.forEach((intersect) => {
        intersects.push(curve.get(intersect).x);
      });
    } else { // STRAIGHT LINE
      var intersect;
      // GOAL IS TO CHECK STRAIGHT LINE intersect
      // IF INTERSECT IS FOUND
      // APPEND INTERSECTION X VALUE TO INTERSECTS array
      if(i === 0) {
        // check for intersection in line from first to last path point
        // check if path is already closed, findIntersection returns nan when
        // a line is input where both points are equal
        if(p.x  !== a[a.length-1].x || p.y  !== a[a.length-1].y) {
          intersect = findIntersection([
            {x: p.x, y: p.y},
            {x: a[a.length-1].x, y: a[a.length-1].y},
            {x: -1000, y: point.y},
            {x: 1000, y:point.y}
          ]);
          // check if findIntersection didnt return an error
          if(isNaN(intersect.x)) {
            return false;
          } else {
            if(betweenAB(intersect.x, p.x, a[a.length-1].x)) {
              if(betweenAB(intersect.y, p.y, a[a.length-1].y)) {
                intersects.push(intersect.x);
              }

            }
          }
        }
      } else if( i < a.length && i > 0) {
        // check for midline intersections
        intersect = findIntersection([
          {x: p.x, y: p.y},
          {x:a[i-1].x, y:a[i-1].y},
          {x: -1000, y: point.y},
          {x:1000, y: point.y}
        ]);
        if(isNaN(intersect.x)) {
        } else {
          if(betweenAB(intersect.x, p.x, a[i-1].x)) {
            if(betweenAB(intersect.y, p.y, a[i-1].y)) {
              intersects.push(intersect.x);
            }
          }
        }
      }

    }
  })
  intersects.sort((a, b) => {
    return a - b;
  });
  // TODO: fix rounding errors!!!
  if(intersects.length === 1 && intersects[0] !== 0) {
    // console.log(`intersects ${intersects.length}`);
    return false;
  }
  if(intersects.length > 0) {
    // console.log(`intersects ${intersects.length}`);
    for(var i = 0; i < intersects.length; i+= 2) {
      if(point.x > intersects[i] && point.x < intersects[i+1]) {
        return true;
      }
    }
  }
  return false;

}
function betweenAB(value, a, b) {
  var values = [(a), (b)];
  values.sort((a, b) => {
    return a - b;
  });
  // check if is between
  if((value) >= values[0] && (value) <= values[1]) {
    return true;
  } else if((value) === values[0] || (value) === values[1]) {
    return true;
  } else {
    return false;
  }
}
export default pointInPathFill;
