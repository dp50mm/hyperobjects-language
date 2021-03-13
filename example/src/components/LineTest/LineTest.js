import {
    Model,
    Line,
    Frame
} from 'hyperobjects-language'

var model = new Model("line-test")

model.addEditableGeometry(
    "line-1",
    new Line([{x: 100, y: 500}, {x: 500, y: 500}])
)

model.addEditableGeometry(
    "line-2",
    new Line([{x: 400, y: 200}, {x: 500, y: 700}])
)

const LineTest = () => {
    return (
        <div className="line-test">
            <Frame
                model={model}
                editable={true}
                width={500}
                height={500}
                showBounds={true}
                />
        </div>
    )
}

export default LineTest