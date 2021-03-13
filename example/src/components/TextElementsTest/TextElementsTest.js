import {
    Model,
    Text,
    Frame
} from 'hyperobjects-language'
import _ from 'lodash'

const model = new Model('text-elements-test')

model.setSize({
    width: 2000,
    height: 2000
})

model.addProcedure(
    'text-translate',
    (self) => {
        return _.range(10).map(val => {
            var text = new Text(`${val}-translate`, {x: 100, y: val * 50})
            text.translate({x: val * 10, y: 0})
            text.export(true)
            return text
        })
    }
)

model.addProcedure(
    'text-rotate',
    (self) => {
        return _.range(10).map(val => {
            var text = new Text(`${val}-text-rotate`, {x: 100, y: 500})
            text.rotate(val/5 * Math.PI, {x: 500, y: 500})
            text.rotation(val/5 * Math.PI)
            text.export(true)
            return text
        })
    }
)

model.addProcedure(
    'big-text',
    (self) => {
        var text = new Text("BIG TEXT", {x: 450, y: 500}).export(true)
        text.fontSize(600)
        text.fillOpacity(0.01)
        text.stroke("black")
        text.strokeWidth(5)
        text.strokeOpacity(1)
        return [text]
    }
)

const TextElementsTest = () => {
    return (
        <div className='text-element-tests'>
            <p>Testing transforms on text elements</p>
            <Frame
                model={model}
                width={600}
                height={600}
                showBounds={true}
                showGridLines={true}
                showZoomControls={true}
                exportControls={true}
                maintainAspectRatio={true}
                editable={true}
                />
        </div>
    )
}

export default TextElementsTest