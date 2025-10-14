import React from 'react'
import Header from './components/Layout/Header'
import Nav from './components/Layout/Nav'
// import CanvasContainer from './components/Canvas/CanvasContainer'
import WriteMode from './components/Canvas/WriteMode'
import DrawMode from './components/Canvas/DrawMode'
import ShapeMode from './components/Canvas/ShapesMode'

const App = () => {
  // const [mode, setMode] = useState("freedraw");
  return (
    <>
    <Header/>
    <Nav />
    {/* <WriteMode/> */}
    <DrawMode/>
    {/* <ShapeMode/> */}
    </>
  )
}

export default App