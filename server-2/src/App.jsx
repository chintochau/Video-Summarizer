import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App({ initialData }) {
  const [summaryData, setSummaryData] = useState(initialData);

  return (
    <>
      <div className=''>{summaryData?.sourceTitle}</div>
    </>
  )
}

export default App
