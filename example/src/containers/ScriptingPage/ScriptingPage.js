import React from 'react'
import {
    hyperobjectsLanguageWrapper
} from 'hyperobjects-language'

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