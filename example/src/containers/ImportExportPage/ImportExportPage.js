import React from 'react'
import {
    Tab
} from 'semantic-ui-react'
import ExportImportTest from 'components/ExportImportTest'
import GcodeTest from 'components/GcodeTest'
import RenderingTest from 'components/RenderingTest'
import VectorExportMenuTest from 'components/VectorExportMenuTest'
import ExportPDFTest from 'components/ExportPDFTest'

const panes = [
    {
        menuItem: "Model import/export API",
        render: () => <Tab.Pane attached={false}><ExportImportTest /></Tab.Pane>
    },
    {
        menuItem: "Gcode",
        render: () => <Tab.Pane attached={false}><GcodeTest /></Tab.Pane>
    },
    {
        menuItem: "Rendering to png",
        render: () => <Tab.Pane attached={false}><RenderingTest /></Tab.Pane>
    },
    {
        menuItem: "PDF export",
        render: () => <Tab.Pane attached={false}><ExportPDFTest /></Tab.Pane>
    },
    {
        menuItem: "Vector export menu",
        render: () => <Tab.Pane attached={false}><VectorExportMenuTest /></Tab.Pane>
    }
]

const ImportExportPage = () => {
    return (
        <div className='import-export-page'>
            <h1>Import export tests</h1>
            <Tab menu={{pointing: true, vertical: true, fluid: true}} panes={panes} />
        </div>
    )
}

export default ImportExportPage