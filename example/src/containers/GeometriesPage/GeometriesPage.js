import React from 'react'
import OnClickCallbacksTest from 'components/OnClickCallbacksTest'
import PathDisplayFeaturesTest from 'components/PathDisplayFeaturesTest'

const GeometriesPage = () => {
    return (
        <div className='geometries-page'>
            <h1>Geometries Page</h1>
            <OnClickCallbacksTest />
            <PathDisplayFeaturesTest />
        </div>
    )
}

export default GeometriesPage