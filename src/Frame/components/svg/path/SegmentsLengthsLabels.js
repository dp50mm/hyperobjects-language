import React from 'react'
import pathGenerator from '../helpers/pathGenerator';
import _ from 'lodash'

const SegmentsLengthsLabels = React.memo(({
    path,
    scaling,
    unit
}) => {
    const segments = path.segments()
    return (
        <g className='segments-lengths-labels'>
            {segments.map((segment, i) => {
                const segmentId = `${path.id}-segment-${i}`
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
                            >
                        <textPath
                            startOffset="50%"
                            baselineShift="3px"
                            href={`#${segmentId}`}
                            >
                            {_.round(segment.getLength(), 1)}{unit}
                        </textPath>
                        </text>
                    </g>
                )
            })}
        </g>
    )
})

SegmentsLengthsLabels.defaultProps = {
    unit: 'mm'
}

export default SegmentsLengthsLabels