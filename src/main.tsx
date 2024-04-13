'use strict'
// import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App'
import RoutesApp from './Routes'
import './samples/node-api'
import 'styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(

    <RoutesApp />

)

postMessage({ payload: 'removeLoading' }, '*')
