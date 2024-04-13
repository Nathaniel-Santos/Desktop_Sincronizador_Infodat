import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App'
import Home from './Home'
import '../samples/node-api'
import '../styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

postMessage({ payload: 'removeLoading' }, '*')
