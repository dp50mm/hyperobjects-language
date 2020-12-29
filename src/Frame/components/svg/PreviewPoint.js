import React from 'react'
import CPreview from './point/CPreview'
import QPreview from './point/QPreview'

/**
 * Point component without any pointer events for React rendering efficiency
 */
const PreviewPoint = React.memo(({
    point,
    showCoordinates,
    scaling,
    fillColor,
    fillOpacity,
    strokeOpacity,
    strokeColor,
    strokeWidth,
    unit,
    geometryRadius,
    previous_point
}) => {
    let _radius = point.radius

    if(geometryRadius) {
      _radius = geometryRadius
    }
    return (
        <React.Fragment>
        <circle
            className='preview-point'
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
          {point.q && (
              <QPreview
                p={point}
                q={point.q}
                showCoordinates={showCoordinates}
                scaling={scaling}
                fillColor={fillColor}
                fillOpacity={fillOpacity}
                strokeOpacity={strokeOpacity}
                strokeColor={strokeColor}
                strokeWidth={strokeWidth}
                unit={unit}
                radius={_radius}
                previous_point={previous_point}
                />
          )}
          {point.c && (
            <CPreview
                p={point}
                c={point.c}
                showCoordinates={showCoordinates}
                scaling={scaling}
                fillColor={fillColor}
                fillOpacity={fillOpacity}
                strokeOpacity={strokeOpacity}
                strokeColor={strokeColor}
                strokeWidth={strokeWidth}
                unit={unit}
                radius={_radius}
                previous_point={previous_point}
                />
          )}
        </React.Fragment>
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
    if(prev.selected !== next.selected) {
        return false
    }
    if(prev.dragging !== next.dragging) {
        return false
    }
    if(next.q && prev.q) {
        if(next.q.x !== prev.q.x || next.q.y !== prev.q.y) {
            return false
        }
    }
    return true
})

export default PreviewPoint