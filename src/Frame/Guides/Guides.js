import React from 'react'
import styles from './guides.module.scss'
import GridLines from './GridLines'

const Guides = React.memo(({
    width,
    height,
    pan,
    zoom,
    showBounds,
    showGridLines,
    gridLinesUnit
}) => {
    return (
        <g className='guides'>
            {showBounds && (
                <rect
                    width={width}
                    height={height}
                    className={styles['model-bounds']}
                    />
            )}
            {showGridLines && (
                <GridLines
                    width={width}
                    height={height}
                    pan={pan}
                    zoom={zoom}
                    gridLinesUnit={gridLinesUnit}
                    />
            )}
            
        </g>
    )
})

export default Guides