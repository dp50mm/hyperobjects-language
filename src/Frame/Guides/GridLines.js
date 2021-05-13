import React from 'react'
import _ from 'lodash'
import * as d3 from 'd3'


var opacityScale = d3.scaleLinear().domain([0.2, 0.1]).range([0.7, 0]).clamp(true)
var fontSizeScale = d3.scaleLinear().domain([0.2, 0]).range([12, 0]).clamp(true)

const GridLines = React.memo(({
    width,
    height,
    transformMatrix,
    gridLinesUnit,
    showTicks,
    gridColor
}) => {
    const gridLineCounts = {
        x: Math.ceil(width / 100),
        y: Math.ceil(height/ 100)
    }
    let xScale = d3.scaleLinear().domain([0, gridLineCounts.x]).range([0, width])
    let yScale = d3.scaleLinear().domain([0, gridLineCounts.y]).range([0, height])
    let yTextShift = 0
    let xTextShift = 0
    var xLabelTextAnchor = "start"
    var yLabelTextAnchor = "end"

    if(transformMatrix.translateY * transformMatrix.scaleY < 20) {
        xLabelTextAnchor = "end"
        yTextShift = transformMatrix.translateY / transformMatrix.scaleY
    } else {
        yTextShift += 10 / transformMatrix.scaleY
    }
    
    
    if(transformMatrix.translateX * transformMatrix.scaleX < 18 ) {
        yLabelTextAnchor = "start"
        xTextShift += transformMatrix.translateX / transformMatrix.scaleX
    } else {
        xTextShift += 10 / transformMatrix.scaleX
    }
    const labelColor = gridColor
    
    return (
        <g className='grid-lines'>
        {_.range(1, gridLineCounts.x).map(val => {
                return (
                    <g key={`x-${val}`} transform={`translate(${xScale(val)}, 0)`}>
                    <line
                        x1={0}
                        x2={0}
                        y1={0}
                        y2={height}
                        className="grid-line"
                        stroke={gridColor}
                        opacity={0.5}
                        strokeWidth={0.5 / transformMatrix.scaleX}
                        />
                    {showTicks && transformMatrix.scaleX > 0.1 && (
                        <g transform={`translate(${5/transformMatrix .scaleX}, ${5 / transformMatrix.scaleX - yTextShift})`}>
                            <text
                            x={0}
                            y={0}
                            alignmentBaseline="hanging"
                            fill={labelColor}
                            transform={`rotate(-90)`}
                            fontSize={fontSizeScale(transformMatrix.scaleX) / transformMatrix.scaleX}
                            opacity={opacityScale(transformMatrix.scaleX)}
                            textAnchor={xLabelTextAnchor}
                            >
                                {Math.round(xScale(val))}{gridLinesUnit}
                            </text>
                        </g>
                    )}
                        
                    
                    </g>
                )
        })}
        {_.range(gridLineCounts.y).map(val => {
            return (
                <g key={`y-${val}`} transform={`translate(0, ${yScale(val)})`}>
                    <line
                        x1={0}
                        x2={width}
                        y1={0}
                        y2={0}
                        stroke={gridColor}
                        opacity={0.5}
                        strokeWidth={0.5 / transformMatrix.scaleX}
                        className="grid-line"
                        />
                    {showTicks && transformMatrix.scaleY > 0.1 && (
                        <text
                        x={5 / transformMatrix.scaleX - xTextShift}
                        y={5 / transformMatrix.scaleX}
                        alignmentBaseline="hanging"
                        fill={labelColor}
                        textAnchor={yLabelTextAnchor}
                        fontSize={fontSizeScale(transformMatrix.scaleX) / transformMatrix.scaleX}
                        opacity={opacityScale(transformMatrix.scaleX)}
                        >
                        {Math.round(yScale(val))}{gridLinesUnit}
                    </text>
                    )}
                    
                </g>
            )
            })}
        </g>
    )
})

export default GridLines