import React, { Component } from 'react';
import styles from './frame.module.css';
import reducer from './reducer/index';
import Geometry from './components/Geometry';
import Inputs from './components/Inputs'
import {
  MOVE_POINT,
  STOP_DRAGGING,
  DISABLE_FOCUSSED,
  SET_FOCUSSED,
  ANIMATE,
  PLAY,
  PAUSE,
  REWIND
} from './reducer/actionTypes';
import {actionCallbackMiddleware} from './actionsCallbackMiddleware'
import Controls from './controls/Controls'
import saveAs from './saveAs'
import ModelContext from './ModelContext'
import CanvasView from './CanvasView'
import Canvas3DView from './Canvas3DView'
import FrameRenderBar from './FrameRenderBar'
import analytics from '../utils/analytics'
import _ from 'lodash'
import calculateSizing from './utils/calculateSizing'


var ua = window.navigator.userAgent;
var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
var webkit = !!ua.match(/WebKit/i);
var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

let svgIDCounter = 0;

let frameModelStores = []
let frameModelRenderedGeometriesStores = []
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
      containerRendered: false,
      windowResizeIncrement: 0,
      zoom: 1,
      pan: 0,
      frameID: `frame-id-${svgIDCounter}`,
      svgID: `svg-id-${svgIDCounter}`,
      canvasID: `canvas-2d-id-${svgIDCounter}`,
    };
    analytics.initialize()
    this.playModel = this.playModel.bind(this)
    this.pauseModel = this.pauseModel.bind(this)
    this.rewindModel = this.rewindModel.bind(this)
    this.renderModel = this.renderModel.bind(this)
    this.setStartFrame = this.setStartFrame.bind(this)
    this.setEndFrame = this.setEndFrame.bind(this)
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
      let parameterGeometries = frameModelStores[this.state.frameID].extractGeometries()
      let parameterInputs = frameModelStores[this.state.frameID].extractInputs()
      this.props.updateParameters(parameterGeometries, parameterInputs);
    }
    this.setState({
      containerRendered: false
    })
    document.addEventListener("mousemove", (e) => {
      this.mouseMove(e);
    });
    document.addEventListener("mouseup", () => {
      if(frameModelStores[this.state.frameID].draggingAPoint) {
        this.modelDispatch({
          type: STOP_DRAGGING
        });
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
    const zoom = this.props.height / this.props.model.size.height
    setTimeout(function () {
      this.setState({
        zoom: zoom,
        containerRendered: true
      })
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
    actionCallbackMiddleware(frameModelStores[this.state.frameID], action, this.props.actionsCallback)
    try {
      if(this.state.frameMouseMoveCounter % 1 === 0) {
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
    if(this.props.updateParameters) {
      try {
        if(action.type === STOP_DRAGGING) {
          let parameterGeometries = frameModelStores[this.state.frameID].extractGeometries()
          let parameterInputs = frameModelStores[this.state.frameID].extractInputs()
          this.props.updateParameters(parameterGeometries, parameterInputs);
        }
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
      let algorithm_scaling = {
        x: size.width / model.size.width,
        y: size.height / model.size.height
      }
      if(mouse_coords) {
        if(this.props.logMouseMove) {
          console.log(mouse_coords)
        }
        this.modelDispatch({
          type: MOVE_POINT,
          payload: {
            x: _.clamp(mouse_coords.x / algorithm_scaling.x, 0, model.size.width),
            y: _.clamp(mouse_coords.y / algorithm_scaling.y, 0, model.size.height),
            model: model
          }
        });
      }

    }

  }

  render() {
    if(!frameModelStores[this.state.frameID]) {
      return (
        <div></div>
      )
    }
    // if parameters is true the model should
    var model = this.props.fromParameters ? this.props.model : frameModelStores[this.state.frameID];

    let size = this.sizing()
    let algorithm_scaling = {
      x: this.state.zoom,
      y: this.state.zoom
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

    let group_translate_transform = `translate(${0}, ${0})`

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

        <ModelContext.Provider value={model}>
          <Controls model={model} frame={this}
            editableGeometries={editableGeometries}
            displayGeometries={displayGeometries}
            />
        {(this.props.showInputsByDefault && model.inputsList.length > 0) && (
          <Inputs modelDispatch={this.modelDispatch.bind(this)} />
        )}
        {focussedTitle}
        {model.dimensions === 2 ? (
          <div className='svg-container' style={{padding: this.props.svgPadding, background: model.background}}>
            <div ref={this.designerRef} style={{overflow: 'hidden'}}>
                <svg
                  id={this.state.svgID}
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  style={svgStyle}
                  onClick={(e) => {
                    if(e.target.nodeName === 'svg') {
                      let mouse_coords = this.getMouseCoords(e);
                      let size = this.sizing()
                      let model = frameModelStores[this.state.frameID];
                      let algorithm_scaling = {
                        x: size.width / model.size.width,
                        y: size.height / model.size.height
                      }
                      if(mouse_coords) {
                        let x = _.clamp(mouse_coords.x/algorithm_scaling.x, 0, model.size.width)
                        let y = _.clamp(mouse_coords.y/algorithm_scaling.y, 0, model.size.height)
                        this.props.onClickCallback({x, y})
                      }
                    }
                  }}
                  ref={this.svgRef}
                  onTouchEnd={() => this.modelDispatch({
                    type: STOP_DRAGGING
                  })}
                  onMouseUp={() => this.modelDispatch({
                    type: STOP_DRAGGING
                  })}
                  onWheel={(e) => {
                    if (e.ctrlKey) {
                      const deltaScaling = 1/300
                      this.setState({
                        zoom: _.clamp(this.state.zoom + e.deltaY * deltaScaling, 0.1, 10)
                      })
                    }
                  }}
                  width={this.props.width}
                  height={size.height}>
                  <g transform={group_scale_transform}>
                    <g transform={group_translate_transform}>
                      {this.props.renderType === 'SVG' ? (
                        <g className='display-geometries'>
                        {displayGeometries.map((geometry, i) => {
                          return (
                            <Geometry key={i} geometry={{...geometry, editable: false}} />
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
                              key={geometry.id}
                              onGeometryClickCallback={this.props.onGeometryClickCallback}
                              onPointClickCallback={this.props.onPointClickCallback}
                              geometry={{...geometry, editable: this.props.editable}} />
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
                      width={size.width}
                      height={size.height}
                      scaling={algorithm_scaling}
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
  logMouseMove: false
}

export default Frame;
