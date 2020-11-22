import React from 'react'
import OnClickCallbacksTest from 'components/OnClickCallbacksTest'
import PathDisplayFeaturesTest from 'components/PathDisplayFeaturesTest'
import FlattenPathTest from 'components/FlattenPathTest'

const GeometriesPage = () => {
    return (
        <div className='geometries-page'>
            <h1>Geometries tests</h1>
            <OnClickCallbacksTest />
            <PathDisplayFeaturesTest />
            <FlattenPathTest />
        </div>
    )
}

export default GeometriesPage