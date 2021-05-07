import { INPUT } from './types'

function Input(range, value) {
    this.type = INPUT
    this.range = range
    this.value = value !== undefined ? value : range[0]
}

Input.type = INPUT

export default Input