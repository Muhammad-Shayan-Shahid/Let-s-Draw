import React from 'react'
import Header from './components/Layout/Header'
import Nav from './components/Layout/Nav'
import {DrawMode} from './components/drawmode'

const App = () => {
  // const [mode, setMode] = useState("freedraw");
  return (
    <>
    {/* <Header/> */}
    {/* <Nav /> */}
    <DrawMode/>
    </>
  )
}

export default App