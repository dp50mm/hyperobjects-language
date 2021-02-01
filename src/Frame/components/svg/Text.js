import React from 'react'

const Text = ({geometry, modelDispatch}) => (
  <g>
    <text
      x={geometry.x}
      y={geometry.y}
      fontSize={geometry._fontSize}
      textAnchor={geometry._textAnchor}
      fill={geometry._fill}
      fillOpacity={geometry._fillOpacity}
      fontFamily={`${geometry._fontFamily} Europa Helvetica`}
      >
    {geometry.text}
    </text>
  </g>
)

export default Text
