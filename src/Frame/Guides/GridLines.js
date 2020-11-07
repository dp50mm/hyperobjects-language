import React from 'react'
import _ from 'lodash'
import * as d3 from 'd3'

const GridLines = React.memo(({
    width,
    height,
    transformMatrix,
    gridLinesUnit
}) => {
    const gridLineCounts = {
        x: Math.ceil(width / 100),
        y: Math.ceil(height/ 100)
    }
    let xScale = d3.scaleLinear().domain([0, gridLineCounts.x]).range([0, width])
    let yScale = d3.scaleLinear().domain([0, gridLineCounts.y]).range([0, height])
    let yTextShift = 0
    if(transformMatrix.translateY < 0) {
        yTextShift = transformMatrix.translateY / transformMatrix.scaleX
    } 
    let xTextShift = 0
    if(transformMatrix.translateX < 0) {
        xTextShift = transformMatrix.translateX / transformMatrix.scaleY
    }
    const labelColor = "rgb(150,150,150)"
    return (
        <g className='grid-lines'>
        {_.range(gridLineCounts.x).map(val => {
                return (
                    <g key={`x-${val}`} transform={`translate(${xScale(val)}, 0)`}>
                    <line
                        
                        x1={0}
                        x2={0}
                        y1={0}
                        y2={height}
                        className="grid-line"
                        strokeWidth={0.5 / transformMatrix.scaleX}
                        />
                    <text
                        x={5 / transformMatrix.scaleX}
                        y={5 / transformMatrix.scaleX - yTextShift}
                        alignmentBaseline="hanging"
                        fontSize={12 / transformMatrix.scaleX}
                        fill={labelColor}
                        >
                        {Math.round(xScale(val))}{gridLinesUnit}
                    </text>
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
                        strokeWidth={0.5 / transformMatrix.scaleX}
                        className="grid-line"
                        />
                    <text
                        x={5 / transformMatrix.scaleX - xTextShift}
                        y={5 / transformMatrix.scaleX}
                        alignmentBaseline="hanging"
                        fontSize={12 / transformMatrix.scaleX}
                        fill={labelColor}
                        >
                        {Math.round(yScale(val))}{gridLinesUnit}
                    </text>
                </g>
            )
        })}
        </g>
    )
})

export default GridLines