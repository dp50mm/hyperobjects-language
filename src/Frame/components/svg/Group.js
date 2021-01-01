import React from 'react';
import Point from './Point';
import BoundsRectangle from './path/BoundsRectangle'
import PreviewPoint from './PreviewPoint';
import previewCheck from './helpers/previewCheck'


const Group = ({
  geometry,
  modelDispatch,
  scaling,
  onPointClickCallback,
  setEditingPoint,
  showCoordinates,
  startDraggingSelection,
  selectingPoints,
  modelSpaceMouseCoords
}) => (
  <g>
    {geometry.showBounds && (
      <BoundsRectangle rectangle={geometry.getBounds()} scaling={scaling} />
    )}
   {geometry.points.map((point, i) => {
     let pointRadius = geometry._r ? geometry._r : point.radius
     let q = _.get(point, 'q', false)
     let c = _.get(point, 'c', false)
     var points = [point]
     if(q) { points.push(q) }
     if(c) { points = points.concat(c) }
     if(points.some(p => previewCheck(modelSpaceMouseCoords, p, pointRadius, scaling))) {
       return (
         <PreviewPoint
          point={point}
          key={point.id}
          scaling={scaling}
          showCoordinates={showCoordinates}
          unit={geometry.unit}
          fillColor={geometry.controls.fill}
          fillOpacity={geometry.controls.fillOpacity}
          strokeWidth={geometry.controls.strokeWidth}
          strokeColor={geometry.controls.stroke}
          strokeOpacity={geometry.controls.strokeOpacity}
          geometryRadius={geometry._r}
          />
       )
     }
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
        geometryKey={geometry.key}
        modelDispatch={modelDispatch}
        onClickCallback={onPointClickCallback ? () => onPointClickCallback(geometry, point, i) : false}
        setEditingPoint={setEditingPoint}
        showCoordinates={showCoordinates}
        startDraggingSelection={startDraggingSelection}
        selectingPoints={selectingPoints}
        />
     )
   })}
  </g>
);

Group.defaultProps = {
  modelSpaceMouseCoords: {x: 0, y: 0}
}

export default Group;
