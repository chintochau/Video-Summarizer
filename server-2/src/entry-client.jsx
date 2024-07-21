import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'


// Get initial data from the global variable
const initialData = window.__SUMMARY_DATA__;

ReactDOM.hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <App initialData={initialData}/>
  </React.StrictMode>
)
