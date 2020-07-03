import React, { useRef, useState } from 'react'
import styles from './styles.module.css'

export const testVariable = "TEST VARIABLE"

export const ExampleComponent = ({ text }) => {
    const componentRef = useRef(null)
    const [clicked, setClicked] = useState(false)
    console.log(componentRef)
    return (
        <div
            ref={componentRef}
            className={styles.test}
            onClick={() => { setClicked(!clicked) }}>
                Example Component: {text}
        </div>
    )
}
