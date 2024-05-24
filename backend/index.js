'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = 3900; // Puerto que voy a usar

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_tienda', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexión a la base de datos realizada correctamente!');

        // Crear servidor y ponerme a escuchar peticiones HTTP
        app.listen(port, () => {
            console.log('Servidor corriendo en http://localhost:' + port);
        });
    })
    .catch(err => console.log(err));