import React from 'react';
import Group from './svg/Group';
import Path from './svg/Path';
import Polygon from './svg/Polygon';
import Text from './svg/Text'
import {
  GROUP,
  POLYGON,
  PATH,
  TEXT
} from '../../geometry/types';
import _ from 'lodash'
const Geometry = React.memo(({
  geometry,
  geometryKey,
  modelDispatch,
  scaling,
  onPointClickCallback,
  onGeometryClickCallback,
  setEditingPoint,
  showPointCoordinates,
  selectingPoints,
  startDraggingSelection
}) => {
  switch (geometry.type) {
    case GROUP:
      return (
        <Group
          scaling={scaling}
          geometry={geometry}
          modelDispatch={modelDispatch}
          onPointClickCallback={onPointClickCallback}
          setEditingPoint={setEditingPoint}
          showCoordinates={showPointCoordinates}
          selectingPoints={selectingPoints}
          startDraggingSelection={startDraggingSelection}
          />
      );
    case POLYGON:
      return (
        <Polygon
          geometry={geometry}
          modelDispatch={modelDispatch} />
      );
    case PATH:
      return (
        <Path
          scaling={scaling}
          geometry={geometry}
          modelDispatch={modelDispatch}
          onPointClickCallback={onPointClickCallback}
          onPathClickCallback={onGeometryClickCallback}
          setEditingPoint={setEditingPoint}
          showCoordinates={showPointCoordinates}
          selectingPoints={selectingPoints}
          startDraggingSelection={startDraggingSelection}
          />
      );
    case TEXT:
      return (
        <Text
          scaling={scaling}
          geometry={geometry}
          modelDispatch={modelDispatch} />
      )
    default:
      return (
        <g><text>No type set for {geometry.name}</text></g>
      );
  }
}, (prevProps, nextProps) => {
  if(nextProps.modelHasUpdated) {
    return false
  }
  if(!_.isUndefined(prevProps) || !_.isUndefined(nextProps)) {
    return false
  }
  if(prevProps.geometry.points && nextProps.geoemtry.points) {
    if(prevProps.geometry.points.length !== nextProps.geometry.points.length) {
      return false
    }
    const prevPropsAllValues = _.flattenDeep(prevProps.geometry.points.map(p => p.getValues()))
    const nextPropsAllValues = _.flattenDeep(nextProps.geometry.points.map(p => p.getValues()))
    if(!_.isEqual(prevPropsAllValues, nextPropsAllValues)) {
      // console.log('geometries not equal', prevProps.geometry, nextProps.geometry)
      return false
    }
    const prevPropsSelectedValues = prevProps.geometry.points.map(p => p.selected)
    const nextPropsSelectedValues = nextProps.geometry.points.map(p => p.selected)
    if(prevPropsSelectedValues.some((p, i) => p !== nextPropsSelectedValues[i])) {
      return false
    }
  }
  if(prevProps.setEditingPoint !== nextProps.setEditingPoint) {
    return false
  }
  if(prevProps.selectingPoints !== nextProps.selectingPoints) {
    return false
  }
  if(prevProps.onPointClickCallback !== nextProps.onPointClickCallback) {
    return false
  }
  return prevProps.scaling.x === nextProps.scaling.x
})

export default Geometry;
