import React, { Component } from 'react'

class RenderControls extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showSettings: false
    }
    this.toggleSettings = this.toggleSettings.bind(this)
  }
  toggleSettings() {
    this.setState({
      showSettings: !this.state.showSettings
    })
  }
  render() {
    return (
      <div className='frame-controls'>
        {this.state.showSettings ? (
          <div className='render-settings'>
            <p className='label'>Start frame</p>
            <input value={this.props.startFrame}
              type='number'
              onChange={(e) => {
                this.props.startFrameCallback(e.target.value)
              }}>
              </input>
            <p className='label'>End frame</p>
            <input value={this.props.endFrame}
              type='number'
              onChange={(e) => {
                this.props.endFrameCallback(e.target.value)
              }}>
              </input>
          </div>
        ) : null}
        <button onClick={this.props.renderCallback}>
          <i className='pe-7s-video pe-2x'></i>
          <p className='tooltip'>Render animation</p>
        </button>
        <br />
        <button onClick={this.toggleSettings}>
          <i className='pe-7s-settings pe-2x'></i>
          <p className='tooltip'>Animation settings</p>
        </button>
      </div>
    )
  }
}

RenderControls.defaultProps = {
  renderCallback: false,
  startFrameCallback: false,
  endFrameCallback: false,
  startFrame: 0,
  endFrame: 0

}
export default RenderControls
