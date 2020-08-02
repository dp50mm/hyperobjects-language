import React from 'react'

const BoundsRectangle = ({
    rectangle,
    scaling
}) => {
    return (
        <rect
            style={{pointerEvents: 'none'}}
            fill='transparent'
            stroke='grey'
            strokeWidth={1}
            x={rectangle.p1.x}
            y={rectangle.p1.y}
            width={rectangle.width()}
            height={rectangle.height()}
            />
    )
}

export default BoundsRectangle