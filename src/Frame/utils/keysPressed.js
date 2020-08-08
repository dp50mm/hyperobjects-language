let keysPressed = []
function getKeysPressed(callback) {
    window.addEventListener('keydown', ({key}) => {
        if(!keysPressed.includes(key)) {
            keysPressed.push(key)
        }
        callback(keysPressed)
    })
    window.addEventListener('keyup', ({key}) => {
        keysPressed = keysPressed.filter(p => p !== key)
        callback(keysPressed)
    })
    return keysPressed
}



export default getKeysPressed