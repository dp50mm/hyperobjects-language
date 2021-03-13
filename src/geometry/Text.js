import Geometry from './Geometry'
import Styling from './Styling'
import { TEXT } from './types'

function Text(text, point, name) {
  Geometry.call(this, [point], name)
  Styling.call(this, [point], name)
  this._fillOpacity = 1
  this._fill = "black"
  this._strokeOpacity = 0
  this._stroke = "transparent"
  this.type = TEXT
  this.x = 0
  this.y = 0
  this.z = 0
  if(point) {
    if(point.x) {
      this.x = point.x
    }
    if(point.y) {
      this.y = point.y
    }
    if(point.z) {
      this.z = point.z
    }
  }
  this.text = " "
  this.multiLine = false
  if(text) {
    this.text = text
    if(Array.isArray(text)) {
      this.multiLine = true
    }
  }
  this._fontSize = 24
  this._lineHeight = 20
  this.fontSize = (size, lineHeight) => {
    this._fontSize = size
    lineHeight ? this._lineHeight = lineHeight : this._lineHeight = size + size * 1/2
    return this
  }
  this._fontWeight = 'normal'
  this.fontWeight = (weight) => {
    this._fontWeight = weight
    return this
  }
  this._textAnchor = 'start'
  this.textAnchor = (anchor) => {
    this._textAnchor = anchor
    return this
  }
  this._alignmentBaseline = 'bottom'
  this.alignmentBaseline = (alignment) => {
    this._alignmentBaseline = alignment
    return this
  }

  this._fontFamily = "Europa"

  this._rotation = 0

  this.rotation = (_rotation) => {
    this._rotation = _rotation
    return this
  }

  this.translate = (translation) => {
    this.x += _.get(translation, 'x', 0)
    this.y += _.get(translation, 'y', 0)
    this.z += _.get(translation, 'z', 0)
    return this
  }

  this.rotate = (rotation, anchor={x:0, y: 0}, axis='z') => {
    const rotatedPoint = {
      x: ((this.x - anchor.x) * Math.cos(rotation) - (this.y - anchor.y) * Math.sin(rotation)) + anchor.x,
      y: ((this.x - anchor.x) * Math.sin(rotation) + (this.y - anchor.y) * Math.cos(rotation)) + anchor.y
    }
    this.x = rotatedPoint.x
    this.y = rotatedPoint.y
    return this
  }
}

Text.type = TEXT

export default Text
