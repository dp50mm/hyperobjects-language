import { INPUT } from './types'

function Input(range, value) {
    this.range = range
    this.value = value !== undefined ? value : range[0]
}

Input.type = INPUT

export default Input