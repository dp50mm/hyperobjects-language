import React, { useContext } from 'react';
import {
  SET_DRAGGED_POINT,
  SET_DRAGGED_QUADRATIC_CONTROL_POINT,
  SET_DRAGGED_CUBIC_CONTROL_POINT,

} from '../../reducer/actionTypes';
import styles from '../../../Frame/frame.module.css';
import pathGenerator from './helpers/pathGenerator';
import PointCoordinates from './point/PointCoordinates'
import PointConstraints from './point/PointConstraints';
import PointConstraint from './point/PointConstraint'
import _ from 'lodash'

const Point = React.memo(({
    point,
    unit,
    geometry_id,
    previous_point,
    modelDispatch,
    fillColor,
    fillOpacity,
    strokeOpacity,
    strokeColor,
    strokeWidth,
    scaling,
    onClickCallback,
    radius,
    geometryRadius,
    showCoordinates,
    setEditingPoint,
    selectingPoints,
    startDraggingSelection
}) => {
    let curveControlLineOpacity = 0.5
    let strokeDasharray = "5 5"
    if(point.fill) {
      fillColor = point.fill
    }
    let classes = `geometry-${point.type} `
    let controlPointClasses =`${point.type} `
    classes += styles.point;
    controlPointClasses += styles.point + " "
    if (point.cssClasses !== undefined) {
      classes += point.cssClasses + ' ';
    }
    if(modelDispatch !== undefined) {
      classes += styles.editable;
      controlPointClasses += styles.editable
    }
    if(onClickCallback) {
      classes += ` ${styles.clickable}`
    }
    let _radius = radius

    if(geometryRadius) {
      _radius = geometryRadius
    }
    if(point.selected) {
      classes += ` ${styles.selected}`
    }

    let control_points = null;
    let control_point_lines = null;
    let coordinates = [];

    if(point.dragging && showCoordinates) {
      coordinates.push(
        <PointCoordinates
          key="point"
          unit={unit}
          point={point}
          radius={_radius}
          scaling={scaling}
          />
      )
    }
    if(point.q) {
      if (point.q.dragging) {
        coordinates.push(
          <PointCoordinates
            key="q-point"
            unit={unit}
            point={point.q}
            radius={_radius}
            scaling={scaling}
            />
        )
      }
      control_points = (
        <circle
          cx={`${point.q.x}${unit}`}
          cy={`${point.q.y}${unit}`}
          r={`${_radius/scaling.x}${unit}`}
          fill={fillColor}
          fillOpacity={fillOpacity}
          stroke={strokeColor}
          strokeWidth={strokeWidth / scaling.x}
          strokeOpacity={strokeOpacity}
          className={controlPointClasses + " qubic"}
          onMouseDown={ (e) => {
            if(modelDispatch !== undefined) {
              modelDispatch({
                type: SET_DRAGGED_QUADRATIC_CONTROL_POINT,
                point_id: point.id,
                geometry_id: geometry_id
              });
            }
          }}
          onTouchStart={ (e) => {
            if(modelDispatch !== undefined) {
              modelDispatch({
                type: SET_DRAGGED_QUADRATIC_CONTROL_POINT,
                point_id: point.id,
                geometry_id: geometry_id
              });
            }
          }}
          />
      );
      let line_two = null;
      if(previous_point !== undefined) {
        line_two = (
          <path className='control-point-line'
            stroke={strokeColor}
            strokeWidth={strokeWidth / scaling.x}
            strokeOpacity={curveControlLineOpacity}
            strokeDasharray={strokeDasharray}
            d={pathGenerator([
              {x:point.q.x,y:point.q.y},
              {x:previous_point.x, y:previous_point.y}
            ], false)}
            />
        );
      }
      control_point_lines = (
        <g>
          <path className='control-point-line'
            stroke={strokeColor}
            strokeWidth={strokeWidth / scaling.x}
            strokeOpacity={curveControlLineOpacity}
            strokeDasharray={strokeDasharray}
            d={pathGenerator([
              {x:point.q.x,y:point.q.y},
              {x:point.x, y:point.y}
            ], false)}
            />
            {line_two}
          </g>
      );
    } else if (point.c) {
      control_points = point.c.map((c_point, i) => {
        if(c_point.dragging) {
          coordinates.push(
            <PointCoordinates
              key={`c-point-${i}`}
              unit={unit}
              point={c_point}
              radius={_radius/scaling.x}
              scaling={scaling}
              />
          )
        }
        return (
          <circle
            cx={`${c_point.x}${unit}`}
            cy={`${c_point.y}${unit}`}
            fill={fillColor}
            fillOpacity={fillOpacity}
            stroke={strokeColor}
            strokeWidth={strokeWidth / scaling.x}
            strokeOpacity={strokeOpacity}
            r={`${_radius/scaling.x}${unit}`}
            key={i}
            className={controlPointClasses + " cubic"}
            onMouseDown={ (e) => {
              if(modelDispatch !== undefined && selectingPoints === false) {
                modelDispatch({
                  type: SET_DRAGGED_CUBIC_CONTROL_POINT,
                  point_id: point.id,
                  i: i,
                  geometry_id: geometry_id
                });
              }
            }}
            onTouchStart={ (e) => {
              if(modelDispatch !== undefined && selectingPoints === false) {
                modelDispatch({
                  type: SET_DRAGGED_CUBIC_CONTROL_POINT,
                  point_id: point.id,
                  i: i,
                  geometry_id: geometry_id
                });
              }
            }}
            />
        );
      });
      control_point_lines = point.c.map((c_point, i) => {
        if(i === 0 && previous_point !== undefined) {
          return (
              <path className='control-point-line'
                key={i}
                stroke={strokeColor}
                strokeWidth={strokeWidth / scaling.x}
                strokeOpacity={curveControlLineOpacity}
                strokeDasharray={strokeDasharray}
                d={pathGenerator([
                  {x:c_point.x,y:c_point.y},
                  {x: previous_point.x, y: previous_point.y}
                ], false)}
                />
            );
        } else {
          return (
              <path className='control-point-line'
                key={i}
                stroke={strokeColor}
                strokeWidth={strokeWidth / scaling.x}
                strokeOpacity={curveControlLineOpacity}
                strokeDasharray={strokeDasharray}
                d={pathGenerator([
                  {x:c_point.x,y:c_point.y},
                  {x:point.x, y:point.y}
                ], false)}
                />
            );
        }
      });
    } else if(point.a) {
      control_points = (
        <g>
        </g>
      );
    }
    return (
      <g>
        {coordinates}
        {control_point_lines}
        {control_points}
        <PointConstraints
          scaling={scaling}
          point={point}
          unit={unit}/>
        {point.constraint ? (
          <PointConstraint
            point={point}
            scaling={scaling}
            unit={unit}
            />
        ) : null}
        <circle
          className={classes}
          onMouseDown={(e) => {
            if(e.button === 0) {
              if(onClickCallback) {
                onClickCallback()
              } else {
                if(modelDispatch !== undefined) {
                  if(selectingPoints === false) {
                    modelDispatch({
                      type: SET_DRAGGED_POINT,
                      point_id: point.id,
                      geometry_id: geometry_id
                    })
                  } else {
                    startDraggingSelection(e)
                  }
                }
              }
            }
          }}
          onTouchStart={ (e) => {
            if(modelDispatch !== undefined && selectingPoints === false) {
              modelDispatch({
                type: SET_DRAGGED_POINT,
                point_id: point.id,
                geometry_id: geometry_id
              })
            }
          } }
          onContextMenu={(e) => {
            setEditingPoint({
              point_id: point.id,
              geometry_id: geometry_id,
              geometry_key: point.geometry.key
            })
            e.preventDefault()
          }}
          cx={`${point.x}${unit}`}
          cy={`${point.y}${unit}`}
          r={`${_radius / scaling.x}${unit}`}
          fill={fillColor}
          fillOpacity={fillOpacity}
          stroke={strokeColor}
          strokeWidth={strokeWidth / scaling.x}
          strokeOpacity={strokeOpacity}
          />
          {point.label ? (
            <text
              x={point.x}
              y={point.dragging && showCoordinates ?
                  point.y + (_radius + 11)  / scaling.x * 1.5 : point.y + _radius  / scaling.x * 1.5 }
              alignmentBaseline="hanging"
              textAnchor="middle"
              className='point-label'
              fontSize={12 / scaling.x}
              >
              {point.label}
            </text>
          ) : null}
        </g>
    )
}, (prev, next) => {
  let prevValues = prev.point.getValues()
  let nextValues = next.point.getValues()
  if(prev.point.selected !== next.point.selected) {
    return false
  }
  if(prevValues.some((v, i) => v !== nextValues[i])) {
    return false
  }
  if(!_.isEqual(prev.scaling, next.scaling)) {
    return false
  }
  
  return true
})

Point.defaultProps = {
  showCoordinates: false,
  radius: 15,
  scaling: {x: 1, y: 1},
  onClickCallback: false
}


export default Point;

/*

{control_point_lines}
{control_points}


 */
