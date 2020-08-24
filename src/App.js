import React from 'react'

import { BrowserRouter, Route } from 'react-router-dom'

import MapsScreen from './views/MapsScreen'
import Screen2 from './views/screen-2'
import Screen3 from './views/screen-3'

const App = () => {

    return(
        <BrowserRouter>
            <Route path='/' exact component={MapsScreen} />
            <Route path='/screen-2' component={Screen2} />
            <Route path='/screen-3' component={Screen3} />
        </BrowserRouter>
    )
}

export default App