import React from 'react'
import pathGenerator from '../helpers/pathGenerator';
import _ from 'lodash'

const SegmentsLengthsLabels = React.memo(({
    path,
    scaling
}) => {
    const segments = path.segments()
    
    return (
        <g className='segments-lengths-labels'>
            {segments.map((segment, i) => {
                const segmentId = `${path.id}-segment-${i}`
                const segmentLength = segment.getLength()
                const text = `${_.round(segmentLength, 1)}${path.displayUnit}`


                
                if(text.length * 10 > segmentLength * scaling.x) {
                    return null
                }
                return (
                    <g key={i}>
                        <path
                            id={segmentId}
                            className='segment-path'
                            d={pathGenerator([segment.p1, segment.p2], false)}
                            fill="transparent"
                            stroke="transparent"
                            />
                        <text
                            textAnchor="middle"
                            className='segment-length'
                            fontSize={10 / scaling.x}
                            >
                        <textPath
                            startOffset="50%"
                            baselineShift={3 / scaling.x} 
                            href={`#${segmentId}`}
                            >
                            {text}
                        </textPath>
                        </text>
                    </g>
                )
            })}
        </g>
    )
})


export default SegmentsLengthsLabels