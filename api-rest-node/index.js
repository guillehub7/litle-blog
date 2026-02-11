const {conexion} = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");

// inicializar app
console.log("App arrancada");

// Conectar a la base de datos
conexion();

// crear servidor node
const app = express();
const puerto = 3900;


// configurar el cors
app.use(cors());

// convertir body a objeto js
app.use(express.json()); // recibir datos con content-type app/json
app.use(express.urlencoded({extended: true})); // datos por form urlencoded

// crear rutas
const rutas_articulo = require("./rutas/articulo_ruta");

// cargo las rutas
app.use("/api",rutas_articulo);




// rutas de prueba hardcodeadas
app.get("/probando", (req, res) =>{
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

});

app.get("/", (req, res) =>{
   
    return res.status(200).send(
        "<h1> Empezando a crear una api rest con node <h1/>"
    );

});


// crear servidor y escuchar peticiones
app.listen(puerto, () =>{
 console.log("Servidor corriendo en el puerto: "+puerto);
});