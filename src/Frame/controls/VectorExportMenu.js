import React, { useState } from 'react'
import {
    Button,
    Card
} from 'semantic-ui-react'
import './vector-export-menu.scss'

const VectorExportMenu = () => {
    const [showMenu, setShowMenu] = useState(false)
    return (
        <div className='vector-export-menu'>
            <Button className='menu-toggle'
                onClick={() => setShowMenu(!showMenu)}
                >
                Export
            </Button>
            {showMenu && (
                <Card>
                    <Card.Content>
                        <h3>Export</h3>
                    </Card.Content>
                    <Card.Content>
                        <Button
                            >
                            SVG 
                        </Button>
                    </Card.Content>
                    <Card.Content>
                        <Button
                            >
                            PDF
                        </Button>
                    </Card.Content>
                </Card>
            )}
        </div>
    )
}

export default VectorExportMenu