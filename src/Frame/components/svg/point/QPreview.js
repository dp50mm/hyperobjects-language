import React from 'react'

const QPreview = ({
    p,
    q,
    unit,
    scaling,
    fillColor,
    fillOpacity,
    strokeColor,
    strokeOpacity,
    strokeWidth,
    radius,
    previous_point
}) => {
    const strokeDasharray = "5 5"
    const curveControlLineOpacity = 0.5
    return (
        <React.Fragment>
            <circle
                cx={`${q.x}${unit}`}
                cy={`${q.y}${unit}`}
                r={`${radius/scaling.x}${unit}`}
                fill={fillColor}
                fillOpacity={fillOpacity}
                stroke={strokeColor}
                strokeWidth={strokeWidth / scaling.x}
                strokeOpacity={strokeOpacity}
                />
            <line
                className='control-point-line'
                x1={`${q.x}${unit}`}
                y1={`${q.y}${unit}`}
                x2={`${p.x}${unit}`}
                y2={`${p.y}${unit}`}
                stroke={strokeColor}
                strokeWidth={strokeWidth / scaling.x}
                strokeOpacity={curveControlLineOpacity}
                strokeDasharray={strokeDasharray}
                />
            {previous_point && (
                <line
                    className='control-point-line'
                    x1={`${q.x}${unit}`}
                    y1={`${q.y}${unit}`}
                    x2={`${previous_point.x}${unit}`}
                    y2={`${previous_point.y}${unit}`}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth / scaling.x}
                    strokeOpacity={curveControlLineOpacity}
                    strokeDasharray={strokeDasharray}
                    />
            )}
        </React.Fragment>
    )
}

export default QPreview