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
import AnimationControls from './controls/AnimationControls'
import RenderControls from './controls/RenderControls'
import ExportControls from './controls/ExportControls'
import saveAs from './saveAs'
import ModelContext from './ModelContext'
import CanvasView from './CanvasView'
import Canvas3DView from './Canvas3DView'
import analytics from '../utils/analytics'
import _ from 'lodash'


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
      model: false,
      modelHasUpdated: false,
      render: false,
      startFrame: 0,
      endFrame: 5,
      frameHasSaved: false,
      frameMouseMoveCounter: 0,
      containerRendered: false,
      windowResizeIncrement: 0,
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
    let svgPadding = this.props.svgPadding
    let width = this.props.width;
    let height = this.props.height;
    let scaleToContainer = this.props.scaleToContainer
    /**
     * Currently disabled functionality
     * Intended functionality is if the frame is larger than the screen size
     * Scale down the frame element to fit the screen size with padding around it
     * defined by the screenPadding variable
     */
    let aspect_ratio = width / height;

    if(scaleToContainer && this.state.containerRendered && this.designerRef.current !== null) {
      let container = {
        width: this.designerRef.current.getBoundingClientRect().width,
        height: this.designerRef.current.getBoundingClientRect().height
      }
      if(container.width < width) {
        width = container.width;
        height = width * aspect_ratio;
      }
    }
    if(this.state.render && frameModelStores[this.state.frameID].exportResolution) {
      return frameModelStores[this.state.frameID].exportResolution
    }

    // let screenPadding = 0;
    // if(false) { // downsizing to screen size currently disabled
    //   if(window.screen.height - screenPadding < height) {
    //     height = window.screen.height - screenPadding;
    //     width = height * aspect_ratio;
    //   }
    //   if(window.innerHeight - screenPadding < height) {
    //     height = window.innerHeight - screenPadding;
    //     width = height * aspect_ratio;
    //   }
    //   if(window.screen.width - screenPadding < width) {
    //     width = window.screen.width - screenPadding;
    //     height = width * aspect_ratio;
    //   }
    //   if(window.innerWidth - screenPadding < width) {
    //     width = window.innerWidth - screenPadding;
    //     height = width * aspect_ratio;
    //   }
    // }
    aspect_ratio = height / width
    return {
      width: width - svgPadding * 2,
      height: height - svgPadding * 2 * aspect_ratio
    }
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
      this.props.updateParameters(parameterGeometries);
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
        windowResizeIncrement: this.state.windowResizeIncrement + 1
      })
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
  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if(frameModelStores[prevState.frameID].animation_frame >= prevState.startFrame
  //       && frameModelStores[prevState.frameID].animation_frame <= prevState.endFrame
  //       && prevState.render
  //     ) {
  //       if(this.state.frameHasSaved) {
  //         this.setState({
  //           frameHasSaved: false
  //         })
  //         // setTimeout(function () {
  //         //   this.animateModel()
  //         // }.bind(this), 10);
  //       }
  //
  //     }
  // }
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
          let parameterGeometries = reducer(frameModelStores[this.state.frameID], action).extractGeometries()
          this.props.updateParameters(parameterGeometries);

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
  touchMove(ev) {
    if(this.props.editable) {
      ev.preventDefault();
      let svgOffset = {
        x: 0,
        y: 0
      };
      if(this.svgRef.current !== null) {
        let svgCoords = this.svgRef.current.getBoundingClientRect();
        let scrollOffset = {
          x: window.scrollX,
          y: window.scrollY
        };
        svgOffset.x = svgCoords.left + scrollOffset.x;
        svgOffset.y = svgCoords.top + scrollOffset.y;
      }
      let iOS_Y_multiplier = 1;
      if(iOSSafari) {
        iOS_Y_multiplier = 1;
      }
      let x = (ev.touches[0].pageX - svgOffset.x) / this.state.algorithm_scaling.x;
      let y = (ev.touches[0].pageY - svgOffset.y) * iOS_Y_multiplier / this.state.algorithm_scaling.y;
      this.modelDispatch({
        type: MOVE_POINT,
        payload: {
          x: valBetween(x, 0, frameModelStores[this.state.frameID].size.width),
          y: valBetween(y, 0, frameModelStores[this.state.frameID].size.height)
        }
      });
    }

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
            x: valBetween(mouse_coords.x / algorithm_scaling.x, 0, model.size.width),
            y: valBetween(mouse_coords.y / algorithm_scaling.y, 0, model.size.height),
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
      x: size.width / model.size.width,
      y: size.height / model.size.height
    }
    let editableGeometries = [];
    let staticGeometries = [];
    let displayGeometriesOutput = [];
    try {
      editableGeometries = model.editableGeometries();
      if(model.editableGeometriesVisible === false) {
        editableGeometries = [];
      }
      staticGeometries = model.staticGeometries();
      //displayGeometriesOutput = model.displayGeometries();
    } catch(err) {
      console.log(err);
    }
    /**
     * Flatten the displaygeometries output
     * Should be implemented in the model object output
     */
    let displayGeometries = _.flatten(frameModelRenderedGeometriesStores[this.state.frameID])
    let designer_focussed_class = "";
    let disableFocussedButton = (
      <div></div>
    );
    let focussedTitle = (
      <div></div>
    );
    let focussedStyle = {};
    if(model.focussed && checkTouchDevice() && false) {
      designer_focussed_class = " focussed";
      let height = window.innerHeight;
      let width = window.innerWidth;
      // window.screen.height works in mobile dev mode in Chrome
      if(window.screen.height < height) {
        height = window.screen.height;
      }
      if(window.screen.width < width) {
        width = window.screen.width;
      }
      let backgroundColor = 'transparent';
      if(this.props.backgroundColor !== undefined) {
        backgroundColor = this.props.backgroundColor;
      }
      focussedStyle = {
        height: height,
        width: width,
        backgroundColor: backgroundColor
      };
      disableFocussedButton = (
        <div onTouchStart={() => {
          this.modelDispatch({type: DISABLE_FOCUSSED});
          if(document.getElementById("root")) {
            document.getElementById("root").style = " ";
          }
          if(document.getElementById("page")) {
            document.getElementById("page").style = " ";
          }
          document.getElementsByTagName("body")[0].style.touchAction = 'auto';
        }} className='disable-focussed'>
          <div className='close-button'>Save design</div>
        </div>
      );
      focussedTitle = (
        <div className='focussed-text'>
          <h3 className='focussed-title'>Design your product!</h3>
          <p>Touch and drag elements to modify</p>
        </div>
      )
    }
    let group_scale_transform = `scale(${algorithm_scaling.x}, ${algorithm_scaling.y})`;
    let svgStyle = {
      opacity: 1,
      zIndex: 2,
      position: 'relative'
    }
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
        <div className='controls'>
          {this.props.animationControls && model.animated ? (
            <AnimationControls
              playing={model.playing}
              playCallback={this.playModel}
              pauseCallback={this.pauseModel}
              rewindCallback={this.rewindModel}
              />
          ) : null}
          {this.props.renderControls && model.animated ? (
            <RenderControls
              startFrame={this.state.startFrame}
              endFrame={this.state.endFrame}
              renderCallback={this.renderModel}
              startFrameCallback={this.setStartFrame}
              endFrameCallback={this.setEndFrame}
              />
          ) : null}
          {this.props.exportControls ? (
            <ExportControls
              model={model}
              editableGeometries={editableGeometries}
              geometries={displayGeometries}
              svg_id={`${this.state.svgID}-export`}
              canvasID={this.props.canvasID}
              name={model.name}
              />
          ) : null}
        </div>
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
                  onTouchStart={() => {
                    if(checkTouchDevice() && !model.focussed) {
                      // Inner Height works on safari iOS
                      let height = window.innerHeight;
                      let width = window.innerWidth;
                      // window.screen.height works in mobile dev mode in Chrome
                      if(window.screen.height < height) {
                        height = window.screen.height;
                      }
                      if(window.screen.width < width) {
                        width = window.screen.width;
                      }
                      //root_div.style = `max-width: ${width}; max-height: ${height};`;
                      if (document.getElementById("root")) {
                        document.getElementById("root").style.maxWidth = `${width}px`;
                        document.getElementById("root").style.maxHeight = `${height}px`;
                        document.getElementById("root").style.overflow = `hidden`;
                      }
                      if(document.getElementById('page')) {
                        document.getElementById("page").style.maxWidth = `${width}px`;
                        document.getElementById("page").style.maxHeight = `${height}px`;
                        document.getElementById("page").style.overflow = `hidden`;
                      }
                      console.log('setting body touch action to none');
                      document.getElementsByTagName("body")[0].style = 'touch-action:none;';

                      this.modelDispatch({
                        type: SET_FOCUSSED
                      });
                    }
                  }}
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
                  onTouchMove={this.touchMove.bind(this)}
                  onTouchEnd={() => this.modelDispatch({
                    type: STOP_DRAGGING
                  })}
                  onMouseUp={() => this.modelDispatch({
                    type: STOP_DRAGGING
                  })}
                  width={size.width}
                  height={size.height}>
                  <g transform={group_scale_transform}>
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
        {disableFocussedButton}
        </ModelContext.Provider>
        {this.state.render ? (
          <div style={{
            position: 'absolute',
            height: size.height,
            zIndex: 1000,
            padding: 20,
            top: 0,
            left: 20,
            right: 20
            }}>
            <p style={{
              position: 'absolute',
              top: size.height - 10,
              left: 0,
              fontSize: 10
              }}
              >
              {this.state.startFrame}
            </p>
            <p style={{
              position: 'absolute',
              top: size.height - 10,
              right: 0,
              fontSize: 10
              }}>
              {this.state.endFrame}
            </p>
            <p
            style={{
              position:'absolute',
              top: size.height - 30,
              left: `calc(${frameModelStores[this.state.frameID].animation_frame / this.state.endFrame * 100}% - 20px)`
            }}
            >
            {frameModelStores[this.state.frameID].animation_frame}
            </p>
          </div>
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

function valBetween(v, min, max) {
  return (Math.min(max, Math.max(min, v)));
}

function checkTouchDevice() {
   return 'ontouchstart' in document.documentElement;
}

export default Frame;
