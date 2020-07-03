import findIntersection from './findIntersection';
import distance from './distance';

function getOrderedIntersects(path_segment, path) {
  var closed_path = false;
  if(path.points[0].x === path.points[path.points.length-1].x
    && path.points[0].y === path.points[path.points.length-1].y) {
    closed_path = true;
  }
  var intersect_points = [];

  path.points.forEach((p, i, a) => {
    if(i < a.length-1) {
      let intersection_array = [
        {x: path_segment[0].x, y: path_segment[0].y},
        {x: path_segment[1].x, y: path_segment[1].y},
        {x: p.x, y: p.y},
        {x: a[i+1].x, y: a[i+1].y}
      ];
      // ONLY FOR TWO STRAIGHT LINE SEGMENTS!!!!!!!!
      const intersect = findIntersection(intersection_array);
      if(betweenAB(intersect.x, intersection_array[0].x, intersection_array[1].x)) {
        if(betweenAB(intersect.y, intersection_array[0].y, intersection_array[1].y)) {
          if(betweenAB(intersect.x, p.x, a[i+1].x)) {
            if(betweenAB(intersect.y, p.y, a[i+1].y)) {
              intersect_points.push(intersect);
            }
          }
        }
      }
    } else if(closed_path === false) { // LAST ARRAY POINT
      let intersection_array = [
        {x: path_segment[0].x, y: path_segment[0].y},
        {x: path_segment[1].x, y: path_segment[1].y},
        {x: p.x, y: p.y},
        {x: a[0].x, y: a[0].y}
      ];
      // ONLY FOR TWO STRAIGHT LINE SEGMENTS!!!!!!!!
      const intersect = findIntersection(intersection_array);
      if(betweenAB(intersect.x, intersection_array[0].x, intersection_array[1].x)) {
        if(betweenAB(intersect.y, intersection_array[0].y, intersection_array[1].y)) {
          if(betweenAB(intersect.x, p.x, a[0].x)) {
            if(betweenAB(intersect.y, p.y, a[0].y)) {
              intersect_points.push(intersect);
            }
          }
        }
      }
    }

  });
  intersect_points = intersect_points.filter((point) => {
    if(isNaN(point.x)) {
      return false;
    } else if(isNaN(point.y)) {
      return false;
    } else {
      return true;
    }
  });
  // ONLY WORKS FOR STRAIGHT LINES!!!!
  intersect_points.sort((a, b) => {
    return distance(a, path_segment[0]) - distance(b, path_segment[0]);
  });
  return intersect_points;
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
  } else if((value) === values[0] && (value) === values[1]) {
    return true;
  } else {
    return false;
  }
}

export default getOrderedIntersects;
