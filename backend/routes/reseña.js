const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/reseña');



// Rutas para reseñas
router.post('/resenas', resenaController.crearReseña);
router.get('/resenas', resenaController.obtenerTodasReseñas);

module.exports = router;
