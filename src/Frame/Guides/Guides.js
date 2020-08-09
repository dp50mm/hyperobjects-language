import React from 'react'
import styles from './guides.module.scss'
import GridLines from './GridLines'

const Guides = React.memo(({
    svgWidth,
    svgHeight,
    group_scale_transform,
    group_translate_transform,
    width,
    height,
    pan,
    zoom,
    showBounds,
    showGridLines,
    gridLinesUnit
}) => {
    return (
        <svg
            className={styles['guides-svg']}
            width={svgWidth}
            height={svgHeight}
            >
            <g transform={group_scale_transform}>
                <g transform={group_translate_transform}>
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
                </g>
            </g>
        </svg>
    )
})

export default Guides