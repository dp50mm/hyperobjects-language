import TextToSvg from "text-to-svg"
import React from 'react'
import _ from "lodash"

var futuraTextToPath = false
var monospaceTextToPath = false

function setTextToSvg(err, text, target) {
  if(err) {
    console.log("text load error: ", err)
  }
  target = text
  return target
}

TextToSvg.load("/fonts/Futura-Medium.otf", (err, text) => { futuraTextToPath = setTextToSvg(err, text, futuraTextToPath) })
TextToSvg.load("/fonts/monospace.ttf", (err, text) => { monospaceTextToPath = setTextToSvg(err, text, monospaceTextToPath) })

const Text = ({geometry, modelDispatch}) => {
  const attributes = {
    fontSize: geometry._fontSize/2,
    textAnchor: geometry._textAnchor
  }
  var pathData = ""
  if(geometry._fontFamily === "custom-monospace") {
    if(monospaceTextToPath) {
      pathData = monospaceTextToPath.getD(geometry.text, attributes)
    }
  } else {
    if(futuraTextToPath) {
      pathData = futuraTextToPath.getD(geometry.text, attributes)
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
