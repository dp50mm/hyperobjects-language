import {
    Model,
    Frame,
    Text
} from "hyperobjects-language"

var model = new Model("keyboard-interactions")


const KeyboardInteractionsTest = () => {
    return (
        <div className="keyboard-interactions-test">
            <Frame
                model={model}
                width={500}
                height={500}
                />
        </div>
    )
}

export default KeyboardInteractionsTest