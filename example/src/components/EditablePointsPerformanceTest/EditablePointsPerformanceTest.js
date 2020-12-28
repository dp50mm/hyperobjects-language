import React, { useState } from 'react'
import {
    Model,
    Frame,
    Group,
    Path
} from 'hyperobjects-language'
import { Input, Button, Form } from 'semantic-ui-react'
import _ from 'lodash'

var model = false
function generate(groups, points) {
    model = new Model('editable-points-performance-test')
    _.range(groups).map(g => {
        const val = g / groups
        var group = new Path(
            _.range(points).map(p => {
                var qPoint = false
                var cPoints = false
                var point = {
                    x: val * 800 + Math.random() * 100,
                    y: Math.random() * 1000
                }
                if(Math.random() < 0.3) {
                    qPoint = {
                        x: val * 800 + Math.random() * 100,
                        y: Math.random() * 1000
                    }
                }
                if(qPoint === false && Math.random() < 0.6) {
                    cPoints = [
                        {
                            x: val * 800 + Math.random() * 100,
                            y: Math.random() * 1000
                        },
                        {
                            x: val * 800 + Math.random() * 100,
                            y: Math.random() * 1000
                        }
                    ]
                }
                if(qPoint) {
                    point.q = qPoint
                } else if(cPoints) {
                    point.c = cPoints
                }
                
                
                return point
            })
        ).r(5).controlsFill(`rgb(${val * 245}, 0, ${255 - (val * 255)})`).controlsFillOpacity(1)
        console.log('geometry: ', g)
        model.addEditableGeometry(
            `group-${g}`,
            group
        )
    })
}

const EditablePointsPerformanceTest = () => {
    const [groups, setGroups] = useState(3)
    const [pointsPerGroup, setPointsPerGroup] = useState(3)
    const [generated, setGenerated] = useState(false)
    return (
        <div style={{position: 'relative'}} className='editable-points-performance-test'>
            <p>Editable points performance test</p>
            
            <div style={{position: 'absolute', top: 0, right: 0, zIndex: 10}} className='ui form'>
                <Form.Field>
                <Input
                    value={groups}
                    type={'number'}
                    onChange={(e) => setGroups(e.target.value)}
                    label="groups"
                    labelPosition="right"
                    size='mini'
                    />
                </Form.Field>
                <Form.Field>
                <Input
                    value={pointsPerGroup}
                    type={'number'}
                    onChange={(e) => setPointsPerGroup(e.target.value)}
                    label='points per group'
                    labelPosition="right"
                    size='mini'
                    />
                </Form.Field>
                <Form.Field>
                    <Button
                        onClick={() => {
                            setGenerated(false)
                            model = false
                            generate(groups, pointsPerGroup)
                            setTimeout(() => {
                                console.log(model)
                                setGenerated(true)
                            }, 500)
                        }}
                        >
                        Generate
                    </Button>
                </Form.Field>
            </div>
            {generated && model && (
                <Frame
                    width={1000}
                    height={1000}
                    model={model}
                    editable={true}
                    fitInContainer={true}
                    maintainAspectRatio={true}
                    showBounds={true}
                    showGridLines={true}
                    showZoomControls={true}
                    />
            )}
        </div>
    )
}

export default EditablePointsPerformanceTest