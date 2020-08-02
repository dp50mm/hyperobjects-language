import React, { useState } from 'react';
import Point from './Point';
import pathGenerator from './helpers/pathGenerator';
import { CLICKED_GEOMETRY } from '../../reducer/actionTypes';
import BoundsRectangle from './path/BoundsRectangle';

const Path = React.memo(({
  geometry,
  modelDispatch,
  scaling,
  onPointClickCallback,
  onPathClickCallback
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
         modelDispatch={modelDispatch}
         onClickCallback={onPointClickCallback ? () => onPointClickCallback(geometry, point, i) : false}
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
    <path
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
