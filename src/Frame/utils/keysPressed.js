let keysPressed = []

export var keyDownEventListener = false
export var keyUpEventListener = false

let callback = false

const onKeyDown = (e) => {
    const { key } = e
    if(key === ' ') {
        e.preventDefault()
    }
    if(key === "Escape") {
        removeKeyEventListeners()
    }
    if(!keysPressed.includes(key)) {
        keysPressed.push(key)
    }
    callback(keysPressed)
}

const onKeyUp = ({key}) => {
    keysPressed = keysPressed.filter(p => p !== key)
    callback(keysPressed)
}

function getKeysPressed(_callback) {
    callback = _callback
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