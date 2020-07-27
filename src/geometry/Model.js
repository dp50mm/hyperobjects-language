import _ from 'lodash'
import {
  GROUP,
  PATH,
  TEXT
} from './types'
import Group from './Group'
import Path from './Path'
import Text from './Text'
import GCode from '../utils/gcode/gcode'

function Model(name, classes) {
  let modelName = "SET MODEL NAME"
  let modelCssClasses = ["default-model-class"]
  if(name !== undefined) {
    modelName = name
  } else {
    console.warn("No model name provided")
  }

  let gCodeGenerator = new GCode(modelName)
  if(classes !== undefined) {
    if(classes.isArray) {
      let string_check = true
      classes.forEach((cssClass) => {
        if(!_.isString(cssClass)) {
          string_check = false
        }
      })
      if(string_check) {
        modelCssClasses = classes
      } else {
        console.warn("Not all classes are an array")
      }
    } else if(_.isString(classes)) {
      modelCssClasses = [classes]
    } else {
      console.warn("provide either an array of strings, or a string value as second parameter")
    }

  } else {
    console.warn("No model css classes provided")
  }
  this.name = modelName
  this.cssClasses = modelCssClasses
  this.size = {
    width: 1000,
    height: 1000,
    depth: 0
  }
  this.exportResolution = false
  this.center = function() {
    return {
      x: this.size.width / 2,
      y: this.size.height / 2,
      z: this.size.depth / 2
    }
  }
  this.dimensions = 2
  this.background = 'transparent'
  this.animation_frame = 0
  this.animated = false
  this.playing = true
  this.autoplay = false
  this.loopAnimation = false
  this.startFrame = 0
  this.endFrame = 100
  this.workspaceFramePadding = 50
  this.draggingAPoint = false
  this.focussed = false
  this.geometries = {}
  this.procedures = {}
  this.editableGeometriesList = []
  this.staticGeometriesList = []
  this.displayGeometriesList = []
  this.proceduresList = []
  this.animations = {}
  this.animationsList = []
  this.views = {}
  this.viewsList = []
  this.exportAll = false
  this.imageExportScaling = 1
  this.gcode = gCodeGenerator
  this.procedureErrors = []
  this.generators = {
    path: Path,
    group: Group
  }
  this.setSize = function(dimensions) {
    this.size = {
      width: dimensions.width,
      height: dimensions.height
    };
    return this;
  };
  this.aspectRatio = () => {
    return this.size.height / this.size.width
  }
  this.sourceGeometriesAsArray = function() {
    let returnArray = [];
    for (var key in this.geometries) {
      returnArray.push(this.geometries[key]);
    }
    return returnArray;
  }
  this._displayGeometriesCache = []
  this._processingProcedures = false
  this.displayGeometries = function() {
    // Function should have a cache
    // Send the running of the procedures to a background
    // web Worker
    // When the web worker is running return the cached data
    // Keep track of the time the procedures take to run
    // Set that timing to a model prop so that it can be displayed in the frame
    if(this._processingProcedures === false) {
      this._processingProcedures = true
      this.procedureErrors = []
      this._displayGeometriesCache = this.proceduresList.map((name) => {
        try {
          return this.procedures[name](this);
        } catch (e) {
          this.procedureErrors.push(e)
          return false
        }

      }).filter(g => {
        if(g !== undefined || g === null) {
          return true
        }
        return false
      });
      this._processingProcedures = false
    }
    return this._displayGeometriesCache
  }
  /**
   * adds static geometries from a source JSON.
   * Converts the static objects to the dynamic ones
   * so that they can be manipulated using the functions
   * on the objects.
   */
  this.setGeometries = function(default_geometries) {
    this.geometries = {}
    for (var key in default_geometries) {
      switch(default_geometries[key].type) {
        case GROUP:
          this.geometries[key] = new Group(
            default_geometries[key].points,
            default_geometries[key].name,
            default_geometries[key]);
          break
        case PATH:
          this.geometries[key] = new Path(
            default_geometries[key].points,
            default_geometries[key].name,
            default_geometries[key]
          );
          break
        case TEXT:
          this.geometries[key] = new Text(
            default_geometries[key].text,
            default_geometries[key].point,
            default_geometries[key].name
          )
          break
        default:
          break
          // this.geometries[key] = default_geometries[key];
      }
    }
  }
  this.extractGeometries = function() {
    let output = {}
    for (var key in this.geometries) {
      output[key] = this.geometries[key].extract()
    }
    return output
  }
  this.extractProcedures = function() {
    let output = {}
    for (var key in this.procedures) {
      output[key] = this.procedures[key].toString()
    }
    return output
  }
  this.extractModel = function() {
    return {
      geometries: this.extractGeometries(),
      procedures: this.extractProcedures(),
      inputs: this.extractInputs()
    }
  }
  this.importModel = function(modelElements) {
    this.setGeometries(modelElements.geometries)
    this.editableGeometriesList = _.keys(modelElements.geometries)
    this.inputsList = _.keys(modelElements.inputs)
    this.importProcedures(modelElements.procedures)
  }
  this.importProcedures = function(inputProcedures) {
    let input = {}
    for (var key in inputProcedures) {
      let fnString = _.trim(inputProcedures[key])
      fnString = _.trimStart(fnString, 'self =>')
      fnString = _.trimStart(fnString, '{')
      fnString = _.trimEnd(fnString, '}')
      fnString = _.replace(fnString, 'lodash__WEBPACK_IMPORTED_MODULE_3___default.a', '_')
      fnString = _.replace(fnString, 'hyperobjects_language__WEBPACK_IMPORTED_MODULE_2__["Path"]', 'Path')
      input[key] = new Function('self', fnString)
    }
    this.procedures = input
  }
  this.staticGeometries = function() {
    return this.staticGeometriesList.map((name) => {
      return this.geometries[name]
    });
  }
  this.addEditableGeometry = function (name, geometry, type) {
    this.geometries[name] = geometry
    this.editableGeometriesList.push(name)
  }
  this.addStaticGeometry = function (name, geometry, type) {
    this.geometries[name] = geometry
    this.staticGeometriesList.push(name)
  }
  this.inputs = {}
  this.inputsList = []
  this.extractInputs = function() {
    return this.inputs
  }
  this.addInput = function(name, input) {
    this.inputs[name] = input
    this.inputsList.push(name)
  }
  /**
   * Adding a procedure
   * A procedure should be a function which returns a geometry or array of geometries.
   * All functions in the procedurelist are called when the displaygeometries function is called.
   */
   this.addProcedure = function(name, procedure, position) {
     this.procedures[name] = procedure
     if(position === 'before') {
       this.proceduresList.unshift(name)
     } else {
       this.proceduresList.push(name)
     }

   }
   this.editableGeometries = function() {
     return this.editableGeometriesList.map((name) => {
       return this.geometries[name]
     });
   }
   this.getGeometries = function(animation_frame) {
     if(animation_frame) {
       this.animation_frame = animation_frame
     }
     let editableGeometries = []

     let displayGeometriesOutput = []
     try {
       editableGeometries = this.editableGeometries()
       if(this.editableGeometriesVisible === false) {
         editableGeometries = []
       }

       displayGeometriesOutput = this.displayGeometries()
     } catch(err) {
       console.log(err)
     }

     let displayGeometries = _.flatten(displayGeometriesOutput)

     return {
       editableGeometries: editableGeometries,
       displayGeometries: displayGeometries
     }
   }
   this.addAnimation = function(name, procedure) {
     this.animations[name] = procedure
     this.animationsList.push(name)
   }
   this.runAnimations = function() {
     this.animationsList.forEach((animation) => {
       this.animations[animation](this)
     })
   }
}

export default Model
