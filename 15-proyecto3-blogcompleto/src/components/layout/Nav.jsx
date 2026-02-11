import React from 'react'
import { NavLink } from 'react-router-dom'

export const Nav = () => {
  return (
  //  <!-- barra de navegacion -->
        <div className="nav">
            <ul>
                <li><NavLink to="/inicio">Inicio</NavLink></li>
                <li><NavLink to="/articulos">Articulos</NavLink></li>
                <li><NavLink to="/crear-articulos">Crear</NavLink></li>
                <li><a href="#">Contacto</a></li>
            </ul>
        </div>
  )
}
