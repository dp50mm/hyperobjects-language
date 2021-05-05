import React, { useEffect, useRef, useState } from 'react'
import useComponentSize from '@rehooks/component-size'
import {
    Circle,
    Frame,
    Model,
    Path,
    Point,
    Text
} from 'hyperobjects-language'
import {
    Button
} from 'semantic-ui-react'
import _ from 'lodash'

let model = new Model("zoom-pan-test")


model.animated = true

model.autoplay = true

model.setSize({
    width: 1000,
    height: 2000
})

model.params = {}

model.params.player = {
    x: 500,
    y: 1000
}

model.addEditableGeometry(
    'test-path',
    new Path(
        _.range(3).map(val => {
            return {
                x: 10 + val * 5,
                y: 50 + Math.random() * 900
            }
        })
    ).r(4).strokeDasharray(3).export(true)
)

// model.addEditableGeometry(
//     'test-path-two',
//     new Path(
//         _.range(5).map(val => {
//             return {
//                 x: 500,
//                 y: 10 + val * 100
//             }
//         })
//     )
// )

model.addProcedure(
    'test-procedure',
    (self) => {
        return new Path(self.geometries['test-path'].points)
            .translate({x: 50, y: 50})
            .strokeDasharray(5)
            .stroke("rgb(0,150,50)")
            .strokeWidth(1)
            .fill('blue')
            .export(true)
            
    }
)

model.addProcedure(
    "keys-pressed-test",
    (self) => {
        var keysPressedText = "Keys pressed: "
        self.keysPressed.forEach(key => {
            keysPressedText += ` ${key}`
        })
        return new Text(
            keysPressedText,
            {x: 100, y: 1800}
        ).fontSize(100)
    }
)

model.addProcedure(
    'text-output',
    (self) => {
        return new Text(
            "TEST",
            {x: 500, y: 500}
        ).fontSize(80).export(true)
    }
)
model.addProcedure(
    'monospace-text-output',
    (self) => {
        return new Text(
            "Monospace FONT",
            {x: 500, y: 600}
        ).fontSize(80).export(true).fontFamily("monospace")
    }
)

model.addProcedure(
    'animation-frame',
    (self) => {
        return new Text(
            `animation frame: ${self.animation_frame}`,
            {x: 10, y: 30}
        ).export(true).fontSize(40)
    }
)

model.addProcedure(
    "player-object",
    (self) => {
        return new Circle(
            self.params.player,
            40,
            40
        ).fill("rgb(30,70,255)")
    }
)

model.addAnimation(
    "player-movement",
    (self) => {
        const keysPressed = self.keysPressed
        if(keysPressed.includes("ArrowUp")) {
            self.params.player.y -= 3
        }
        if(keysPressed.includes("ArrowDown")) {
            self.params.player.y += 3
        }
        if(keysPressed.includes("ArrowLeft")) {
            self.params.player.x -= 3
        }
        if(keysPressed.includes("ArrowRight")) {
            self.params.player.x += 3
        }
    }
)

model.onPointerDownCallback = (self, p) => {
    console.log(self, p)
    self.params.player.x = p.x
    self.params.player.y = p.y
}


const ZoomPanFrameTest = ({

}) => {
    const ref = useRef(null)
    const [logging, setLogging] = useState(false)
    const [modelHasUpdated, setModelHasUpdated] = useState(false)
    const size = useComponentSize(ref)
    const width = _.max([size.width, 100])
    const height = window.innerHeight - 300
    useEffect(() => {
        if(modelHasUpdated) {
            setTimeout(() => {
                setModelHasUpdated(false)
            }, 10)
            
        }
    })
    return (
        <div className='zoom-pan-frame-test'>
            <h2>Zoom pan frame test</h2>
            <div><Button toggle active={logging} onClick={() => setLogging(!logging)} >Model log</Button></div>
            <div ref={ref}>
                <div style={{width: width, height: height, border: '1px solid rgb(220,220,220)'}}>
                {width > 100 && (
                    <Frame
                        model={model}
                        editable={true}
                        fitInContainer={true}
                        maintainAspectRatio={true}
                        width={width}
                        height={height}
                        showBounds={true}
                        showGridLines={true}
                        showZoomControls={true}
                        logModelDispatch={logging}
                        logModelState={logging}
                        modelHasUpdated={modelHasUpdated}
                        onClickCallback={(e) => {
                            // console.log('on click callback: ', e)
                            model.geometries['test-path'].addPoint(e)
                            model.playing = true
                            setModelHasUpdated(true)
                        }}
                        updateParameters={(params) => {
                            model.updateGeometryValues(params.geometries)
                            // model.geometries = params.geometries
                            // setModelHasUpdated(true)
                         }}
                        showPointCoordinates={true}
                        exportControls={true}
                        animationControls={true}
                        exportTypes={['svg', 'png', 'pdf']}
                        />
                )}
                </div>
            </div>
        </div>
    )
}

export default ZoomPanFrameTest