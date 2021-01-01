import React from 'react'
import ExportImportTest from 'components/ExportImportTest'
import GcodeTest from 'components/GcodeTest'
import RenderingTest from 'components/RenderingTest'

const ImportExportPage = () => {
    return (
        <div className='import-export-page'>
            <ExportImportTest />
            <GcodeTest />
            <RenderingTest />
        </div>
    )
}

export default ImportExportPage