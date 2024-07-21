import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App({ initialData }) {
  const [count, setCount] = useState(0)
  const [summaryData, setSummaryData] = useState(initialData);

  console.log("summaryData", summaryData);

  return (
    <>
      <div >{summaryData?.sourceTitle}</div>
    </>
  )
}

export default App
