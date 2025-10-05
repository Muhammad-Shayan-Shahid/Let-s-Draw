import React from 'react'
import Header from './components/Layout/Header'
import Nav from './components/Layout/Nav'
import DrawMode from './components/Canvas/DrawMode'
import ToggleTheme from './components/Layout/ToggleTheme'

const App = () => {
  return (
    <>
    <Header/>
    <ToggleTheme />
    <Nav/>
    <DrawMode />
    </>
  )
}

export default App