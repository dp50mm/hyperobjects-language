import React from 'react'
import ExportImportTest from 'components/ExportImportTest'
import GcodeTest from 'components/GcodeTest'

const ImportExportPage = () => {
    return (
        <div className='import-export-page'>
            <ExportImportTest />
            <GcodeTest />
        </div>
    )
}

export default ImportExportPage