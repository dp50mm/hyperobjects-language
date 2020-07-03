import Path from '../Path';

function Rectangle(pointA, pointB) {
  return new Path(
    [
      {x: pointA.x, y: pointA.y},
      {x: pointB.x, y: pointA.y},
      {x: pointB.x, y: pointB.y},
      {x: pointA.x, y: pointB.y}
    ]
  ).closed(true);
}

export default Rectangle;
