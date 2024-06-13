'use strict';

const express = require('express');
const bodyParser = require('body-parser'); 
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();

// Cargar ficheros rutas
const camisetaRoutes = require('./routes/camiseta');
const usuarioRoutes = require('./routes/usuarios');
const reseñaRoutes= require('./routes/reseña');
// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //Es lo que analiza la solicitud y que por ejemplo en el controlador pone los datos en el cuerpo en req.body despues de analizar la solicitud,
app.use(cors({
  origin: 'http://localhost:8080', // Origen permitido
}));


app.use(fileUpload());

// Añadir prefijos a rutas
app.use('/api', camisetaRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', reseñaRoutes);
// Exportar módulo (fichero actual)
module.exports = app;
