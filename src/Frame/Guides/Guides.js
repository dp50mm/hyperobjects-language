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
    transformMatrix,
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
            <g transform={group_translate_transform}>
                <g transform={group_scale_transform}>
                    <g className='guides'>
                        {showBounds && (
                            <rect
                                width={width}
                                height={height}
                                className={styles['model-bounds']}
                                strokeWidth={1 / transformMatrix.scaleX}
                                />
                        )}
                        {showGridLines && (
                            <GridLines
                                width={width}
                                height={height}
                                transformMatrix={transformMatrix}
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