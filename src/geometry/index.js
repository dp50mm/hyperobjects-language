import _Model from './Model'
import _Group from './Group'
import _Path from './Path'
import _Segment from './path/Segment'
import _Polygon from './Polygon'
import _Point from './Point'
import _Text from './Text'
import _Circle from './shapes/Circle'
import _Rectangle from './shapes/Rectangle'
import _HexPattern from './shapes/HexPattern'

export var Model = _Model
export var Group = _Group
export var Path = _Path
export var Segment = _Segment
export var Polygon = _Polygon
export var Point = _Point
export var Text = _Text
export var Circle = _Circle
export var Rectangle = _Rectangle
export var HexPattern = _HexPattern

const geometry = {
  model: _Model,
  group: _Group,
  path: _Path,
  segment: _Segment,
  polygon: _Polygon,
  point: _Point,
  text: _Text,
  hexPattern: _HexPattern
}

export default geometry
