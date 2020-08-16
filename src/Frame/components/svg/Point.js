import React from 'react';
import {
  SET_DRAGGED_POINT,
  SET_DRAGGED_QUADRATIC_CONTROL_POINT,
  SET_DRAGGED_CUBIC_CONTROL_POINT,

  SET_EDIT_POINT,
  SET_EDIT_CUBIC_CONTROL_POINT,
  SET_EDIT_QUADRATIC_CONTROL_POINT,
  // SET_DRAGGED_ARC_CONTROL_POINT
} from '../../reducer/actionTypes';
import styles from '../../../Frame/frame.module.css';
import pathGenerator from './helpers/pathGenerator';
import PointCoordinates from './point/PointCoordinates'
import PointConstraints from './point/PointConstraints';
import PointConstraint from './point/PointConstraint'

class Point extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      mouseOver: false,
      selected: false
    }
  }
  toggleSelected() {
    this.setState({
      selected: !this.state.selected
    })
  }
  render() {
    let point = this.props.point
    let unit = this.props.unit
    let geometry_id = this.props.geometry_id
    let previous_point = this.props.previous_point
    let modelDispatch = this.props.modelDispatch
    let fillColor = this.props.fillColor
    let fillOpacity = this.props.fillOpacity
    let strokeOpacity = this.props.strokeOpacity
    let curveControlLineOpacity = 0.5
    let strokeDasharray = "5 5"
    let strokeColor = this.props.strokeColor
    let strokeWidth = this.props.strokeWidth
    let scaling = this.props.scaling
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
    if(this.props.onClickCallback) {
      classes += ` ${styles.clickable}`
    }
    let radius = this.props.radius

    if(this.props.geometryRadius) {
      radius = this.props.geometryRadius
    }

    let control_points = null;
    let control_point_lines = null;
    let coordinates = [];

    if((point.dragging || this.state.selected) && this.props.showCoordinates) {
      coordinates.push(
        <PointCoordinates
          key="point"
          unit={unit}
          point={point}
          radius={radius} />
      )
    }
    if(point.q) {
      if (point.q.dragging) {
        coordinates.push(
          <PointCoordinates
            key="q-point"
            unit={unit}
            point={point.q}
            radius={radius} />
        )
      }
      control_points = (
        <circle
          cx={`${point.q.x}${unit}`}
          cy={`${point.q.y}${unit}`}
          r={`${radius/scaling.x}${unit}`}
          fill={fillColor}
          fillOpacity={fillOpacity}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
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
            strokeWidth={strokeWidth}
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
            strokeWidth={strokeWidth}
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
              radius={radius/scaling.x} />
          )
        }
        return (
          <circle
            cx={`${c_point.x}${unit}`}
            cy={`${c_point.y}${unit}`}
            fill={fillColor}
            fillOpacity={fillOpacity}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeOpacity={strokeOpacity}
            r={`${radius/scaling.x}${unit}`}
            key={i}
            className={controlPointClasses + " cubic"}
            onMouseDown={ (e) => {
              if(modelDispatch !== undefined) {
                modelDispatch({
                  type: SET_DRAGGED_CUBIC_CONTROL_POINT,
                  point_id: point.id,
                  i: i,
                  geometry_id: geometry_id
                });
              }
            }}
            onTouchStart={ (e) => {
              if(modelDispatch !== undefined) {
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
                strokeWidth={strokeWidth}
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
                strokeWidth={strokeWidth}
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
              if(this.props.onClickCallback) {
                this.props.onClickCallback()
              } else {
                if(modelDispatch !== undefined) {
                  modelDispatch({
                    type: SET_DRAGGED_POINT,
                    point_id: point.id,
                    geometry_id: geometry_id
                  })
                }
                this.toggleSelected()
              }
            }
          }}
          onTouchStart={ (e) => {
            if(modelDispatch !== undefined) {
              modelDispatch({
                type: SET_DRAGGED_POINT,
                point_id: point.id,
                geometry_id: geometry_id
              })
            }
          } }
          onContextMenu={(e) => {
            this.props.setEditingPoint({
              point_id: point.id,
              geometry_id: geometry_id,
              geometry_key: point.geometry.key
            })
            e.preventDefault()
          }}
          cx={`${point.x}${unit}`}
          cy={`${point.y}${unit}`}
          r={`${radius / scaling.x}${unit}`}
          fill={fillColor}
          fillOpacity={fillOpacity}
          stroke={strokeColor}
          strokeWidth={strokeWidth / scaling.x}
          strokeOpacity={strokeOpacity}
          />
          {point.label ? (
            <text
              x={point.x}
              y={(point.dragging || this.state.selected) && this.props.showCoordinates ?
                  point.y + (radius + 11)  / scaling.x * 1.5 : point.y + radius  / scaling.x * 1.5 }
              alignmentBaseline="hanging"
              textAnchor="middle"
              className='point-label'
              fontSize={12 / scaling.x}
              >
              {point.label}
            </text>
          ) : null}
        </g>
    );
  }
}

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
