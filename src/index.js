import _Frame from './Frame'
import _Model from './geometry/Model'
import _Point from './geometry/Point'
import _Group from './geometry/Group'
import _Path from './geometry/Path'
import _Segment from './geometry/path/Segment'
import _Polygon from './geometry/Polygon'
import _Line from "./geometry/Line"
import _Text from './geometry/Text'
import _Input from './geometry/Input'
import _InputText from './geometry/InputText'
import _Rectangle from './geometry/shapes/Rectangle'
import _Circle from './geometry/shapes/Circle'
import _HexPattern from './geometry/shapes/HexPattern'
import _Voronoi from './geometry/shapes/Voronoi'
import Assets from './assets/assets'
import {
    hyperobjectsLanguageWrapper as _hyperobjectsLanguageWrapper,
    executeCode as _executeCode
} from './utils/codeExecution'
import {
    EasingFunctions as _EasingFunctions,
    animate as _animate
  } from './utils/animation'

import chroma from 'chroma-js'

import _ from 'lodash'

import * as ogl from 'ogl'
import * as d3 from "d3"


export const Frame = _Frame

export const Model = _Model
export const Group = _Group
export const Point = _Point
export const Path = _Path
export const Segment = _Segment
export const Polygon = _Polygon
export const Line = _Line
export const Text = _Text
export const Input = _Input
export const InputText = _InputText
export const Rectangle = _Rectangle
export const Circle = _Circle
export const HexPattern = _HexPattern
export const Voronoi = _Voronoi

export const hyperobjectsLanguageWrapper = _hyperobjectsLanguageWrapper
export const executeCode = _executeCode

export function setupCodeExecution() {
    // Function to set up necessary variables for code execution
    window.HYPEROBJECTS = {
        Model: Model,
        Group: Group,
        Path: Path,
        Segment: Segment,
        Line: Line,
        Text: Text,
        Point: Point,
        Input: Input,
        InputText: InputText,
        shapes: {
          Rectangle: Rectangle,
          Circle: Circle,
          HexPattern: HexPattern,
          Voronoi: Voronoi
        },
        lodash: _,
        animate: _animate,
        EasingFunctions: _EasingFunctions,
        EXTRA_LIBRARIES: {
          ogl: ogl,
          chroma: chroma,
          d3: d3
        }
      }
}