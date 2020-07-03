import React from 'react';
import pathGenerator from './helpers/pathGenerator';

const Polygon = ({geometry, modelDispatch}) => {
  return (
    <g>
      <path
        className={geometry.cssClasses}
        d={pathGenerator(geometry.points, geometry.closed)} />
    </g>
  );
}

export default Polygon;
