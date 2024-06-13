'use strict';

const express = require('express');
const ControladorUsuario = require('../controllers/usuario');


const router = express.Router();

// Ruta de prueba
router.get('/prueba-de-controlador', ControladorUsuario.prueba);

// Rutas  para usuarios
router.post('/registro', ControladorUsuario.registro);
router.post('/inicioSesion', ControladorUsuario.inicioSesion);
router.post('/agregar-al-carrito',ControladorUsuario.agregarAlCarrito);
router.post('/obtener-carrito', ControladorUsuario.obtenerCarritoPorIdUsuario);
router.delete('/eliminar-del-carrito', ControladorUsuario.eliminarDelCarrito);
router.delete('/eliminar-carrito', ControladorUsuario.eliminarCarrito);
router.post('/actualizar-cantidad-carrito', ControladorUsuario.actualizarCantidadCarrito);
router.post('/realizar-pedido', ControladorUsuario.realizarPedido);
router.get('/obtener-usuario/:idUsuario', ControladorUsuario.obtenerUsuarioPorId);
router.delete('/borrar-todos', ControladorUsuario.borrarTodosLosUsuarios);
router.delete('/eliminar-usuario', ControladorUsuario.eliminarUsuario);
router.get('/obtener-usuarios', ControladorUsuario.obtenerTodosLosUsuarios);
router.get('/obtener-pedidos-usuario/:idUsuario', ControladorUsuario.obtenerPedidosPorIdUsuario);
router.delete('/eliminar-pedido', ControladorUsuario.eliminarPedido);

module.exports = router;
