import React from 'react'
import './frame-controls.scss'

const AnimationControls = ({playing, playCallback, pauseCallback, rewindCallback }) => {
  return (
    <div className='frame-controls'>
      {playing ? (
        <button onClick={pauseCallback}>
          <i className='pe-7s-close pe-2x'></i>
          <p className='tooltip'>Pause animation</p>
        </button>
      ) : (
        <button onClick={playCallback}>
          <i className="pe-7s-play pe-2x"></i>
          <p className='tooltip'>Start animation</p>
        </button>
      )}
      <br />
      <button onClick={rewindCallback}>
        <i className="pe-7s-prev pe-2x"></i>
        <p className='tooltip'>Rewind animation</p>
      </button>
    </div>
  )
}

AnimationControls.defaultProps = {
  playing: false,
  playCallback: () => { console.log('set AnimationControls playCallback prop');},
  pauseCallback: () => { console.log('set AnimationControls pauseCallback prop');},
  rewindCallback: () => { console.log('set AnimationControls rewindCallback prop');}
}

export default AnimationControls
