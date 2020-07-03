import React from 'react'

const PointCoordinates = ({ radius, point, unit }) => {
  const coordinatesMargins = 10;
  return (
    <g style={{userSelect: 'none'}}>
      <text
        opacity={0.5}
        x={`${point.x}${unit}`}
        y={`${point.y - radius - coordinatesMargins}${unit}`}
        textAnchor="middle"
        >
      x
      </text>
      <text
        opacity={0.5}
        x={`${point.x}${unit}`}
        y={`${point.y + radius + coordinatesMargins}${unit}`}
        alignmentBaseline="hanging"
        textAnchor="middle"
        >
      {Math.round(point.x)}
      </text>
      <text
        alignmentBaseline="middle"
        textAnchor="end"
        opacity={0.5}
        x={`${point.x - radius - coordinatesMargins}${unit}`}
        y={`${point.y}${unit}`}>
      y
      </text>
      <text
        alignmentBaseline="middle"
        opacity={0.5}
        x={`${point.x + radius + coordinatesMargins}${unit}`}
        y={`${point.y}${unit}`}>
      {Math.round(point.y)}
      </text>
    </g>
  )
}

export default PointCoordinates
