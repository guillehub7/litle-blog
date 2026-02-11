import { useState } from 'react'
import { Inicio } from './components/pages/inicio'
import { Articulo } from './components/pages/Articulo'
import { Crear } from './components/pages/Crear'
import { Rutas } from './routing/rutas'
import "./index.css"

function App() {


  return (
   
     <div className="layout">
      <Rutas />

     </div>
   
  )
}

export default App
