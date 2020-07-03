import Path from '../Path';
import _ from 'lodash';

function Circle(point, size, segments, steps) {
  let _steps = segments + 1
  if(steps !== undefined) {
    _steps = steps
  }
  return new Path(_.range(_steps).map((val) => {
    return {
      x: point.x + Math.cos((val / segments) * Math.PI * 2) * size,
      y: point.y + Math.sin((val / segments) * Math.PI * 2) * size
    };
  })).closed(true);
}

export default Circle;
