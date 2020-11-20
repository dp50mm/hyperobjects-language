import { ender3header, testMoves, toTopFooter } from './codeBlocks'

import _ from 'lodash'

const ROUNDING = 3
const PRINT_SPEED = 1200 / 4
const MOVE_SPEED = 3000
const RETRACT_SPEED = 1600

const extrusionCoefficients = {
  thin: 1 / 30,
  medium: 1 / 25,
  thick: 1 / 20,
  superThick: 1 / 10
}

function GCode(_name = 'name') {
  const name = _name
  this.name = name
  this.gcodeSet = false
  this.layerHeight = 0.15
  this.zOffset = 0.1
  this.layerCount = 10
  this.firstLayerExtrusionCoefficient = extrusionCoefficients.superThick
  this.extrusionCoefficient = extrusionCoefficients.medium
  this.temperature = 230
  this.bedTemperature = 50
  this.firstLayerLinearMovePauseTime = 100
  this.linearMovePauseTime = 100
  this.currentPauseTimeAfterLinearMove = false // modified as layers are incrementing
  this.baseLayersSpeedCoefficient = 1
  this.baseLayers = 5
  this.speedCoefficient = 1
  this.moveSpeed = MOVE_SPEED * this.speedCoefficient
  this.printSpeed = PRINT_SPEED * this.speedCoefficient
  this.header = ender3header(this)
  this.footer = toTopFooter
  this.movesGCode = testMoves
  this.moves = []
  this.generators = {}
  this.generatorKeys = []
  this.addGenerator = function (name, generator) {
    // functions that are called to generate the print moves
    this.generators[name] = generator
    this.generatorKeys.push(name)
  }
  this._layerCounter = 0
  this.generate = (model) => {
    let moves = this.moves.slice()
    let movesWithGeneratorMoves = moves.slice()
    this.generatorKeys.forEach(key => {
      let generatorMoves = this.generators[key](model)
      if(_.isArray(generatorMoves)) {
        generatorMoves = _.flatten(generatorMoves)
      }
      movesWithGeneratorMoves = movesWithGeneratorMoves.concat(generatorMoves)
    })
    
    if (this.gcodeSet === false ) {
      return 'no gcode set for this model'
    }
    this.header = ender3header(this)
    let movesGcode = ''
    this.currentPauseTimeAfterLinearMove = this.firstLayerLinearMovePauseTime
    // adding priming paths to get the material flow going
    movesGcode = this.layerIncrement(0)
    movesGcode += this.linearMove({ x: 5, y: 20 })
    movesGcode += this.linearPrintMove({ x: 5, y: 1 }, { x: 100, y: 20 })
    movesGcode += this.linearPrintMove({ x: 100, y: 20 }, { x: 100, y: 21 })
    movesGcode += this.linearPrintMove({ x: 100, y: 21 }, { x: 5, y: 21 })
    movesGcode += this.linearPrintMove({ x: 5, y: 21 }, { x: 5, y: 22 })
    movesGcode += this.linearPrintMove({ x: 5, y: 22 }, { x: 100, y: 22 })
    _.range(this.layerCount).forEach((layer) => {
      this._layerCounter = layer
      this.moveSpeed = MOVE_SPEED * this.speedCoefficient
      this.printSpeed = PRINT_SPEED * this.speedCoefficient
      if(layer < this.baseLayers) {
        this.printSpeed *= this.baseLayersSpeedCoefficient
      }
      if(layer <= 2) {
        this.currentPauseTimeAfterLinearMove = this.firstLayerLinearMovePauseTime
      } else {
        this.currentPauseTimeAfterLinearMove = this.linearMovePauseTime
      }
      movesGcode += this.layerIncrement(layer)
      movesWithGeneratorMoves.forEach((move) => {
        if(layer >= move.layerRange[0] && layer <= move.layerRange[1]) {
          move.geometry.points.forEach((p, i, a) => {
            if(i === 0) {
              // first point just move to point
              // TODO: add retraction
              movesGcode += this.linearMove(p)
            } else if(i === a.length -1) {
              // last point
              movesGcode += this.linearPrintMove(a[i-1], p)
              // if geometry is a closed path add move back to first point
              if(move.geometry.closedPath) {
                movesGcode += this.linearPrintMove(p, a[0])
              }
              // TODO: add retraction move
            } else {
              // for all other points move to the point
              movesGcode += this.linearPrintMove(a[i-1], p)
            }
          })
        }
      })
    })
    return this.header + movesGcode + this.footer
  }
  this.initialize = (layers, settings) => {
    this.moves = []
    this.extrusion = 0
    this._layerCounter = 0
    this.layerCount = layers ? layers : 10
    this.layers = _.range(this.layerCount)
    this.extrusionCoefficient = _.get(settings, 'extrusionCoefficient', this.extrusionCoefficient)
    this.temperature = _.get(settings, 'temperature', this.temperature)
    this.bedTemperature = _.get(settings, 'bedTemperature', this.bedTemperature)
    this.linearMovePauseTime = _.get(settings, 'linearMovePauseTime', this.linearMovePauseTime)
    this.firstLayerLinearMovePauseTime = _.get(settings, 'firstLayerLinearMovePauseTime', this.firstLayerLinearMovePauseTime)
    this.baseLayersSpeedCoefficient = _.get(settings, 'baseLayersSpeedCoefficient', this.baseLayersSpeedCoefficient)
    this.speedCoefficient = _.get(settings, 'speedCoefficient', this.speedCoefficient)
    this.gcodeSet = true
  }

  this.addMove = function(move) {
    this.moves.push(move)
  }

  /**
   * GCode generator functions
   */
  this.layerIncrement = (layer) => {
    return `G0 Z${(layer*this.layerHeight + this.zOffset).toFixed(ROUNDING)} ;layer: ${layer}
M117 layer ${layer}/${this.layerCount};
`
  }
  this.linearMove = (p) => {
    let retraction = 5
    return `G1 F${RETRACT_SPEED} E${this.extrusion.toFixed(ROUNDING) - retraction}
G0 X${p.x.toFixed(ROUNDING)} Y${p.y.toFixed(ROUNDING)} F${this.moveSpeed}
G1 F${RETRACT_SPEED} E${this.extrusion.toFixed(ROUNDING)}
G4 P${this.currentPauseTimeAfterLinearMove}
`;
  }
  this.linearPrintMove = (currentPoint, nextPoint) => {
    let coefficient = this.extrusionCoefficient
    if(this._layerCounter <= 1) {
      coefficient = this.firstLayerExtrusionCoefficient
    }
    this.extrusion += distance(currentPoint, nextPoint) * coefficient
    return `G1 X${nextPoint.x.toFixed(ROUNDING)} Y${nextPoint.y.toFixed(ROUNDING)} F${this.printSpeed} E${this.extrusion.toFixed(ROUNDING)}
`
  }
}

function distance(p1, p2) {
  return Math.sqrt((p1.x-p2.x) * (p1.x-p2.x) + (p1.y-p2.y) * (p1.y-p2.y));
}

export default GCode
