let keysPressed = []
function getKeysPressed(callback) {
    window.addEventListener('keydown', (e) => {
        const { key } = e
        if(key === ' ') {
            e.preventDefault()
        }
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