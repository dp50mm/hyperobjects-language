import React from 'react'
import {
    executeCode,
    hyperobjectsLanguageWrapper,
    runCode,
    setupCodeExecution
} from 'hyperobjects-language'

const esprima = require('esprima')

setupCodeExecution()

const ScriptingPage = ({

}) => {

    const code = `model.addEditableGeometry("test", new Path([{x: 10, y: 10}, {x: 50, y: 50}]))`
    const wrappedCode = hyperobjectsLanguageWrapper(code)
    console.log(wrappedCode)
    let syntax = esprima.parseModule(wrappedCode.script, {
        tolerant: false,
        loc: true
    })
    if(syntax.hasOwnProperty("errors")) {
        console.log('syntax errors')
        console.log(syntax.errors)
    } else {
        let id = executeCode(wrappedCode)
        console.log(id)
        setTimeout(() => {
            console.log(window[`OUTPUTMODEL${id}`])
        }, 10)
    }
    return (
        <div className='scripting-page'>
            Scriptingpage
        </div>
    )
}

export default ScriptingPage