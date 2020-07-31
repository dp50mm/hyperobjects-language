import Point from './Point';
import { POLYGON } from './types';

let polygon_id = 0;

function Polygon(points, name) {
  polygon_id += 1;
  let polygonName = `GROUP ${polygon_id}`;
  if(name !== undefined) {
    polygonName = name;
  }
  this.name = polygonName;
  this.type = POLYGON;
  this.id = polygon_id;
  this.closed = true;
  this.points = points.map((point) => {
    return new Point(point);
  })
}

Polygon.type = POLYGON

export default Polygon;
