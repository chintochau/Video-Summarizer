import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './App'


export function render(params) {

  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <App initialData={params.summary}/>
    </React.StrictMode>
  )
  
  return { html }
}
