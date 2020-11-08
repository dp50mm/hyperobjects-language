import React from 'react'
import {
    hyperobjectsLanguageWrapper,
    setupCodeExecution
} from 'hyperobjects-language'

setupCodeExecution()

const ScriptingPage = ({

}) => {

    const code = ''
    const wrappedCode = hyperobjectsLanguageWrapper(code)
    console.log(wrappedCode)

    return (
        <div className='scripting-page'>
            Scriptingpage
        </div>
    )
}

export default ScriptingPage