function Input(range, value) {
    this.range = range
    this.value = value !== undefined ? value : range[0]
}

export default Input