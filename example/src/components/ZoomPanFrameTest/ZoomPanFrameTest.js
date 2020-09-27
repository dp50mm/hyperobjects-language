import React, { useEffect, useRef, useState } from 'react'
import useComponentSize from '@rehooks/component-size'
import {
    Frame,
    Model,
    Path,
    Point
} from 'hyperobjects-language'
import {
    Button
} from 'semantic-ui-react'
import _ from 'lodash'

let model = new Model("zoom-pan-test")

model.setSize({
    width: 1000,
    height: 2000
})

model.addEditableGeometry(
    'test-path',
    new Path(
        _.range(3).map(val => {
            return {
                x: 10 + val * 5,
                y: 50 + Math.random() * 900
            }
        })
    ).r(4)
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
        return self.geometries['test-path'].clone()
            .translate({x: 50, y: 50}).stroke("rgb(0,150,50)").strokeWidth(1)
    }
)

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
                            model.geometries['test-path'].addPoint(e)
                            setModelHasUpdated(true)
                        }}
                        onPointClickCallback={(geometry, point, i) => {
                            console.log(geometry, point, i)
                        }}
                        updateParameters={(params) => {
                            model.updateGeometryValues(params.geometries)
                            // model.geometries = params.geometries
                            // setModelHasUpdated(true)
                         }}
                        showPointCoordinates={true}
                        />
                )}
                </div>
            </div>
        </div>
    )
}

export default ZoomPanFrameTest