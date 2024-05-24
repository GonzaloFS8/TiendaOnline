'use strict'

const express = require('express'); // Módulo para crear el servidor
const bodyParser = require('body-parser'); // Módulo para parsear las peticiones a JSON
const cors = require('cors'); // Módulo para manejar CORS
const fileUpload = require('express-fileupload');
// Ejecutar express (http)
const app = express(); // Esto va a ser la aplicación en sí

// Cargar ficheros rutas
const camisetaRoutes = require('./routes/camiseta');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false })); // Utilizar bodyParser
app.use(bodyParser.json()); // Convertir cualquier tipo de petición que me llegue a un JSON
app.use(cors()); // Habilitar CORS
// Middleware para manejar archivos
app.use(fileUpload());

// Añadir prefijos a rutas
app.use('/api', camisetaRoutes);

// Exportar módulo (fichero actual)
module.exports = app; // Me permite utilizar esto fuera
