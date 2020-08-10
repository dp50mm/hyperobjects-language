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


const Geometry = ({
  geometry,
  modelDispatch,
  scaling,
  onPointClickCallback,
  onGeometryClickCallback,
  setEditingPoint,
  showPointCoordinates
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

}

export default Geometry;
