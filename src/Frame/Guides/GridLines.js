import React from 'react'
import styles from './guides.module.scss'
import _ from 'lodash'
import * as d3 from 'd3'

const GridLines = React.memo(({
    width,
    height,
    pan,
    zoom,
    gridLinesUnit
}) => {
    const gridLineCounts = {
        x: Math.ceil(width / 100),
        y: Math.ceil(height/ 100)
    }
    let xScale = d3.scaleLinear().domain([0, gridLineCounts.x]).range([0, width])
    let yScale = d3.scaleLinear().domain([0, gridLineCounts.y]).range([0, height])
    let yTextShift = 0
    if(pan.y < 0) {
        yTextShift = pan.y
    } 
    let xTextShift = 0
    if(pan.x < 0) {
        xTextShift = pan.x
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
                        className={styles['grid-line']}
                        />
                    <text
                        x={5}
                        y={5 - yTextShift}
                        alignmentBaseline="hanging"
                        fontSize={12 / zoom}
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
                        className={styles['grid-line']}
                        />
                    <text
                        x={5 - xTextShift}
                        y={5}
                        alignmentBaseline="hanging"
                        fontSize={12 / zoom}
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