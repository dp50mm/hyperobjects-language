import React, { Component } from 'react';
import './frame.scss'
import reducer from './reducer/index';
import Geometry from './components/Geometry';
import Inputs from './components/Inputs'
import {
  MOVE_POINT,
  STOP_DRAGGING,
  START_SELECTION,
  ANIMATE,
  PLAY,
  PAUSE,
  REWIND,
  SET_FRAME,
  INPUT_SET_VALUE,
  UPDATE_KEYS_PRESSED
} from './reducer/actionTypes';
import {actionCallbackMiddleware} from './actionsCallbackMiddleware'
import Controls from './controls/Controls'
import ZoomControls from './controls/ZoomControls'
import VectorExportMenu from './controls/VectorExportMenu'
import saveAs from './saveAs'
import ModelContext from './ModelContext'
import CanvasView from './CanvasView'
import Canvas3DView from './Canvas3DView'
import FrameRenderBar from './FrameRenderBar'
import EditPointPopUp from './EditPointPopUp'
import analytics from '../utils/analytics'
import _ from 'lodash'
import calculateSizing from './utils/calculateSizing'
import getKeysPressed, {
  keyDownEventListener,
  removeKeyEventListeners
} from './utils/keysPressed'
import Guides from './Guides'
import SelectBox from './components/SelectBox'
import Hammer from 'hammerjs'
import {
  handlePinch,
  touchStartForPinch,
  touchEndForPinch
} from './utils/touchEvents'
import {
  svgWheelZoom,
  fitFrameToContainer
} from "./utils/zoomEvents"
import { handleMouseMove, handleMouseUp } from './utils/mouseEvents';
import { fonts } from "../assets/fonts"
import isColor from "../utils/isColor"

var ua = window.navigator.userAgent;
var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
var webkit = !!ua.match(/WebKit/i);
var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

let svgIDCounter = 0;

let keysPressed = []
getKeysPressed((newKeys) => keysPressed = newKeys)

let frameModelStores = []
let frameModelRenderedGeometriesStores = []

export const FrameContext = React.createContext('frame')

function shouldRenderFrame(frameState) {
  return (frameModelStores[frameState.frameID].animation_frame >= frameState.startFrame
          && frameModelStores[frameState.frameID].animation_frame <= frameState.endFrame
          && frameState.render)
}


class Frame extends Component {
  constructor(props) {
    super(props);
    svgIDCounter += 1
    this.svgRef = React.createRef();
    this.designerRef = React.createRef();
    this.state = {
      modelHasUpdated: false,
      frameSelected: false,
      frameInFocus: false,
      render: false,
      startFrame: 0,
      endFrame: 5,
      renderScaling: 'screen',
      frameHasSaved: false,
      frameMouseMoveCounter: 0,
      keysPressedCounter: 0,
      keysPressed: [],
      mouseDown: false,
      mouse_select: false,
      draggingSelection: false,
      containerRendered: false,
      editingPoint: false,
      modelSpaceMouseCoords: {x: 0, y: 0},
      windowResizeIncrement: 0,
      panStart: {x: 0, y: 0},
      frameID: `frame-id-${svgIDCounter}`,
      svgID: `svg-id-${svgIDCounter}`,
      canvasID: `canvas-2d-id-${svgIDCounter}`,
      transformMatrix: {
        scaleX: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0,
        skewX: 0,
        skewY: 0,
      },
      svgWheelBlocked: false
    };
    analytics.initialize()
    this.playModel = this.playModel.bind(this)
    this.pauseModel = this.pauseModel.bind(this)
    this.rewindModel = this.rewindModel.bind(this)
    this.renderModel = this.renderModel.bind(this)
    this.setStartFrame = this.setStartFrame.bind(this)
    this.setEndFrame = this.setEndFrame.bind(this)
    this.svgOnMouseDown = this.svgOnMouseDown.bind(this)
    this.svgOnMouseUp = this.svgOnMouseUp.bind(this)
    this.svgOnWheel = this.svgOnWheel.bind(this)
    this.fitToFrame = this.fitToFrame.bind(this)
    this.moveToZero = this.moveToZero.bind(this)
    this.setEditingPoint = this.setEditingPoint.bind(this)
    this.startDraggingSelection = this.startDraggingSelection.bind(this)
    this.callUpdateParameters = this.callUpdateParameters.bind(this)
    this.setRenderScaling = this.setRenderScaling.bind(this)
    this.initializeHammerJs = this.initializeHammerJs.bind(this)
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
  }
  /**
   * Sizing function
   */
  sizing() {
    return calculateSizing(this.props, this.state, frameModelStores[this.state.frameID], this.designerRef)
  }
  /**
   * Component did mount
   */
  componentDidMount() {
    frameModelStores[this.state.frameID] = this.props.model
    if(this.props.model === undefined) {
      console.log('model is undefined');
      return
    }
    frameModelRenderedGeometriesStores[this.state.frameID] = this.props.model.displayGeometries()
    if(this.props.parameters) {
      frameModelStores[this.state.frameID].setGeometries(this.props.parameters)
    }
    if(this.props.updateParameters) {
      let extractedModel = frameModelStores[this.state.frameID].extractModel()
      this.props.updateParameters(extractedModel);
    }
    this.setState({
      containerRendered: false
    })
    document.addEventListener("mousemove", (e) => {
      this.mouseMove(e);
    });
    document.addEventListener('keydown', () => {
      setTimeout(function() {
        this.setState({
          keysPressedCounter: this.state.keysPressedCounter + 1,
          keysPressed: keysPressed
        })
        this.modelDispatch({
          type: UPDATE_KEYS_PRESSED,
          payload: keysPressed
        })
      }.bind(this), 1)
    })
    document.addEventListener('keyup', () => {
      setTimeout(function() {
        this.setState({
          keysPressedCounter: this.state.keysPressedCounter + 1,
          keysPressed: keysPressed
        })
        this.modelDispatch({
          type: UPDATE_KEYS_PRESSED,
          payload: keysPressed
        })
      }.bind(this), 1)
    })
    document.addEventListener("mouseup", (e) => {
      if(e.button === 0) {
        this.setState({
          mouseDown: false
        })
        if(frameModelStores[this.state.frameID].draggingAPoint) {
          this.modelDispatch({
            type: STOP_DRAGGING
          });
        }
      }
      
    });
    window.addEventListener("resize", () => {
      this.setState({
        zoom: this.props.height / this.props.model.size.height,
        windowResizeIncrement: this.state.windowResizeIncrement + 1
      })
    })
    
    window.addEventListener('wheel', (e) => {
        if(e.ctrlKey) { e.preventDefault() }
      }, {
        passive: false
      })
    if(this.props.model.animated && this.props.model.playing) {
      setTimeout(function () { this.animateModel(); }.bind(this), 10);
    }
    if(this.props.model.autoplay) {
      setTimeout(function () { this.playModel(); }.bind(this), 10);
    }
    setTimeout(function () {
      this.setState({
        containerRendered: true
      })
      this.fitToFrame()
      let size = this.sizing()
      this.props.sizeCallback(size)
    }.bind(this), 10);

    setTimeout(function() {
      this.initializeHammerJs()
    }.bind(this), 10)
  }


  /**
   * Initialize hammer js
   */
  initializeHammerJs() {
    if(!_.isNull(this.designerRef) && !_.isUndefined(this.designerRef)) {
      this.hammertime = new Hammer(this.designerRef.current)
      this.hammertime.get('pinch').set({enable: true})
      this.hammertime.on('pinch', (ev) => { handlePinch(ev, this) })
    } else {
      setTimeout(function() {
        this.initializeHammerJs()
      }.bind(this), 100 + Math.random() * 500)
    }
  }
  onTouchStart(e) {
    touchStartForPinch(e)
  }
  onTouchEnd(e) {
    touchEndForPinch(e)
  }

  /**
   * Get derived state from props
   */
  static getDerivedStateFromProps(props, state) {
    if(props.modelHasUpdated) {
      frameModelStores[state.frameID] = props.model
      frameModelRenderedGeometriesStores[state.frameID] = props.model.displayGeometries()
      return { ...state, modelHasUpdated: true }
    }
    return { ...state, modelHasUpdated: false }
  }

  /**
   * Fit to frame
   */
  fitToFrame() { fitFrameToContainer(this) }

  /**
   * Move to zero
   */
  moveToZero() {
    this.setState({
      transformMatrix:{
        ...this.state.transformMatrix,
        translateX: 0,
        translateY: 0
      }
    })
    setTimeout(() => {
      this.setState({
        windowResizeIncrement: this.state.windowResizeIncrement + 1
      })
    })
  }

  /**
   * Animate model
   */
  animateModel() {
    let fps = this.props.animationFps
    if(shouldRenderFrame(this.state)) {
      fps = this.props.renderFps
    }
    if(frameModelStores[this.state.frameID].playing) {
      if(shouldRenderFrame(this.state)) {
          if(this.props.renderType === "SVG") {
            // SvgToPng.saveSvgAsPng(
            //   document.getElementById(this.state.svgID+'-export'),
            //   `${frameModelStores[this.state.frameID].name}-frame-${String(frameModelStores[this.state.frameID].animation_frame).padStart(6, '0')}`
            // );
          } else if(this.props.renderType === "CANVAS") {
            var canvas = document.getElementById(this.state.canvasID);
            if(this.state.renderScaling === 'model') {
              canvas = document.getElementById(`model-scale-render-canvas-${this.state.canvasID}`)
            }
            var name = `${frameModelStores[this.state.frameID].name}-frame-${String(frameModelStores[this.state.frameID].animation_frame).padStart(6, '0')}`
            // draw to canvas...

            canvas.toBlob(blob => {
              saveAs(blob, name, () => {
                this.modelDispatch({
                  type: ANIMATE
                });
                setTimeout(function () {
                  this.animateModel();
                }.bind(this), fps);
              })

            })
          }

      } else if(this.state.render && frameModelStores[this.state.frameID].animation_frame > this.state.endFrame) {
        this.pauseModel()
      } else {
        this.modelDispatch({
          type: ANIMATE
        });
        setTimeout(function () {
          this.animateModel();
        }.bind(this), fps);
      }

    }
  }
  modelDispatch(action) {
    /**
     * DEBUG
     * for some reason the model returns setter functions
     * at some moments
     */
    if(this.props.logModelDispatch) {
      console.log(action)
    }
    let shouldcallUpdateParameters = action.type === STOP_DRAGGING && frameModelStores[this.state.frameID].draggingAPoint
    if(action.type === INPUT_SET_VALUE) {
      shouldcallUpdateParameters = true
    }
    actionCallbackMiddleware(frameModelStores[this.state.frameID], action, this.props.actionsCallback)
    try {
      if(this.state.frameMouseMoveCounter % this.props.procedureUpdateIntervalOnMouseMove === 0) {
        frameModelStores[this.state.frameID] = reducer(frameModelStores[this.state.frameID], action)
        frameModelRenderedGeometriesStores[this.state.frameID] = frameModelStores[this.state.frameID].displayGeometries()
        this.setState({
          frameMouseMoveCounter: this.state.frameMouseMoveCounter + 1
        });
      } else {
        frameModelStores[this.state.frameID] = reducer(frameModelStores[this.state.frameID], action)
        this.setState({
          frameMouseMoveCounter: this.state.frameMouseMoveCounter + 1
        });
      }
      if(this.props.logModelState) {
        console.log(frameModelStores[this.state.frameID])
      }
      if(action.type !== MOVE_POINT) {
        analytics.event(`model dispatch: ${action.type}`, "Frame", frameModelStores[this.state.frameID].name)
      }
    } catch(e) { }
    if(shouldcallUpdateParameters) {
      this.callUpdateParameters()
    }
  }
  callUpdateParameters() {
    if(this.props.updateParameters) {
      // console.log('model dispatch update parameters ', action)
      try {
          let extractedModel = frameModelStores[this.state.frameID].extractModel()
          this.props.updateParameters(extractedModel);
      } catch(e) {

      }
    }
  }
  /**
   * Play pause rewind model
   */
  playModel() {
    if(frameModelStores[this.state.frameID].animated) {
      if(frameModelStores[this.state.frameID].playing) {
        console.log('model is already playing');
      } else {
        this.modelDispatch({  type: PLAY })
        setTimeout(function () {
          this.animateModel()
        }.bind(this), 10);
      }
    } else {
      console.log('model is not animated');
    }
  }
  pauseModel() {
    this.setState({  render: false  })
    this.modelDispatch({  type: PAUSE  })
  }
  rewindModel() {
    this.setState({  render: false  })
    this.modelDispatch({  type: REWIND  })
  }

  /**
   * Render model animation frames
   */
  renderModel() {
    if (frameModelStores[this.state.frameID].animation_frame < this.state.startFrame) {
      this.modelDispatch({
        type: SET_FRAME,
        payload: parseInt(this.state.startFrame)
      })
    }
    this.setState({
      render: true
    })
    this.playModel()
  }
  
  /**
   * Set start frame for rendering 
   */
  setStartFrame(frameNr) {
    this.setState({
      startFrame: frameNr
    })
  }
  
  /**
   * Set end frame for rendering
   */
  setEndFrame(frameNr) {
    this.setState({
      endFrame: frameNr
    })
  }

  /**
   * Set render scaling to determine if model exports to the current zoom/pan or model size.
   */
  setRenderScaling(renderScaling) {
    this.setState({
      renderScaling: renderScaling
    })
  }


  getMouseCoords = (e) => {
    if(this.svgRef.current !== null) {
      const svgCoords = this.svgRef.current.getBoundingClientRect();
      let x = Math.round(e.pageX - svgCoords.left - window.scrollX);
      let y = Math.round(e.pageY - svgCoords.top - window.scrollY);
      return {x, y};
    } else {
      return false;
    }

  }

  /**
   * SVG Mouse move
   * function dispatches actions for dragging points and selections
   */
  mouseMove(e) { handleMouseMove(this, e, frameModelStores, keysPressed) }

  /**
   * Handle mouse up event
   */
  svgOnMouseUp(e) { handleMouseUp(this, e, frameModelStores, keysPressed) }


  getAlgorithmScaling() {
    return {
      x: this.state.zoom,
      y: this.state.zoom
    }
  }
  svgOnMouseDown(e) {
    const panning = keysPressed.includes('Space')
    if(e.target.nodeName === 'svg' && e.button === 0) {
      let mouse_coords = this.getMouseCoords(e);
      if(mouse_coords) {
        if(panning) {
          this.setState({
            mouseDown: true,
            panStart: {
              x: this.state.transformMatrix.translateX,
              y: this.state.transformMatrix.translateY
            },
            mouseDownPoint: mouse_coords
          })
        } else {
          this.setState({
            mouseDown: true,
            mouseDownPoint: mouse_coords
          })
          this.modelDispatch({
            type: START_SELECTION
          })
        }
        
      }
      e.preventDefault()
    }
  }

  startDraggingSelection(e) {
    let mouse_coords = this.getMouseCoords(e)
    this.setState({
      mouseDown: true,
      mouseDownPoint: mouse_coords,
      draggingSelection: true
    })
  }

  setEditingPoint(point) {
    this.setState({ editingPoint: point })
  }
  blocksvgWheelEvent() {
    if(this.state.svgWheelBlocked === false) {
      if(this.svgRef.current !== undefined) {
        this.svgRef.current.addEventListener(
          "wheel",
          function(e) {
            svgWheelZoom(this, e, keysPressed, this.props.zoomDomain)
            e.preventDefault()
          }.bind(this)
        )
        this.setState({
          svgWheelBlocked: true
        })
      }
    }
  }
  svgOnWheel(e) {
    this.blocksvgWheelEvent()
    svgWheelZoom(this, e, keysPressed, this.props.zoomDomain)
  }

  render() {
    if(!frameModelStores[this.state.frameID]) return (<div></div>)
    
    let panning = keysPressed.includes('Space')
    
    // if parameters is true the model should
    var model = this.props.fromParameters ? this.props.model : frameModelStores[this.state.frameID];
    
    let editPoint = false
    if(this.state.editingPoint) {
      let editPointGeometryKey = _.get(this.state, 'editingPoint.geometry_key', false)
      if(editPointGeometryKey) {
        editPoint = _.find(model.geometries[editPointGeometryKey].points, p => p.id === this.state.editingPoint.point_id)
      }
    }
    let size = this.sizing()
    let algorithm_scaling = {
      x: this.state.transformMatrix.scaleX,
      y: this.state.transformMatrix.scaleY
    }
    let editableGeometries = [];
    let staticGeometries = [];
    try {
      editableGeometries = model.editableGeometries();
      if(model.editableGeometriesVisible === false) {
        editableGeometries = [];
      }
      staticGeometries = model.staticGeometries();
    } catch(err) {
      console.log(err);
    }
    /**
     * Flatten the displaygeometries output
     * Should be implemented in the model object output
     */
    let displayGeometries = _.flatten(frameModelRenderedGeometriesStores[this.state.frameID])
    let focussedTitle = (
      <div></div>
    );
    let focussedStyle = {};
    let group_scale_transform = `scale(${algorithm_scaling.x}, ${algorithm_scaling.y})`;
    let svgStyle = {
      opacity: 1,
      zIndex: 2,
      position: 'relative',
      cursor: model.cursor
    }

    if(this.state.keysPressed.includes('Control')) svgStyle.cursor = 'zoom-in'
    if(panning) {
      svgStyle.cursor = 'grab'
    }
    let group_translate_transform = `translate(${this.state.transformMatrix.translateX}, ${this.state.transformMatrix.translateY})`

    var bgColor = "rgba(255,255,255, 0)"
    if(model.background === "transparent") {
      bgColor = "rgba(255,255,255, 0)"
    } else if(isColor(model.background)) {
      bgColor = model.background
    }
    let canvasContainerStyle = {
      opacity: 1,
      position: 'absolute',
      background: bgColor,
      top: this.props.svgPadding,
      zIndex: 1,
      pointerEvents: 'none'
    }

    let canvas3DContainerStyle = {
      padding: this.props.svgPadding,
      background: bgColor
    }
    if(this.state.containerRendered === false) {
      svgStyle = {
        opacity: 0
      }
      canvasContainerStyle.opacity = 0
    }
    return (
      <div  style={focussedStyle} className={'hyperobject-frame'}>
        {model.procedureErrors.length > 0 ? (
          <div className='procedure-errors-box'>
          <p>Model contains procedure errors:</p>
          {model.procedureErrors.map((error, i) => {
            return (
              <div key={i} className='procedure-error'>
               <p>{error.message} <span style={{color: 'yellow'}}>:{error.lineNumber}</span></p>
              </div>
            )
          })}
          </div>
        ) : null}
        <FrameContext.Provider value={{startDraggingSelection: this.startDraggingSelection}}>
          <ModelContext.Provider value={model}>
            <Controls
              model={model}
              frame={this}
              editableGeometries={editableGeometries}
              displayGeometries={displayGeometries}
              />
            {this.props.showZoomControls && (
              <ZoomControls
                fitToFrame={this.fitToFrame}
                moveToZero={this.moveToZero}
                />
            )}
            {this.props.vectorExportMenu && (
              <VectorExportMenu
                />
            )}
            {(this.props.showInputsByDefault && model.inputsList.length > 0) && (
              <Inputs modelDispatch={this.modelDispatch.bind(this)} />
            )}
            {focussedTitle}
            {this.state.frameInFocus && (
              <div
                style={{
                  position: 'absolute',
                  zIndex: 100,
                  cursor: 'pointer',
                  opacity: 0.5,
                  top: 5,
                  right: 5,
                  background: 'rgb(245,245,245)',
                  borderRadius: 4,
                  padding: 5,
                  pointerEvents: "auto"
                }}
                onClick={() => {
                  removeKeyEventListeners()
                }}
                >
                Frame focussed
              </div>
            )}
            {model.dimensions === 2 ? (
              <div className='svg-container'
                style={{padding: this.props.svgPadding, background: bgColor}}
                onClick={() => {
                  this.setState({
                    frameInFocus: true
                  })
                }}
                onPointerEnter={() => {
                  this.blocksvgWheelEvent()
                  this.setState({
                    frameInFocus: true
                  })
                  getKeysPressed((newKeys) => keysPressed = newKeys, {
                    blockSpace: true
                  })
                }}
                onPointerLeave={() => {
                  this.setState({
                    frameInFocus: false
                  })
                  this.modelDispatch({ type: MOVE_POINT,
                    payload: { x: false, y: false, model: model, mouseDown: this.state.mouseDown }
                  })
                  keysPressed = []
                  getKeysPressed((newKeys) => keysPressed = newKeys, {
                    blockSpace: false
                  })
                }}
                >
                  
                {editPoint && (
                  <EditPointPopUp
                    editPoint={editPoint}
                    setEditingPoint={this.setEditingPoint}
                    transformMatrix={this.state.transformMatrix}
                    modelDispatch={this.modelDispatch.bind(this)}
                    callUpdateParameters={this.callUpdateParameters}
                    
                    />
                )}
                <div ref={this.designerRef} style={{overflow: 'hidden'}}
                    onTouchStart={this.onTouchStart}
                    onTouchEnd={this.onTouchEnd}
                    >
                    <Guides
                      svgWidth={this.props.width}
                      svgHeight={size.height}
                      group_scale_transform={group_scale_transform}
                      group_translate_transform={group_translate_transform}
                      width={model.size.width}
                      height={model.size.height}
                      transformMatrix={this.state.transformMatrix}
                      showBounds={this.props.showBounds}
                      showGridLines={this.props.showGridLines && model.showGuides}
                      showTicks={model.showGuideTickLabels}
                      gridLinesUnit={model.unit}
                      modelBackground={bgColor}
                      />
                    <svg
                      id={this.state.svgID}
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      style={svgStyle}
                      ref={this.svgRef}
                      onMouseDown={this.svgOnMouseDown}
                      onTouchEnd={this.svgOnTouchEnd}
                      onMouseUp={this.svgOnMouseUp} 
                      onWheel={this.svgOnWheel}
                      width={this.props.width}
                      height={size.height}>
                        {(this.state.mouse_select && !this.state.draggingSelection) && (
                          <SelectBox
                            mouseDownPoint={this.state.mouseDownPoint}
                            mouseSelect={this.state.mouse_select}
                            />
                        )}
                    <g transform={group_translate_transform}>
                      <g transform={group_scale_transform}>
                          {this.props.renderType === 'SVG' ? (
                            <g className='display-geometries'>
                            {displayGeometries.map((geometry, i) => {
                              return (
                                <Geometry
                                  key={i}
                                  geometry={{...geometry, editable: false}}
                                  scaling={algorithm_scaling}
                                  onGeometryClickCallback={this.props.onGeometryClickCallback}
                                  onPointClickCallback={this.props.onPointClickCallback}
                                  selectingPoints={model.selectingPoints}
                                  />
                              );
                            })}
                            </g>
                          ) : null}
                          <g className='editable-geometries'>
                          {editableGeometries.map((geometry) => {
                            if(geometry !== undefined && geometry.visibility) {
                              return (
                                <Geometry
                                  scaling={algorithm_scaling}
                                  modelDispatch={this.modelDispatch.bind(this)}
                                  setEditingPoint={this.setEditingPoint}
                                  key={geometry.id}
                                  onGeometryClickCallback={this.props.onGeometryClickCallback}
                                  onPointClickCallback={this.props.onPointClickCallback}
                                  geometry={{...geometry, editable: this.props.editable}}
                                  showPointCoordinates={this.props.showPointCoordinates}
                                  selectingPoints={model.selectingPoints}
                                  startDraggingSelection={this.startDraggingSelection}
                                  modelHasUpdated={this.props.modelHasUpdated}
                                  modelSpaceMouseCoords={this.state.modelSpaceMouseCoords}
                                  />
                              );
                            }
                            return null
                          })}
                          </g>
                        </g>
                      </g>
                    </svg>
                    {this.props.renderType === 'CANVAS' ? (
                      <div style={canvasContainerStyle}>
                        <CanvasView
                          model={model}
                          shouldRenderFrame={shouldRenderFrame(this.state)}
                          editable={this.props.editable}
                          animated={model.animated}
                          playing={model.playing}
                          canvasID={this.state.canvasID}
                          background={bgColor}
                          width={this.props.width}
                          height={size.height}
                          renderScaling={this.state.renderScaling}
                          transformMatrix={this.state.transformMatrix}
                          geometries={staticGeometries.concat(displayGeometries)}
                          />
                      </div>
                    ) : null}


                </div>
              </div>
            ) : null}
            {model.dimensions === 3 ? (
              <div style={canvas3DContainerStyle}>
                <Canvas3DView
                  width={size.width}
                  height={size.height}
                  editableGeometries={editableGeometries}
                  displayGeometries={staticGeometries.concat(displayGeometries)}
                  canvasID={this.props.canvasID}
                  backgroundColor={bgColor}
                  />
              </div>
            ) : null}
          </ModelContext.Provider>
        </FrameContext.Provider>
        {this.state.render ? (
            <FrameRenderBar
              size={size}
              state={this.state}
              model={frameModelStores[this.state.frameID]}
              /> 
        ) : null}
        <style>
          {`@font-face {
            font-family: 'custom-monospace';
            src: url(fonts/monospace.ttf);
          }
          ${fonts.map(font => {
            return `
            @font-face {
              font-family: "${font.name}";
              src: url(${font.file});
            }
            `}).join("")}`}
        </style>
      </div>
    );
  }
}



Frame.defaultProps = {
  svgID: `svg-id-${svgIDCounter}`,
  canvasID: `canvas-id-${svgIDCounter}`,
  width: 200,
  height: 200,
  fitInContainer: true,
  maintainAspectRatio: true,
  updateZoomOnResize: true,
  fromParameters: false,
  updateParameters: false,
  maintainCameraPosition: false,
  sizeCallback: () => {},
  onClickCallback: () => {},
  onPointClickCallback: false,
  onGeometryClickCallback: false,
  actionsCallback: () => {},
  editable: false,
  animationControls: false,
  renderControls: false,
  exportControls: false,
  exportTypes: false,
  vectorExportMenu: false,
  svgPadding: 0,
  scaleToContainer: false,
  showProcedureErrors: false,
  renderType: 'CANVAS',
  showInputsByDefault: true,
  logModelDispatch: false,
  logModelState: false,
  logMouseMove: false,
  showBounds: false,
  showGridLines: false,
  gridLinesUnit: 'mm',
  showZoomControls: false,
  showPointCoordinates: false,
  procedureUpdateIntervalOnMouseMove: 1,
  animationFps: 1000/60,
  renderFps: 1000/30,
  zoomDomain: [1/20, 20]
}

export default Frame;
