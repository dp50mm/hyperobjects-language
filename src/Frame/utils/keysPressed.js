let keysPressed = []

let keyDownEventListener = false
let keyUpEventListener = false
function getKeysPressed(callback) {
    if(keyDownEventListener === false) {
        keyDownEventListener = window.addEventListener('keydown', (e) => {
            const { key } = e
            if(key === ' ') {
                e.preventDefault()
            }
            if(key === "Escape") {
                removeEventListener()
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

export function removeEventListener() {
    if(keyDownEventListener) {
        window.removeEventListener('keydown', eventListener)
    }
    if(keyUpEventListener) {
        window.removeEventListener('keyup', keyUpEventListener)
    }
    
}



export default getKeysPressed