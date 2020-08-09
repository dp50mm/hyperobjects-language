import React from 'react';
import Point from './Point';
import BoundsRectangle from './path/BoundsRectangle'

const Group = ({
  geometry,
  modelDispatch,
  scaling,
  onPointClickCallback,
  setEditingPoint
}) => (
  <g>
    {geometry.showBounds && (
      <BoundsRectangle rectangle={geometry.getBounds()} scaling={scaling} />
    )}
   {geometry.points.map((point, i) => {
     let fill = geometry.controls.fill
     if(geometry._fill) {
       fill = geometry._fill
     }
     return (
       <Point
        geometryRadius={geometry._r}
        key={point.id}
        point={point}
        unit={geometry.unit}
        fillColor={geometry.controls.fill}
        fillOpacity={geometry.controls.fillOpacity}
        strokeWidth={geometry.controls.strokeWidth}
        strokeColor={geometry.controls.stroke}
        strokeOpacity={geometry.controls.strokeOpacity}
        scaling={scaling}
        geometry_id={geometry.id}
        modelDispatch={modelDispatch}
        onClickCallback={onPointClickCallback ? () => onPointClickCallback(geometry, point, i) : false}
        setEditingPoint={setEditingPoint}
        />
     )
   })}
  </g>
);

export default Group;
