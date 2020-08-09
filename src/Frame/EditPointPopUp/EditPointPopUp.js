import React, { useState, useEffect } from 'react'
import styles from './edit-point-pop-up.module.scss'
import {
    Button,
    Input
} from 'semantic-ui-react'
import {
    STOP_EDIT,
    MOVE_POINT,
    SET_EDIT_POINT
} from '../reducer/actionTypes'

const EditPointPopUp = React.memo(({
    editPoint,
    modelDispatch,
    algorithm_scaling,
    pan
}) => {
    const [newX, setNewX] = useState(editPoint.x)
    const [newY, setNewY] = useState(editPoint.y)
    const [currentPointId, setCurrentPointId] = useState(editPoint.id)
    useEffect(() => {
        if(editPoint.id !== currentPointId) {
            setCurrentPointId(editPoint.id)
            setNewX(editPoint.x)
            setNewY(editPoint.y)
        }
    })
    function handleUIKeys(e) {
        if(e.key === 'Escape') {
            modelDispatch({
                type: STOP_EDIT
            })
        } else if(e.key === 'ArrowLeft') {
            if(editPoint.previousPoint) {
                modelDispatch({
                    type: SET_EDIT_POINT,
                    point_id: editPoint.previousPoint.id,
                    geometry_id: editPoint.geometry.id,
                    geometry_key: editPoint.geometry.key
                })
            }
            
        } else if(e.key === 'ArrowRight') {
            if(editPoint.nextPoint) {
                modelDispatch({
                    type: SET_EDIT_POINT,
                    point_id: editPoint.nextPoint.id,
                    geometry_id: editPoint.geometry.id,
                    geometry_key: editPoint.geometry.key
                })
            }
        }
    }

    return (
        <div className={styles['edit-point-pan-position']}
            style={{
                left: pan.x * algorithm_scaling.x,
                top: pan.y  * algorithm_scaling.y
            }}
            >
            <div className={styles['edit-point-pop-up']}
                style={{
                    left: editPoint.x * algorithm_scaling.x,
                    top: editPoint.y * algorithm_scaling.y
                }}
                >
                <Button
                    icon='close'
                    size='tiny'
                    floated='right'
                    onClick={() => {
                        modelDispatch({
                            type: STOP_EDIT
                        })
                    }}
                    />
                <Input
                    value={newX}
                    onKeyUp={(e) => {
                        if(e.key === 'Enter') {
                            modelDispatch({
                                type: MOVE_POINT,
                                payload: {
                                    overrideDragging: true,
                                    point_id: editPoint.id,
                                    x: parseFloat(newX)
                                }
                            })
                        }
                        handleUIKeys(e)
                    }}
                    type="number"
                    onChange={(e) => setNewX(e.target.value)}
                    label={{basic: true, content: 'x (mm)'}}
                    className={newX == editPoint.x ? 'normal' : styles['italic']}
                    labelPosition={'right'}
                    />
                <Input
                    value={newY}
                    onKeyUp={(e) => {
                        if(e.key === 'Enter') {
                            modelDispatch({
                                type: MOVE_POINT,
                                payload: {
                                    overrideDragging: true,
                                    point_id: editPoint.id,
                                    y: parseFloat(newY)
                                }
                            })
                        }
                        handleUIKeys(e)
                    }}
                    type="number"
                    onChange={(e) => setNewY(e.target.value)}
                    label={{basic: true, content: 'y (mm)'}}
                    className={newY == editPoint.y ? 'normal' : styles['italic']}
                    labelPosition={'right'}
                    />
            </div>
        </div>
    )
})

export default EditPointPopUp