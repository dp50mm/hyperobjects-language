import _ from 'lodash'
import chroma from 'chroma-js'

let rgbText = 'rgb(100,0,0)'

let chromaObject = chroma(rgbText)

function Styling(attributes) {
  this.visibility = _.get(attributes, 'visibility', true)
  this._fill = _.get(attributes, '_fill', 'rgb(200,200,200)')
  this._fillChroma = {} // chroma(this._fill)
  this._fillOpacity = _.get(attributes, '_fillOpacity', 0.4)
  this._fillChroma.alpha = () => { return 0.5 } //(this._fillOpacity)
  this._stroke = _.get(attributes, "_stroke", 'black')
  this._strokeChroma = {} // chroma(this._stroke)
  this._strokeOpacity = _.get(attributes, "_strokeOpacity", 1)
  this._strokeChroma.alpha = () => { return 0.5 } //(this._strokeOpacity)
  this._strokeWidth = _.get(attributes, "_strokeWidth", 1)
  this._r = _.get(attributes, "_r", false)
  this._opacity = _.get(attributes, "_opacity", 1)
  this._strokeLinecap = _.get(attributes, "_strokeLinecap", 'butt')
  this._strokeLinejoin = _.get(attributes, "_strokeLinejoin", 'miter')
  this._showCoordinates = _.get(attributes, "_showCoordinates", false)
  this._shadowBlur = _.get(attributes, "_shadowBlur", 0)
  this._shadowColor = _.get(attributes, "_shadowColor", 'transparent')
  this._shadowOpacity = _.get(attributes, "_shadowOpacity", 1)
  this._shadowOffsetX = _.get(attributes, "_shadowOffsetX", 0)
  this._shadowOffsetY = _.get(attributes, "_shadowOffsetY", 0)
  this.controls = {
    fill: _.get(attributes, "controls.fill", 'black'),
    fillOpacity: _.get(attributes, "controls.fillOpacity", 0.1),
    stroke: _.get(attributes, "controls.stroke", 'black'),
    strokeOpacity: _.get(attributes, "controls.strokeOpacity", 0.5),
    strokeWidth: _.get(attributes, "controls.strokeWidth", 1)
  }
  this.showCoordinates = (showing) => {
    this._showCoordinates = showing
    return this
  }
  this.controlsFill = function(color) {
    this.controls.fill = color
    return this
  }
  this.controlsFillOpacity = function(opacity) {
    this.controls.fillOpacity = opacity
    return this
  }
  this.controlsStroke = function(color) {
    this.controls.stroke = color
    return this
  }
  this.controlsStrokeWidth = function(width) {
    this.controls.strokeWidth = width
    return this
  }
  this.controlsStrokeOpacity = function(opacity) {
    this.controls.strokeOpacity = opacity
    return this
  }
  this.fill = function(color) {
    this._fill = color;
    return this;
  }
  this.fillOpacity = function(opacity) {
    this._fillOpacity = opacity
    return this
  }
  this.stroke = function(color) {
    this._stroke = color;
    return this;
  }
  this.strokeOpacity = function(opacity) {
    this._strokeOpacity = opacity
    return this
  }
  this.strokeWidth = function(width) {
    this._strokeWidth = width;
    return this;
  }
  this.radius = function(radius) {
    this._r = radius;
    return this
  }
  this.r = function(radius) {
    this._r = radius;
    return this
  }
  this.radius = function(radius) {
    this._r = radius;
    return this
  }
  this.visible = function(visibility) {
    this.visibility = visibility
    return this
  }
  this.opacity = function(opacity) {
    this._opacity = opacity
    return this
  }
  this.strokeLinecap = (cap) => {
    this._strokeLinecap = cap
    return this
  }
  this.strokeLinejoin = (join) => {
    this._strokeLinejoin = join
    return this
  }

  this.shadowBlur = (blur) => {
    this._shadowBlur = blur
    return this
  }
  this.shadowColor = (color) => {
    this._shadowColor = color
    return this
  }
  this.shadowOpacity = (opacity) => {
    this._shadowOpacity = (opacity)
    return this
  }
  this.shadowOffsetX = (offset) => {
    this._shadowOffsetX = offset
    return this
  }
  this.shadowOffsetY = (offset) => {
    this._shadowOffsetY = offset
    return this
  }

  this.copyStyle = (g) => {
    // sets the styles to the styles from the provided geometry
    this._visibility = g._visibility
    this._fill = g._fill
    this._fillOpacity = g._fillOpacity
    this._stroke = g._stroke
    this._strokeOpacity = g._strokeOpacity
    this._strokeWidth = g._strokeWidth
    this._r = g._r
    this._opacity = g._opacity
    this._strokeLinecap = g._strokeLinecap
    this._shadowBlur = g._shadowBlur
    this._shadowColor = g._shadowColor
    this._shadowOpacity = g._shadowOpacity
    this._shadowOffsetX = g._shadowOffsetX
    this._shadowOffsetY = g._shadowOffsetY
    this.controls = {
      fill: g.controls.fill,
      fillOpacity: g.controls.fillOpacity,
      stroke: g.controls.stroke,
      strokeOpacity: g.controls.strokeOpacity,
      strokeWidth: g.controls.strokeWidth
    }
    return this
  }
}

export default Styling;
