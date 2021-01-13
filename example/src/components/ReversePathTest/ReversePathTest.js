import React from 'react'
import {
    Model,
    Path,
    Frame,
    Text
} from 'hyperobjects-language'

var model = new Model("reverse-path-test")

model.addProcedure(
    "test",
    (self) => {
        var paths = []
        var source = new Path([
            {x: 100, y: 100},
            {x: 300, y: 200, q: {x: 200, y: 300}},
            {x: 500, y: 100, c: [
                {x: 300, y: 500},
                {x: 500, y: 500}
            ]},
            {x: 700, y: 150},
            {x: 900, y: 300}
        ]).strokeWidth(3).stroke('rgb(240,100,0)')
        source.points.forEach((p, i) => p.label = `p-${i}`)
        paths.push(source)
        source.points.forEach((p, i) => {
            paths.push(new Text(`p-${i}`, p, `p-${i}`))
        })

        var reversedPath = source.clone().reverse().translate({x:0, y: 300})
        reversedPath.points.forEach((p, i) => {
            paths.push(new Text(`p-${i}`, p, `p-${i}`))
        })
        paths.push(reversedPath)
        return paths
    }
)


const ReversePathTest = () => {
    return (
        <div className='reverse-path-test'>
            <p>Reverse path test</p>
            <Frame
                model={model}
                width={700}
                height={700}
                showBounds={true}
                showGridLines={true}
                showZoomControls={true}
                maintainAspectRatio={true}
                editable={true}
                />
        </div>
    )
}

export default ReversePathTest