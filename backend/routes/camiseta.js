'use strict'

const express = require('express');
const CamisetaController = require('../controllers/camiseta');
const router = express.Router();
// const multipart = require('connect-multiparty'); // Subida de archivos
// const md_upload = multipart({ uploadDir: './upload/camisetas' });

// Ruta de prueba
router.get('/test-de-controllador', CamisetaController.test);

// Rutas útiles para camisetas
router.post('/save', CamisetaController.save);
router.get('/camisetas', CamisetaController.getCamisetas);
router.get('/camiseta/:id', CamisetaController.getCamiseta);
router.put('/camiseta/:id', CamisetaController.update);
router.delete('/camiseta/:id', CamisetaController.delete);
router.post('/upload-image/:id',  CamisetaController.upload);
router.delete('/delete-image/:id/:imageName', CamisetaController.deleteImage);
router.get('/camisetas/search', CamisetaController.searchCamisetas);
router.get('/get-images/:id/:imageName', CamisetaController.getImageByCamisetaId);
router.get('/ligas', CamisetaController.getLigas);
router.get('/equipos',CamisetaController.getEquipos);
router.get('/equipos/:liga', CamisetaController.getEquiposPorLiga);
module.exports = router;
