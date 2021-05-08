import TextToSvg from "text-to-svg"
import React from 'react'
import _ from "lodash"
import { fonts } from "../../../assets/fonts"

export var fontPaths = {}

export function loadFont(fontfile) {
  TextToSvg.load(fontfile, (err, text) => {
    if(err) {
      console.log("loading font error: ",err)
    } else {
      fontPaths[fontfile] = text
    }
  })
}


fonts.forEach(font => {
  loadFont(font.file)
})

const Text = ({geometry, modelDispatch}) => {
  const attributes = {
    fontSize: geometry._fontSize/2,
    textAnchor: geometry._textAnchor
  }
  var pathData = ""
  if(_.find(fonts, p => p.name === geometry._fontFamily) !== undefined) {
    var font = _.find(fonts, p => p.name === geometry._fontFamily)
    if(_.has(fontPaths, font.file)) {
      pathData = fontPaths[font.file].getD(geometry.text, attributes)
    } else {
      loadFont(font.file)
    }
  }
  return (
    <g>
      {false && (
        <text
        x={geometry.x}
        y={geometry.y}
        fontSize={geometry._fontSize}
        textAnchor={geometry._textAnchor}
        fill={geometry._fill}
        fillOpacity={geometry._fillOpacity}
        fontFamily={`${geometry._fontFamily} Europa Helvetica`}
        >
      {geometry.text}
      </text>
      )}
      <g transform={`translate(${geometry.x}, ${geometry.y}) rotate(${_.get(geometry, "_rotation", 0) / Math.PI * 180})`}>
      <path
        d={pathData}
        fill={geometry._fill}
        fillOpacity={geometry._fillOpacity}
        stroke={geometry._stroke}
        strokeOpacity={geometry._strokeOpacity}
        />
      </g>
    </g>
  )
} 

export default Text
