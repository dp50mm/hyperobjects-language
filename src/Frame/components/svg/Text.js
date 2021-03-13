import TextToSvg from "text-to-svg"
import React from 'react'
import _ from "lodash"
var textToSvg = false

function setTextToSvg(err, text) {
  if(err) {
    console.log("text load error: ", err)
  }
  textToSvg = text
}

TextToSvg.load("/fonts/Futura-Medium.otf", setTextToSvg)

const Text = ({geometry, modelDispatch}) => {
  const attributes = {
    fontSize: geometry._fontSize/2,
    textAnchor: geometry._textAnchor
  }
  var pathData = ""
  if(textToSvg) {
    pathData = textToSvg.getD(geometry.text, attributes)
  }
  console.log(geometry._fontSize)
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
