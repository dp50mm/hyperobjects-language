import React, { useState } from "react"
import Point from "./Point"
import PreviewPoint from './PreviewPoint';
import previewCheck from './helpers/previewCheck';
import _ from "lodash"

const Line = React.memo(({
    geometry,
    modelDispatch,
    scaling,
    onPointClickCallback,
    onLineClickCallback,
    setEditingPoint,
    showCoordinates,
    selectingPoints,
    startDraggingSelection,
    modelSpaceMouseCoords
}) => {
    var p1 = _.get(geometry, "points[0]", false)
    var p2 = _.get(geometry, "points[1]", false)
    if(!_.every([p1, p2])) {
      return null
    }
    const boundsPoints = geometry.extendToBounds()

    var editPoints = null
    var strokeWidth = geometry._strokeWidth
    if(geometry._scaledStrokeWidth) strokeWidth = strokeWidth / scaling.x
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
    return (
        <g className="line">
            
            <line
                stroke={geometry._stroke}
                strokeWidth={strokeWidth}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                />
            {geometry._showExtend && (
                <line
                stroke={geometry._stroke}
                strokeWidth={strokeWidth}
                opacity={0.2}
                x1={boundsPoints[0].x}
                y1={boundsPoints[0].y}
                x2={boundsPoints[1].x}
                y2={boundsPoints[1].y}
                />
            )}  
            
            {editPoints}
        </g>
    )
})

export default Line