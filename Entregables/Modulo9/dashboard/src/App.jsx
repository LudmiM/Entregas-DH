import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Sidebar } from './components/SideBar'
import { Contentwrapper } from './components/ContentWrapper'


function App() {
  //const [count, setCount] = useState(0)

  return (
    <div id="wrapper">
      <Sidebar />
      <Contentwrapper/>
    </div>
  )
}

export default App
