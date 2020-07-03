import pointInPathFill from './pointInPathFill';
import getOrderedIntersects from './getOrderedIntersects';
import Path from '../Path';
/**
 * cutPath function intersects two bezier paths and returns
 * and array of the resulting intersect paths
 */
function cutPath(path, cut) {
  if (path.points.length < 1) {
    return [];
  }
  // To optimise the function first check if the bound of the
  // path is fully contained within the cut. Then the more
  // expensive bezier/bezier cut does not need to be run.
  // Drastically reduces the computation time when many complex mall shapes
  // are intersected with one large one.
  // return array of total paths
  var return_paths = [];
  // points for the currently being intersected path
  var points = [];
  var first_point_in_path = pointInPathFill(path.points[0], cut);
  if(first_point_in_path !== false) {
    // points.push({...path.points[0]});
  }
  // create bezier out of cut
  path.points.forEach((p, i, a) => {
    if(pointInPathFill(p, cut)) {
      points.push({
        x: p.x,
        y: p.y
      });
    } else {
      if(points.length > 0) {
        return_paths.push(new Path(points));
      }
      points = [];
    }
    if(i < a.length-1) {
      // in each increment check the following
      // does the point lay in the cout
      // does the next line segment intersect with the cut
      // how many times does it intersect?
      // loop through the intersections
      // ending the path, adding it to the return path
      // and starting a new path
      var ordered_intersects = getOrderedIntersects([p, a[i+1]], cut);
      ordered_intersects.forEach((intersect_point) => {
        points.push(intersect_point);
        if(points.length > 0) {
          // return_paths.push(newPath("cut-path", points));
          // points = [];
        }

      });
      if(p.q === true) {

      } else if (p.c) {

      } else if(i === a.length-1) {
        ordered_intersects = getOrderedIntersects([p, a[0]], cut);
        ordered_intersects.forEach((intersect_point) => {
          points.push(intersect_point);
          if(points.length > 0) {
            // return_paths.push(newPath("cut-path", points));
            // points = [];
          }

        });
        // checking if the first point falls into the path segment

        // check all intersects
        // order intersects on the line segment
        // loop through the intersects
      }
      // check all intersections
      // create bezier out of curve & cut
      // split curve
    }
  });
  if(points.length > 0) {
    return_paths.push(new Path(points));
  }
  return_paths = return_paths.filter((path) => {
    if (path.points.length > 0) {
      return true;
    } else {
      return false;
    }
  });
  return return_paths;
}

export default cutPath;
