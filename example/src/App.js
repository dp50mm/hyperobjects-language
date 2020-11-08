import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {
  Menu
} from 'semantic-ui-react'
import MainPage from 'containers/MainPage'
import GeometriesPage from 'containers/GeometriesPage'
import ProceduresPage from 'containers/ProceduresPage'
import InputsPage from 'containers/InputsPage'
import ImportExportPage from 'containers/ImportExportPage'
import ModelsPage from 'containers/ModelsPage'
import FramePage from 'containers/FramePage'
import ScriptingPage from 'containers/ScriptingPage'

import 'hyperobjects-language/dist/index.css'
import 'semantic-ui-css/semantic.min.css';
import './app.scss';

const App = () => {
  return (
    <div className='app'>
      <Router>
        <Menu>
          <Menu.Item>
            <h3>Hyperobjects Language test suite</h3>
          </Menu.Item>
          <Menu.Item>
            <Link to='/'>Home</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to='/models'>Models</Link>
          </Menu.Item>
          <Menu.Item>
          <Link to='/import-export'>Import/Export</Link>
          </Menu.Item>
          <Menu.Item>
          <Link to='/geometries'>Geometries</Link>
          </Menu.Item>
          <Menu.Item>
          <Link to='/procedures'>Procedures</Link>
          </Menu.Item>
          <Menu.Item>
          <Link to='/inputs'>Inputs</Link>
          </Menu.Item>
          <Menu.Item>
          <Link to='/frame'>Frame</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to='/scripting'>Scripting</Link>
          </Menu.Item>
        </Menu>
        <div className='page-content'>
          <Switch>
            <Route path='/models'><ModelsPage /></Route>
            <Route path='/import-export'><ImportExportPage /></Route>
            <Route path='/geometries'><GeometriesPage /></Route>
            <Route path='/procedures'><ProceduresPage /></Route>
            <Route path='/inputs'><InputsPage /></Route>
            <Route path='/frame'><FramePage /></Route>
            <Route path='/scripting'><ScriptingPage /></Route>
            <Route path='/'><MainPage /></Route>
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default App
