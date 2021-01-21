import React from 'react'
import {
    Tab
} from 'semantic-ui-react'
import './geometries-page.scss'

import CurveTypesTest from 'components/CurveTypesTest'
import OnClickCallbacksTest from 'components/OnClickCallbacksTest'
import PathDisplayFeaturesTest from 'components/PathDisplayFeaturesTest'
import FlattenPathTest from 'components/FlattenPathTest'
import MirrorPathTest from 'components/MirrorPathTest'
import ReversePathTest from 'components/ReversePathTest'
import PathContainsPointTest from 'components/PathContainsPointTest'
import StylingGeometriesTest from 'components/StylingGeometriesTest'
import VoronoiTest from 'components/VoronoiTest'
import PathAngleAtTest from 'components/PathAngleAtTest'
import PathInterpolateTest from 'components/PathInterpolateTest'
import SubPathTest from 'components/SubPathTest'


const panes = [
    {
        menuItem: 'Curve types',
        render: () => <Tab.Pane attached={false}><CurveTypesTest /></Tab.Pane>
    },{
        menuItem: 'Click callbacks',
        render: () => <Tab.Pane attached={false}><OnClickCallbacksTest /></Tab.Pane>
    },{
        menuItem: 'Path display features',
        render: () => <Tab.Pane attached={false}><PathDisplayFeaturesTest /></Tab.Pane>
    },{
        menuItem: 'Flatten path',
        render: () => <Tab.Pane attached={false}><FlattenPathTest /></Tab.Pane>
    },
    {
        menuItem: 'Mirror path',
        render: () => <Tab.Pane attached={false}><MirrorPathTest /></Tab.Pane>
    },
    {
        menuItem: 'Reverse path',
        render: () => <Tab.Pane attached={false}><ReversePathTest /></Tab.Pane>
    },
    {
        menuItem: 'Path contains point',
        render: () => <Tab.Pane attached={false}><PathContainsPointTest /></Tab.Pane>
    },
    {
        menuItem: "Interpolation",
        render: () => <Tab.Pane attached={false}><PathInterpolateTest /></Tab.Pane>
    },
    {
        menuItem: "Styling",
        render: () => <Tab.Pane attached={false}><StylingGeometriesTest /></Tab.Pane>
    },
    {
        menuItem: "Voronoi",
        render: () => <Tab.Pane attached={false}><VoronoiTest /></Tab.Pane>
    },
    {
        menuItem: "Path angle at",
        render: () => <Tab.Pane attached={false}><PathAngleAtTest /></Tab.Pane>
    }
    ,
    {
        menuItem: "Sub path",
        render: () => <Tab.Pane attached={false}><SubPathTest /></Tab.Pane>
    }
]

const GeometriesPage = () => {
    return (
        <div className='geometries-page'>
            <h1>Geometries tests</h1>
            <Tab menu={{pointing: true, vertical: true, fluid: true}} panes={panes} />
            
            
        </div>
    )
}

export default GeometriesPage