import React from 'react';
import Point from './Point';
import pathGenerator from './helpers/pathGenerator';

const Path = ({geometry, modelDispatch, scaling}) => {
  let editPoints = null;
  let uniqueClass = `geometry-${geometry.type} `
  let classes = uniqueClass
  classes += 'path '
  classes += geometry.cssClasses
  let fillOpacity = geometry.closedPath ? geometry._fillOpacity : 0

  if(geometry.editable) {
    editPoints = geometry.points.map((point, i, a) => {
      let previous_point = false;
      if(point.c && i > 0) {
        previous_point = a[i-1];
      } else if(point.q && i > 0) {
        previous_point = a[i-1];
      } else if(i === 0) {
        previous_point = a[a.length - 1]
      }
      return (
        <Point
         geometryRadius={geometry._r}
         key={point.id}
         point={point}
         scaling={scaling}
         unit={geometry.unit}
         fillColor={geometry.controls.fill}
         fillOpacity={geometry.controls.fillOpacity}
         strokeWidth={geometry.controls.strokeWidth}
         strokeColor={geometry.controls.stroke}
         strokeOpacity={geometry.controls.strokeOpacityValue}
         geometry_id={geometry.id}
         previous_point={previous_point}
         modelDispatch={modelDispatch} />
      )
    });
  }
  return (
    <g>
    <path
      style={{
        pointerEvents: 'none'
      }}
      className={classes}
      d={pathGenerator(geometry.points, geometry.closedPath)}
      fill={geometry._fill}
      fillOpacity={fillOpacity}
      stroke={geometry._stroke}
      strokeWidth={geometry._strokeWidth}
      strokeOpacity={geometry._strokeOpacity}
      opacity={geometry._opacity}
      strokeLinecap={geometry._strokeLinecap}
      strokeLinejoin={geometry._strokeLinejoin}
      />
    {editPoints}
    </g>
  );
}

export default Path;
