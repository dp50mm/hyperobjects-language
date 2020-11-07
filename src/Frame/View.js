import React, { Component } from 'react';
import './frame.scss'
import reducer from './reducer';
import {
  ANIMATE
} from './reducer/actionTypes';
import Geometry from './components/Geometry';

class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: props.model
    }
  }
  componentDidMount() {
    if(this.state.model.animated) {
      this.animateModel();
    }
  }
  modelDispatch(action) {
    this.setState({
      model: reducer(this.state.model, action)
    });
    this.props.updateParameters(reducer(this.state.model, action).geometries);
  }
  animateModel() {
    this.modelDispatch({
      type: ANIMATE
    });
    setTimeout(function () {
      this.animateModel();
    }.bind(this), 1000/60);
  }
  render() {
    let displayGeometriesOutput = this.state.model.displayGeometries();
    let displayGeometries = [];
    displayGeometriesOutput.forEach((geometry) => {
      if(Array.isArray(geometry)) {
        geometry.forEach((second) => {
          displayGeometries.push(second);
        });
      } else {
        displayGeometries.push(geometry);
      }
    });
    let algorithm_scaling = {
      x: this.props.width / this.props.model.size.width,
      y: this.props.height / this.props.model.size.height
    };
    let group_scale_transform = `scale(${algorithm_scaling.x}, ${algorithm_scaling.y})`;

    return (
      <div className='parametric-designer view'>
        <svg
         width={this.props.width}
         height={this.props.height}>
         <g transform={group_scale_transform}  className='display-geometries'>
          {displayGeometries.map((geometry, i) => {
            return (
              <Geometry key={i} geometry={geometry} />
            );
          })}
         </g>
       </svg>
      </div>
    )
  }
}

View.defaultProps = {
  width: 500,
  height: 500,
  updateParameters: () => {}
}

export default View;
