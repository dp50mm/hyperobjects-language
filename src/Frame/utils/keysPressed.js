import _ from "lodash"

let keysPressed = []

export var keyDownEventListener = false
export var keyUpEventListener = false

let callback = false

var blockSpace = false

const onKeyDown = (e) => {
    const { key } = e
    var keyPressed = key
    if(keyPressed === " ") {
        keyPressed = "Space"
    }
    if(key === ' ' && blockSpace === true) {
        e.preventDefault()
    }
    if(key === "Escape") {
        removeKeyEventListeners()
    }
    if(!keysPressed.includes(keyPressed)) {
        keysPressed.push(keyPressed)
    }
    callback(keysPressed)
}

const onKeyUp = ({key}) => {
    var keyUp = key
    if(key === " ") {
        keyUp = "Space"
    }
    keysPressed = keysPressed.filter(p => p !== keyUp)
    callback(keysPressed)
}

function getKeysPressed(_callback, options) {
    callback = _callback
    blockSpace = _.get(options, 'blockSpace', false)
    if(keyDownEventListener === false) {
        keyDownEventListener = window.addEventListener('keydown', onKeyDown)
    }
    if(keyUpEventListener === false) {
        keyUpEventListener = window.addEventListener('keyup', onKeyUp)
    }
    return keysPressed
}

export function removeKeyEventListeners() {
    if(keyDownEventListener !== false) {
        window.removeEventListener('keydown', onKeyDown)
        keyDownEventListener = false
    }
    if(keyUpEventListener !== false) {
        window.removeEventListener('keyup', onKeyUp)
        keyUpEventListener = false
    }
    
}



export default getKeysPressed