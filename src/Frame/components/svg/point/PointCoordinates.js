import React from 'react'

const PointCoordinates = React.memo(({ radius, point, unit, scaling }) => {
  const coordinatesMargins = 10;
  return (
    <g style={{userSelect: 'none'}}>
      <text
        opacity={0.5}
        x={`${point.x}${unit}`}
        y={`${point.y - (radius - coordinatesMargins) / scaling.y}${unit}`}
        textAnchor="middle"
        fontSize={12 / scaling.x}
        >
      x
      </text>
      <text
        opacity={0.5}
        x={`${point.x}${unit}`}
        y={`${point.y + (radius + coordinatesMargins) / scaling.y}${unit}`}
        alignmentBaseline="hanging"
        textAnchor="middle"
        fontSize={12 / scaling.x}
        >
      {Math.round(point.x)}
      </text>
      <text
        alignmentBaseline="middle"
        textAnchor="end"
        opacity={0.5}
        x={`${point.x - (radius - coordinatesMargins) / scaling.x}${unit}`}
        y={`${point.y}${unit}`}
        fontSize={12 / scaling.x}
        >
      y
      </text>
      <text
        alignmentBaseline="middle"
        opacity={0.5}
        x={`${point.x + (radius + coordinatesMargins) / scaling.x}${unit}`}
        y={`${point.y}${unit}`}
        fontSize={12 / scaling.x}
        >
      {Math.round(point.y)}
      </text>
    </g>
  )
})

export default PointCoordinates
