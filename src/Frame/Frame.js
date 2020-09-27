import React, { Component } from 'react';
import styles from './frame.module.css';
import reducer from './reducer/index';
import Geometry from './components/Geometry';
import { Rectangle } from '../geometry'
import Inputs from './components/Inputs'
import {
  MOVE_POINT,
  STOP_DRAGGING,
  START_SELECTION,
  SELECT_BOX,
  RESET_SELECTION,
  ANIMATE,
  PLAY,
  PAUSE,
  REWIND,
  MOVE_SELECTION, SET_DRAGGED_POINT
} from './reducer/actionTypes';
import {actionCallbackMiddleware} from './actionsCallbackMiddleware'
import Controls from './controls/Controls'
import ZoomControls from './controls/ZoomControls'
import saveAs from './saveAs'
import ModelContext from './ModelContext'
import CanvasView from './CanvasView'
import Canvas3DView from './Canvas3DView'
import FrameRenderBar from './FrameRenderBar'
import EditPointPopUp from './EditPointPopUp'
import analytics from '../utils/analytics'
import _ from 'lodash'
import calculateSizing from './utils/calculateSizing'
import getKeysPressed from './utils/keysPressed'
import Guides from './Guides'
import SelectBox from './components/SelectBox'
import {
  composeMatrices,
  inverseMatrix,
  applyMatrixToPoint,
  applyInverseMatrixToPoint,
  translateMatrix,
  identityMatrix,
  scaleMatrix,
} from './utils/matrix';



var ua = window.navigator.userAgent;
var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
var webkit = !!ua.match(/WebKit/i);
var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

let svgIDCounter = 0;

let keysPressed = []
getKeysPressed((newKeys) => keysPressed = newKeys )

let frameModelStores = []
let frameModelRenderedGeometriesStores = []

export const FrameContext = React.createContext('frame')

class Frame extends Component {
  constructor(props) {
    super(props);
    svgIDCounter += 1
    this.svgRef = React.createRef();
    this.designerRef = React.createRef();
    this.state = {
      modelHasUpdated: false,
      render: false,
      startFrame: 0,
      endFrame: 5,
      frameHasSaved: false,
      frameMouseMoveCounter: 0,
      keysPressedCounter: 0,
      keysPressed: [],
      mouseDown: false,
      mouse_select: false,
      draggingSelection: false,
      containerRendered: false,
      editingPoint: false,
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
    };
    analytics.initialize()
    this.playModel = this.playModel.bind(this)
    this.pauseModel = this.pauseModel.bind(this)
    this.rewindModel = this.rewindModel.bind(this)
    this.renderModel = this.renderModel.bind(this)
    this.setStartFrame = this.setStartFrame.bind(this)
    this.setEndFrame = this.setEndFrame.bind(this)
    this.svgOnMouseDown = this.svgOnMouseDown.bind(this)
    this.svgOnTouchEnd = this.svgOnTouchEnd.bind(this)
    this.svgOnMouseUp = this.svgOnMouseUp.bind(this)
    this.svgOnWheel = this.svgOnWheel.bind(this)
    this.fitToFrame = this.fitToFrame.bind(this)
    this.moveToZero = this.moveToZero.bind(this)
    this.setEditingPoint = this.setEditingPoint.bind(this)
    this.startDraggingSelection = this.startDraggingSelection.bind(this)
    this.callUpdateParameters = this.callUpdateParameters.bind(this)
  }
  sizing() {
    return calculateSizing(this.props, this.state, frameModelStores[this.state.frameID], this.designerRef)

  }
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
      }.bind(this), 1)
    })
    document.addEventListener('keyup', () => {
      setTimeout(function() {
        this.setState({
          keysPressedCounter: this.state.keysPressedCounter + 1,
          keysPressed: keysPressed
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
        if(e.ctrlKey) {
          e.preventDefault()
        }
      }, {
        passive: false
      })
    if(this.props.model.animated && this.props.model.playing) {
      setTimeout(function () {
        this.animateModel();
      }.bind(this), 10);
    }
    if(this.props.model.autoplay) {
      setTimeout(function () {
        this.playModel();
      }.bind(this), 10);
    }
    
    setTimeout(function () {
      this.setState({
        containerRendered: true
      })
      this.fitToFrame()
      let size = this.sizing()
      this.props.sizeCallback(size)
    }.bind(this), 10);
  }
  static getDerivedStateFromProps(props, state) {
    if(props.modelHasUpdated) {
      frameModelStores[state.frameID] = props.model
      frameModelRenderedGeometriesStores[state.frameID] = props.model.displayGeometries()
      return {
        ...state,
        modelHasUpdated: true
      }
    }
    return {
      ...state,
      modelHasUpdated: false
    }
  }
  fitToFrame() {
    const zoom = this.props.height / this.props.model.size.height
    const frameAspectRatio = this.props.width / this.props.height
    const modelSize = this.props.model.size
    const modelAspectRatio = modelSize.width / modelSize.height
    let pan_x = 0
    if(frameAspectRatio !== modelAspectRatio) {
      pan_x = this.props.width / zoom * 0.5 - modelSize.width * 0.5
    }
    this.setState({
      transformMatrix: {
        ...this.state.transformMatrix,
        scaleX: zoom,
        scaleY: zoom,
        translateX: pan_x * zoom,
        translateY: 0
      }
    })
  }
  moveToZero() {
    this.setState({
      transformMatrix:{
        ...this.state.transformMatrix,
        translateX: 0,
        translateY: 0
      }
    })
  }
  animateModel() {
    let fps = 1000/60
    if(frameModelStores[this.state.frameID].playing) {
      if(frameModelStores[this.state.frameID].animation_frame >= this.state.startFrame
          && frameModelStores[this.state.frameID].animation_frame <= this.state.endFrame
          && this.state.render
        ) {
          if(this.props.renderType === "SVG") {
            // SvgToPng.saveSvgAsPng(
            //   document.getElementById(this.state.svgID+'-export'),
            //   `${frameModelStores[this.state.frameID].name}-frame-${String(frameModelStores[this.state.frameID].animation_frame).padStart(6, '0')}`
            // );
          } else if(this.props.renderType === "CANVAS") {
            var canvas = document.getElementById(this.state.canvasID);
            var name = `${frameModelStores[this.state.frameID].name}-frame-${String(frameModelStores[this.state.frameID].animation_frame).padStart(6, '0')}`
            // draw to canvas...

            canvas.toBlob(blob => {
              saveAs(blob, name, () => {
                console.log('done');
                this.modelDispatch({
                  type: ANIMATE
                });
                setTimeout(function () {
                  this.animateModel();
                }.bind(this), fps);
              })

            })

          }

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
  playModel() {
    if(frameModelStores[this.state.frameID].animated) {
      if(frameModelStores[this.state.frameID].playing) {
        console.log('model is already playing');
      } else {
        this.modelDispatch({
          type: PLAY
        })
        setTimeout(function () {
          this.animateModel()
        }.bind(this), 10);
      }
    } else {
      console.log('model is not animated');
    }
  }
  pauseModel() {
    this.setState({
      render: false
    })
    this.modelDispatch({
      type: PAUSE
    })
  }
  rewindModel() {
    this.setState({
      render: false
    })
    this.modelDispatch({
      type: REWIND
    })

  }
  renderModel() {
    this.setState({
      render: true
    })
    this.playModel()
  }
  setStartFrame(frameNr) {
    this.setState({
      startFrame: frameNr
    })
  }
  setEndFrame(frameNr) {
    this.setState({
      endFrame: frameNr
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
  mouseMove(e) {
    if(this.props.editable) {
      let mouse_coords = this.getMouseCoords(e);
      let size = this.sizing()
      let model = frameModelStores[this.state.frameID];
      const transformMatrix = this.state.transformMatrix
      if(mouse_coords) {
        if(this.props.logMouseMove) {
          console.log(mouse_coords)
        }
        const panning = keysPressed.includes(' ')
        if(panning) {
          if(this.state.mouseDown) {
            this.setState({
              transformMatrix: {
                ...this.state.transformMatrix,
                translateX: this.state.panStart.x + mouse_coords.x - this.state.mouseDownPoint.x,
                translateY: this.state.panStart.y + mouse_coords.y - this.state.mouseDownPoint.y
              }
            })
          }
        } else if(this.state.mouseDown) {
          let previousMouseCoords = this.state.mouse_select

          if(this.state.draggingSelection) {
            const previousPoint = {
              x: (previousMouseCoords.x - transformMatrix.translateX) / transformMatrix.scaleX,
              y: (previousMouseCoords.y - transformMatrix.translateY) / transformMatrix.scaleY
            }
            const currentPoint = {
              x: (mouse_coords.x - transformMatrix.translateX) / transformMatrix.scaleX,
              y: (mouse_coords.y - transformMatrix.translateY) / transformMatrix.scaleY
            }
            const dx = currentPoint.x - previousPoint.x
            const dy = currentPoint.y - previousPoint.y
            if(!isNaN(dx) && !isNaN(dy)) {
              this.modelDispatch({
                type: MOVE_SELECTION,
                payload: {
                  dx: dx,
                  dy: dy
                }
              })
            }
          }
          this.setState({
            mouse_select: mouse_coords
          })
        } else {
          this.modelDispatch({
            type: MOVE_POINT,
            payload: {
              x: _.clamp((mouse_coords.x - transformMatrix.translateX) / transformMatrix.scaleX, 0, model.size.width),
              y: _.clamp((mouse_coords.y - transformMatrix.translateY) / transformMatrix.scaleY, 0, model.size.height),
              model: model,
              mouseDown: this.state.mouseDown
            }
          });
        }
      }
    }
  }
  getAlgorithmScaling() {
    return {
      x: this.state.zoom,
      y: this.state.zoom
    }
  }
  svgOnMouseDown(e) {
    const panning = keysPressed.includes(' ')
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
    }
  }
  svgOnTouchEnd() {
    // this.modelDispatch({
    //   type: STOP_DRAGGING
    // })
  }
  svgOnMouseUp(e) {
    let mouse_coords = this.getMouseCoords(e);
    
    let startMouseCoords = this.state.mouseDownPoint
    const panning = keysPressed.includes(' ')
    if(e.button === 0) {
      let transformMatrix = this.state.transformMatrix
      let model = frameModelStores[this.state.frameID];
      
      let p2 = {
        x: _.clamp((mouse_coords.x - transformMatrix.translateX) / transformMatrix.scaleX, 0, model.size.width),
        y: _.clamp((mouse_coords.y - transformMatrix.translateY) / transformMatrix.scaleY, 0, model.size.height)
      }
      
      if(startMouseCoords) {
        if(this.state.draggingSelection) {
          this.callUpdateParameters()
        }
        const MIN_DRAG_DISTANCE = 3 
        if(Math.abs(mouse_coords.x - startMouseCoords.x) < MIN_DRAG_DISTANCE && Math.abs(mouse_coords.y - startMouseCoords.y) < MIN_DRAG_DISTANCE) {
          
          if(this.props.onClickCallback && frameModelStores[this.state.frameID].selectedPoints === false) {
            this.props.onClickCallback(p2)
          }
          this.setState({
            draggingSelection: false
          })
          this.modelDispatch({
            type: RESET_SELECTION
          })
        } else if(this.state.draggingSelection === false && !model.draggingAPoint) {
          
          let p1 = {
            x: _.clamp((startMouseCoords.x - transformMatrix.translateX) / transformMatrix.scaleX, 0, model.size.width),
            y: _.clamp((startMouseCoords.y - transformMatrix.translateY) / transformMatrix.scaleY, 0, model.size.height)
          }
          let selectRect = new Rectangle(p1,p2)
          let selectedPoints = model.getEditablePointsInRectangle(selectRect)
          if(selectedPoints.length > 0 && model.draggingAPoint === false && !panning) {
            this.modelDispatch({
              type: SELECT_BOX,
              payload: selectRect
            })
          } else {
            this.modelDispatch({
              type: RESET_SELECTION
            })
          }
        }
      } else {
        if(this.state.draggingSelection) {
          this.modelDispatch({
            type: RESET_SELECTION
          })
          this.setState({
            draggingSelection: false
          })
        }
      }
      this.setState({
        mouseDown: false,
        mouse_select: false
      })
      if(model.draggingAPoint) {
        this.modelDispatch({
          type: STOP_DRAGGING
        })
      }
      
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
    this.setState({
      editingPoint: point
    })
  }
  
  svgOnWheel(e) {
    const panning = keysPressed.includes(' ')
    if (e.ctrlKey && !panning) {
      const deltaScaling = 1/300
      const mouseCoords = this.getMouseCoords(e)
      const { transformMatrix } = this.state;
      let localPoint = {
        x: (mouseCoords.x * transformMatrix.scaleX) + transformMatrix.translateX,
        y: mouseCoords.y
      }

      localPoint.x = 100
      localPoint.y = 0

      let scaleX = _.clamp(1 + e.deltaY * deltaScaling, 0.1, 5)
      let scaleY = scaleX
      const translate = applyInverseMatrixToPoint(transformMatrix, mouseCoords)
      const nextMatrix = composeMatrices([
        transformMatrix,
        translateMatrix({
          translateX: translate.x,
          translateY: translate.y
        }),
        scaleMatrix({
          scaleX: scaleX,
          scaleY: scaleY
        }),
        translateMatrix({
          translateX: -translate.x,
          translateY: -translate.y
        })
      ]);

      this.setState({
        transformMatrix: nextMatrix
      })


    }
  }

  render() {
    if(!frameModelStores[this.state.frameID]) return (<div></div>)
    // console.log(keysPressed)
    
    let panning = keysPressed.includes(' ')

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
    let designer_focussed_class = "";
    let focussedTitle = (
      <div></div>
    );
    let focussedStyle = {};
    let group_scale_transform = `scale(${algorithm_scaling.x}, ${algorithm_scaling.y})`;
    let svgStyle = {
      opacity: 1,
      zIndex: 2,
      position: 'relative'
    }

    if(this.state.keysPressed.includes('Control')) svgStyle.cursor = 'zoom-in'
    if(panning) svgStyle.cursor = 'grab'
    let group_translate_transform = `translate(${this.state.transformMatrix.translateX}, ${this.state.transformMatrix.translateY})`

    let canvasContainerStyle = {
      opacity: 1,
      position: 'absolute',
      background: model.background,
      top: this.props.svgPadding,
      zIndex: 1,
      pointerEvents: 'none'
    }

    let canvas3DContainerStyle = {
      padding: this.props.svgPadding,
      background: model.background
    }
    if(this.state.containerRendered === false) {
      svgStyle = {
        opacity: 0
      }
      canvasContainerStyle.opacity = 0
    }
    return (
      <div  style={focussedStyle} className={styles['hyperobject-frame']+designer_focussed_class}>
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
          <Controls model={model} frame={this}
            editableGeometries={editableGeometries}
            displayGeometries={displayGeometries}
            />
          {this.props.showZoomControls && (
            <ZoomControls
              fitToFrame={this.fitToFrame}
              moveToZero={this.moveToZero}
              />
          )}
        {(this.props.showInputsByDefault && model.inputsList.length > 0) && (
          <Inputs modelDispatch={this.modelDispatch.bind(this)} />
        )}
        {focussedTitle}
        {model.dimensions === 2 ? (
          <div className='svg-container' style={{padding: this.props.svgPadding, background: model.background}}>
            {editPoint && (
              <EditPointPopUp
                editPoint={editPoint}
                setEditingPoint={this.setEditingPoint}
                transformMatrix={this.state.transformMatrix}
                modelDispatch={this.modelDispatch.bind(this)}
                callUpdateParameters={this.callUpdateParameters}
                
                />
            )}
            <div ref={this.designerRef} style={{overflow: 'hidden'}}>
                <Guides
                  svgWidth={this.props.width}
                  svgHeight={size.height}
                  group_scale_transform={group_scale_transform}
                  group_translate_transform={group_translate_transform}
                  width={model.size.width}
                  height={model.size.height}
                  transformMatrix={this.state.transformMatrix}
                  showBounds={this.props.showBounds}
                  showGridLines={this.props.showGridLines}
                  gridLinesUnit={this.props.gridLinesUnit}
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
                      editable={this.props.editable}
                      animated={model.animated}
                      playing={model.playing}
                      canvasID={this.state.canvasID}
                      background={model.background}
                      width={this.props.width}
                      height={size.height}
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
              backgroundColor={model.background}
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
  procedureUpdateIntervalOnMouseMove: 1
}

export default Frame;
