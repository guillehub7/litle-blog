const fs = require("fs");
const path = require("path");
const {validarArticulo} = require("../helpers/validar");
const Articulo = require("../modelos/Articulo");



const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "soy una accion de prueba en mi controlador"
    });
}


const curso = (req, res) =>{
    console.log("se ha ejecutado el endpoint probando");

    return res.status(200).json([{
        curso: "Master en React",
        author: "Victor Robles",
        web: "victorroblesweb.es/master-react"
    },
    {
        curso: "Master en React",
        author: "Victor Robles",
        web: "victorroblesweb.es/master-react"
    }
]);
}


const crear = (req, res) => {

    //recoger los parametros por post a guardar
    let parametros = req.body;

    //validar datos
     try {
         validarArticulo(parametros);
    } catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
    });
    }


    //crear el objeto a guardar

    const articulo = new Articulo(parametros);

    //asignar valores a objeto basado en el modelo (manual o automatico)
    // articulo.titulo = parametros.titulo --manual

    //Guardar el articulo en la base de datos

    articulo.save().then((articuloguardado)=> {

        if(!articuloguardado){
            return res.status(400).json({
            status: "error",
            mensaje: "No se ha guardado el articulo"
    });
        }
         //devolver resultado
        return res.status(200).json({
        status: "success",
        articulo: articuloguardado,
        mensaje: "Articulo creado con exito!"
    })


    }).catch(error  => {
        return res.status(500).json({
            status: "error",
            mensaje: "Error en el servidor"
           
    })

});
    //    
} // fin save


const listar = async(req, res) => {
    
  try {

    let consulta = Articulo.find({});

    if(req.params[0]){
        consulta.limit(3);
    }

    
    let articulos = await consulta.sort({fecha: -1}).exec();

    if(!articulos){

            return res.status(404).json({
            status: "error",
            mensaje: "No se han encontrado articulos"
    });
        } // fin del if

        return res.status(200).send({
            status: "success",
            contador: articulos.length,
            articulos

        })

  }catch(error){
     return res.status(500).send({
            status: "error",
            mensaje: "se ha producido un error",
            error
        });
  }


} // fin listar articulos


const uno = (req, res) =>{
    //recoger id por la url
    let id = req.params.id;
    //buscar articulo
    Articulo.findById(id).then((articulo) => {
        //si no existe deolver el error

        if(!articulo){
            return res.status(404).json({
            status: "error",
            mensaje: "No se han encontrado el articulo"
    });
        } // fin del if

        //Devolver resultado
        return res.status(200).json({
            status: "success",
            articulo
        })

    }).catch((error)=>{
            return res.status(500).json({
            status: "error",
            mensaje: "ha ocurrido un error",
            error
    });
        
    });
    
} // fin uno

const borrar = (req,res) =>{
     let articuloId = req.params.id;
    Articulo.findOneAndDelete({_id: articuloId}).then ((articuloBorrado)=>{

        if(!articuloBorrado){
            return res.status(500).json({
            status: "error",
            mensaje: "error al borrar"
        })
        }

         return res.status(200).json({
            status: "success",
            articulo: articuloBorrado,
            mensaje: "metodo de borrado"
        })
    }).catch((error)=>{
        return res.status(500).json({
            status: "error",
            error,
            mensaje: "Error en el servidor"     
    })
    });
} // fin borrar






const editar = (req, res) =>{
    // recoger id articulo a editar
     let articuloId = req.params.id;

     //recoger datos del body

     let parametros = req.body;

     //validar datos
    try {
         validarArticulo(parametros);
    } catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
    });
    }
   

     //buscar y actualizar

     Articulo.findOneAndUpdate({_id: articuloId}, parametros,{new: true}).then ((articuloActualizado) => {
        
        if(!articuloActualizado){
            return res.status(500).json({
            status: "error",
            mensaje: "error al actualizar"
        });

        }
        
        
        //devolver una respuesta
        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado
        })


     }).catch((error) =>{
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
    });
     });

} // fin editar


const subir = (req, res) =>{

    //configurar multer


    //recoger el fichero de imagen subida
     if(!req.file && !req.files){
         return res.status(400).json({
                status: "error",
                mensaje: "peticion invalida"
            });
     }

    //nombre del archivo

    let archivo = req.file.originalname;

    //extension del archivo
    let archivo_split = archivo.split("\.");
    let extension = archivo_split[1];

    //comprobar extension correcta
    if(extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif"){
        //borrar archivo y dar respuesta
        fs.unlink(req.file.path, (error)=>{
            return res.status(400).json({
                status: "error",
                mensaje: "Imagen invalida"
            });
        });
    } else {
          
    
    //si todo va bien, actualizar el articulo
 // recoger id articulo a editar
     let articuloId = req.params.id;
   
     //buscar y actualizar

     Articulo.findOneAndUpdate({_id: articuloId}, {imagen: req.file.filename} ,{new: true}).then ((articuloActualizado) => {
        
        if(!articuloActualizado){
            return res.status(500).json({
            status: "error",
            mensaje: "error al actualizar"
        });

        }
        
        
        //devolver una respuesta
        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado,
            fichero: req.file
        })


     }).catch((error) =>{
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
    });

     });
   
 } // fin del else
 
} // fin de subir

const imagen = (req, res) =>{
    let fichero = req.params.fichero;
    let ruta_fisica= "./imagenes/articulos/"+fichero;

    fs.stat(ruta_fisica, (error, existe) =>{
        if(existe){
            return res.sendFile(path.resolve(ruta_fisica));
        } else{
            return res.status(404).json({
            status: "error",
            mensaje: "La Imagen no existe",
            existe,
            fichero,
            ruta_fisica
    });
        }
    })

} // fin de imagen


const buscar = async(req, res) =>{
  try{
    //sacar del string de la busqueda
    let busqueda = req.params.busqueda;
  //find or

 let articulosEncontrados = await Articulo.find({ "$or": [
        {"titulo": {"$regex": busqueda, "$options": "i"}},
         {"contenido": {"$regex": busqueda, "$options": "i"}},
    ]}).sort({fecha: -1});

        if(!articulosEncontrados || articulosEncontrados.length <= 0){
             return res.status(404).json({
            status: "error",
            mensaje: "No se han encontrado articulos!!"
    });
        }

        return res.status(200).json({
            status: "success",
            articulos: articulosEncontrados
        })

    
  } catch(error){
     return res.status(500).json({
            status: "error",
            error,
            mensaje: "No se han encontrado articulos error 500"
    });
  }

    

  


}

module.exports = {
    prueba,
    curso,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscar
}