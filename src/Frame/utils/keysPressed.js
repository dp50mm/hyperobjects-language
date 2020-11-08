let keysPressed = []

export var keyDownEventListener = false
export var keyUpEventListener = false
function getKeysPressed(callback) {
    if(keyDownEventListener === false) {
        keyDownEventListener = window.addEventListener('keydown', (e) => {
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
        })
    }
    if(keyUpEventListener === false) {
        keyUpEventListener = window.addEventListener('keyup', ({key}) => {
            keysPressed = keysPressed.filter(p => p !== key)
            callback(keysPressed)
        })
    }
    return keysPressed
}

export function removeKeyEventListeners() {
    if(keyDownEventListener !== false) {
        window.removeEventListener('keydown', keyDownEventListener)
        keyDownEventListener = false
    }
    if(keyUpEventListener !== false) {
        window.removeEventListener('keyup', keyUpEventListener)
        keyUpEventListener = false
    }
    
}



export default getKeysPressed