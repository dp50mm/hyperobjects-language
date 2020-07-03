import React, { Component } from 'react'
import Frame from './Frame'
import View from './View'
import allModels from '../models'

class ModelView extends Component {
  updateParameters(parameters) {
    this.props.updateParameters(parameters)
  }
  render() {
    let product = 'cube'
    if(this.props.product !== undefined) {
      product = this.props.product.name
    } else {
      return (
        <p>Model is not defined as a prop</p>
      )
    }
    if(this.props.editable) {
      let model = {...allModels[product]}
      console.log(model);
      if(model) {
        return (
          <Frame
            model={model}
            updateParameters={this.updateParameters.bind(this)}
            width={this.props.width}
            height={this.props.height}
            />
        )
      }

    } else if (this.props.from_parameters) {
      let model = {...allModels[product]}
      if(this.props.parameters !== 'PLACEHOLDER') {
        model.setGeometries(this.props.parameters)
      }
      return (
        <View
          model={model}
          width={this.props.width}
          height={this.props.height}
          />
      )
    } else {
      return (
        <View
          model={allModels[product]}
          width={this.props.width}
          height={this.props.height}
          />
      )
    }
  }
}

export default ModelView
