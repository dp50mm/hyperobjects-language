import React from 'react'
import './guides.scss'
import GridLines from './GridLines'
import chroma from "chroma-js"

function isColor(strColor){
    var s = new Option().style;
    s.color = strColor;
    return s.color == strColor;
}

const Guides = React.memo(({
    modelBackground,
    svgWidth,
    svgHeight,
    group_scale_transform,
    group_translate_transform,
    width,
    height,
    transformMatrix,
    showBounds,
    showGridLines,
    gridLinesUnit,
    showTicks
}) => {
    var colorString = modelBackground == "transparent" ? "rgba(255,255,255,0)" : modelBackground
    var bgColor = chroma("rgba(255,255,255,0)")
    if(isColor(colorString)) {
        bgColor = chroma(colorString)
    }
    var gridColor = "rgba(0,0,0,0.6)"
    if(bgColor.luminance() < 0.5) {
        gridColor = "white"
    }
    return (
        <svg
            className="guides-svg"
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
                                className="model-bounds"
                                stroke={gridColor}
                                strokeWidth={1 / transformMatrix.scaleX}
                                />
                        )}
                        {showGridLines && (
                            <GridLines
                                width={width}
                                height={height}
                                transformMatrix={transformMatrix}
                                gridLinesUnit={gridLinesUnit}
                                showTicks={showTicks}
                                gridColor={gridColor}
                                />
                        )}
                    </g>    
                </g>
            </g>
        </svg>
    )
})

export default Guides