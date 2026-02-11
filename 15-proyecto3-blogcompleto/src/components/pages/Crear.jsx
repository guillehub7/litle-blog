import React from 'react'
import { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Peticion } from '../../helpers/Peticion'
import { Global } from '../../helpers/Global'

export const Crear = () => {

  const {formulario, enviado, cambiado} = useForm({});
  const [resultado, setResultado] = useState("no enviado");

  const guardarArticulo = async(e)=>{
    e.preventDefault();

    // recoger datos del formulario
    let nuevoArticulo = formulario;
    
    // guardar datos 
    const {datos} = await Peticion(Global.url+"crear", "POST", nuevoArticulo);

    if(datos.status === "success"){

      setResultado("guardado");

      }else{
        
      setResultado("error");
    }

    //subir la imagen
      const fileInput = document.querySelector("#file");

    if(datos.status === "success" && fileInput.files[0]) {

      const formData = new FormData();
      formData.append('file0', fileInput.files[0]);
      const subida = await Peticion(Global.url+"subir-imagen/"+datos.articulo._id, "POST", formData, true);

     if(subida.datos. status == "success"){
         setResultado("guardado");
     }else{
        setResultado("error");
     }

    }
    

   
  }

  return (
    <div className='jumbo'>
      <h1>Crear Articulo</h1>
      <p>Formulario para crear un Articulo</p>

      <strong>{resultado == "guardado" ? "Articulo guardado con exito!!" : ""}</strong>
      <strong>{resultado == "error" ? "Los datos proporcionados son incorrectos" : ""}</strong>

      {/* montar el formulario */}
      <form className="formulario" onSubmit={guardarArticulo}>
        
      <div className="form-group">
        <label htmlFor='titulo'>Titulo</label>
        <input type="text" name="titulo" onChange={cambiado}/>
      </div>

       <div className="form-group">
        <label htmlFor='contenido'>Contenido</label>
        <textarea name="contenido" onChange={cambiado}/>
      </div>

       <div className="form-group">
        <label htmlFor='file0'>Imagen</label>
        <input type="file" name="file0" id='file'/>
      </div>

      <input type="submit" value="Guardar" className='btn btn-success'/>


      </form>

    </div>
  )
}
