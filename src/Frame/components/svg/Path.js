import React, { useState } from 'react';
import Point from './Point';
import pathGenerator from './helpers/pathGenerator';
import { CLICKED_GEOMETRY } from '../../reducer/actionTypes';
import BoundsRectangle from './path/BoundsRectangle';
import SegmentsLengthsLabels from './path/SegmentsLengthsLabels'
import PreviewPoint from './PreviewPoint';
import previewCheck from './helpers/previewCheck';

function simpleDistance(p1, p2) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y)
}

const Path = React.memo(({
  geometry,
  modelDispatch,
  scaling,
  onPointClickCallback,
  onPathClickCallback,
  setEditingPoint,
  showCoordinates,
  selectingPoints,
  startDraggingSelection,
  modelSpaceMouseCoords
}) => {
  const [mouseOver, setMouseOver] = useState(false)
  let editPoints = null;
  let uniqueClass = `geometry-${geometry.type} `
  let classes = uniqueClass
  classes += 'path '
  classes += geometry.cssClasses
  let fillOpacity = geometry.closedPath ? geometry._fillOpacity : 0
  
  if(geometry.editable) {
    editPoints = geometry.points.map((point, i, a) => {
      let pointRadius = geometry._r ? geometry._r : point.radius
      let q = _.get(point, 'q', false)
      let c = _.get(point, 'c', false)
      var points = [point]
      if(q) { points.push(q) }
      if(c) { points = points.concat(c) }
      let previous_point = false;
      if(point.c && i > 0) {
        previous_point = a[i-1];
      } else if(point.q && i > 0) {
        previous_point = a[i-1];
      } else if(i === 0) {
        previous_point = a[a.length - 1]
      }

      let next_point = _.get(a, i + 1, a[0])
      if(points.every(p => previewCheck(modelSpaceMouseCoords, p, pointRadius, scaling))) {
        return (
          <PreviewPoint
          key={point.id}
           point={point}
           scaling={scaling}
           showCoordinates={showCoordinates}
           unit={geometry.unit}
           fillColor={geometry.controls.fill}
           fillOpacity={geometry.controls.fillOpacity}
           strokeWidth={geometry.controls.strokeWidth}
           strokeColor={geometry.controls.stroke}
           strokeOpacity={geometry.controls.strokeOpacity}
           geometryRadius={geometry._r}
           previous_point={previous_point}
           next_point={next_point}
           />
        )
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
         geometryKey={geometry.key}
         previous_point={previous_point}
         next_point={next_point}
         modelDispatch={modelDispatch}
         onClickCallback={onPointClickCallback ? () => onPointClickCallback(geometry, point, i) : false}
         setEditingPoint={setEditingPoint}
         showCoordinates={showCoordinates}
         startDraggingSelection={startDraggingSelection}
         selectingPoints={selectingPoints}
         />
      )
    });
  }
  let style = {pointerEvents: "none"}
  if(onPathClickCallback) {
    style.pointerEvents = "auto"
    classes += ' click-callback'
    if(mouseOver) {
      style.cursor = 'pointer'
    }
  }
  return (
    <g>
    {(onPathClickCallback && mouseOver) && (
      <BoundsRectangle rectangle={geometry.getBounds()} scaling={scaling} />
    )}
    {geometry.showBounds && (
      <BoundsRectangle rectangle={geometry.getBounds()} scaling={scaling} />
    )}
    {geometry.showSegmentLengthLabels && (
      <SegmentsLengthsLabels path={geometry} scaling={scaling} />
    )}
    <path
      className={classes}
      d={pathGenerator(geometry.points, geometry.closedPath)}
      fill={geometry._fill}
      fillOpacity={fillOpacity}
      stroke={geometry._stroke}
      strokeWidth={geometry._strokeWidth / scaling.x}
      strokeOpacity={geometry._strokeOpacity}
      opacity={geometry._opacity}
      strokeLinecap={geometry._strokeLinecap}
      strokeLinejoin={geometry._strokeLinejoin}
      strokeDasharray={geometry._strokeDasharray / scaling.x}
      onClick={() => {
        if(onPathClickCallback) {
          onPathClickCallback(geometry)
        }
        modelDispatch({type: CLICKED_GEOMETRY, geometry_id: geometry.id})
      }}
      style={style}
      onMouseOver={() => {
          if(onPathClickCallback) {
            setMouseOver(true)
          }
      }}
      onMouseLeave={() => {
        if(onPathClickCallback) {
          setMouseOver(false)
        }
      }}
      />
    {editPoints}
    </g>
  );
})

Path.defaultProps = {
  onPointClickCallback: false,
  onPathClickCallback: false
}

export default Path;
