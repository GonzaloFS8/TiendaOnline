'use strict';

const bcrypt = require('bcrypt');
const validator = require('validator');
const Usuario = require('../models/Usuario');
const { generarToken } = require('../utils/tokens');

const controlador = {
    prueba: (req, res) => {
        return res.status(200).send({
            mensaje: '¡Probando el controlador de Usuarios!'
        });
    },

     registro:async (req, res) => {
        const params = req.body;
    
        try {
            const validar_nombre_usuario = !validator.isEmpty(params.nombreUsuario);
            const validar_correo = !validator.isEmpty(params.correo) && validator.isEmail(params.correo);
            const validar_contraseña = !validator.isEmpty(params.contraseña);
    
            if (!validar_nombre_usuario || !validar_correo || !validar_contraseña) {
                return res.status(400).send({
                    estado: 'error',
                    mensaje: 'Por favor, introduce un nombre de usuario, correo y contraseña válidos'
                });
            }
    
            const usuarioExistente = await Usuario.findOne({ $or: [{ nombreUsuario: params.nombreUsuario }, { correo: params.correo }] });
            if (usuarioExistente) {
                return res.status(400).send({
                    estado: 'error',
                    mensaje: 'Este nombre de usuario o correo ya está registrado'
                });
            }
    
            const usuario = new Usuario();
            usuario.nombreUsuario = params.nombreUsuario;
            usuario.correo = params.correo;
            usuario.contraseña = await bcrypt.hash(params.contraseña, 10);
    
            // Asignar el rol de admin si es el primer usuario registrado
            const numeroUsuarios = await Usuario.countDocuments();
            if (numeroUsuarios === 0) {
                usuario.role = 'admin';
            }
    
            const usuarioGuardado = await usuario.save();
    
            const token = generarToken(usuarioGuardado._id, usuarioGuardado.role);
    
            return res.status(201).send({
                estado: 'éxito',
                token: token
            });
    
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                estado: 'error',
                mensaje: 'Error en el servidor'
            });
        }
    },

    inicioSesion: async (req, res) => {
        const params = req.body;

        try {
            const validar_correo = !validator.isEmpty(params.correo) && validator.isEmail(params.correo);
            const validar_contraseña = !validator.isEmpty(params.contraseña);

            if (!validar_correo || !validar_contraseña) {
                return res.status(400).send({
                    estado: 'error',
                    mensaje: 'Por favor, introduce un correo y contraseña válidos'
                });
            }

            const usuario = await Usuario.findOne({ correo: params.correo });
            if (!usuario) {
                return res.status(400).send({
                    estado: 'error',
                    mensaje: 'Correo o contraseña incorrectos'
                });
            }

            const coincidencia = await bcrypt.compare(params.contraseña, usuario.contraseña);
            if (!coincidencia) {
                return res.status(400).send({
                    estado: 'error',
                    mensaje: 'Correo o contraseña incorrectos'
                });
            }

            const token = generarToken(usuario._id,usuario.role);

            return res.status(200).send({
                estado: 'éxito',
                token: token
            });

        } catch (err) {
            console.error(err);
            return res.status(500).send({
                estado: 'error',
                mensaje: 'Error en el servidor'
            });
        }
    },
    agregarAlCarrito: async (req, res) => {
        const { idUsuario, idCamiseta, talla, jugador, cantidad, imagenes } = req.body;
    
        try {
            // Validar los parámetros. isMongoId verifica que son identificadores válidos
            if (!validator.isMongoId(idUsuario) || !validator.isMongoId(idCamiseta) || validator.isEmpty(talla) || !validator.isInt(cantidad, { min: 1 })) {
                return res.status(400).send({
                    estado: 'error',
                    mensaje: 'Parámetros inválidos'
                });
            }
    
            // Buscar al usuario
            const usuario = await Usuario.findById(idUsuario);
            if (!usuario) {
                return res.status(404).send({
                    estado: 'error',
                    mensaje: 'Usuario no encontrado'
                });
            }
    
            // Verificar si la camiseta ya existe en el carrito
            const camisetaExistente = usuario.carrito.find(item => 
                item.camiseta.toString() === idCamiseta &&
                item.talla === talla &&
                item.jugador === jugador 
            );
    
            if (camisetaExistente) {
                // Si la camiseta  ya existe, incrementar la cantidad
                camisetaExistente.cantidad += 1;
            } else {
                // Crear el objeto de la camiseta para agregar al carrito
                const itemCarrito = {
                    camiseta: idCamiseta,
                    talla: talla,
                    jugador: jugador,
                    cantidad: cantidad,
                    imagenes: imagenes
                };
    
                // Agregar la camiseta al carrito del usuario
                usuario.carrito.push(itemCarrito);
            }
    
            // Guardar los cambios
            const usuarioActualizado = await usuario.save();
    
            return res.status(200).send({
                estado: 'éxito',
                mensaje: 'Camiseta agregada al carrito',
                carrito: usuarioActualizado.carrito
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                estado: 'error',
                mensaje: 'Error en el servidor'
            });
        }
    },
    
    obtenerCarritoPorIdUsuario: async (req, res) => {
        const { idUsuario } = req.body; 
    
        try {
            // Verificar si la ID del usuario es válida
            if (!validator.isMongoId(idUsuario)) {
                return res.status(400).send({
                    estado: 'error',
                    mensaje: 'ID de usuario no válida'
                });
            }
    
            // Buscar al usuario por su ID
            const usuario = await Usuario.findById(idUsuario);
            if (!usuario) {
                return res.status(404).send({
                    estado: 'error',
                    mensaje: 'Usuario no encontrado'
                });
            }
    
            // Devolver el carrito del usuario
            return res.status(200).send({
                estado: 'éxito',
                carrito: usuario.carrito
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                estado: 'error',
                mensaje: 'Error en el servidor'
            });
        }
    },
    
    eliminarDelCarrito: async (req, res) => {
        const { idUsuario, idItem } = req.body;
    
        try {
            // Validar las IDs
            if (!validator.isMongoId(idUsuario) || !validator.isMongoId(idItem)) {
                return res.status(400).send({
                    estado: 'error',
                    mensaje: 'ID de usuario o ID de item no válida'
                });
            }
    
            // Buscar al usuario
            const usuario = await Usuario.findById(idUsuario);
            if (!usuario) {
                return res.status(404).send({
                    estado: 'error',
                    mensaje: 'Usuario no encontrado'
                });
            }
    
            // Buscar la camiseta en el carrito del usuario
            const indexItem = usuario.carrito.findIndex(item => item._id.toString() === idItem);
            if (indexItem === -1) {
                return res.status(404).send({
                    estado: 'error',
                    mensaje: 'Ítem no encontrado en el carrito'
                });
            }
    
            // Eliminar la camiseta del carrito
            usuario.carrito.splice(indexItem, 1);
    
            // Guardar los cambios
            await usuario.save();
    
            return res.status(200).send({
                estado: 'éxito',
                mensaje: 'Ítem eliminado del carrito'
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                estado: 'error',
                mensaje: 'Error en el servidor'
            });
        }
    },
    eliminarCarrito: async (req, res) => {
        const { idUsuario } = req.body;

        try {
            // Validar la ID del usuario
            if (!validator.isMongoId(idUsuario)) {
                return res.status(400).send({
                    estado: 'error',
                    mensaje: 'ID de usuario no válida'
                });
            }

            // Buscar al usuario
            const usuario = await Usuario.findById(idUsuario);
            if (!usuario) {
                return res.status(404).send({
                    estado: 'error',
                    mensaje: 'Usuario no encontrado'
                });
            }

            // Vaciar el carrito
            usuario.carrito = [];

            // Guardar los cambios
            await usuario.save();

            return res.status(200).send({
                estado: 'éxito',
                mensaje: 'Carrito eliminado'
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                estado: 'error',
                mensaje: 'Error en el servidor'
            });
        }
    },
    actualizarCantidadCarrito: async (req, res) => {
        const { idUsuario, idItem, nuevaCantidad } = req.body;
    
        try {
            // Validar las IDs y la nueva cantidad
            if (!validator.isMongoId(idUsuario) || !validator.isMongoId(idItem) || !validator.isInt(nuevaCantidad.toString(), { min: 1 })) {
                return res.status(400).send({
                    estado: 'error',
                    mensaje: 'ID de usuario, ID de camiseta o cantidad no válida'
                });
            }
    
            // Buscar al usuario
            const usuario = await Usuario.findById(idUsuario);
            if (!usuario) {
                return res.status(404).send({
                    estado: 'error',
                    mensaje: 'Usuario no encontrado'
                });
            }
    
            // Buscar la camiseta en el carrito del usuario
            const itemCarrito = usuario.carrito.id(idItem);
            if (!itemCarrito) {
                return res.status(404).send({
                    estado: 'error',
                    mensaje: 'Ítem no encontrado en el carrito'
                });
            }
    
            // Actualizar la cantidad de la camiseta
            itemCarrito.cantidad = nuevaCantidad;
    
            // Guardar los cambios
            await usuario.save();
    
            return res.status(200).send({
                estado: 'éxito',
                mensaje: 'Cantidad de la  camiseta actualizada',
                carrito: usuario.carrito
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                estado: 'error',
                mensaje: 'Error en el servidor'
            });
        }
    },
     realizarPedido : async (req, res) => {
        const { idUsuario, direccion } = req.body;
      
        try {
          // Validar el ID del usuario
          if (!validator.isMongoId(idUsuario)) {
            return res.status(400).send({
              estado: 'error',
              mensaje: 'ID de usuario no válida'
            });
          }
      
          // Validar la dirección
          if (!direccion || !direccion.localidad || !direccion.calle || !direccion.codigoPostal || !direccion.piso) {
            return res.status(400).send({
              estado: 'error',
              mensaje: 'Información de dirección incompleta'
            });
          }
      
          // Buscar al usuario
          const usuario = await Usuario.findById(idUsuario);
          if (!usuario) {
            return res.status(404).send({
              estado: 'error',
              mensaje: 'Usuario no encontrado'
            });
          }
      
          // Copiar el carrito actual a los pedidos junto con la dirección y el precio total
          const nuevoPedido = {
            items: usuario.carrito,
            fecha: new Date(),
            direccion: direccion,
          };
      
          usuario.pedidos.push(nuevoPedido);
      
          // Vaciar el carrito
          usuario.carrito = [];
      
          // Guardar los cambios
          await usuario.save();
      
          return res.status(200).send({
            estado: 'éxito',
            mensaje: 'Pedido realizado y carrito vaciado',
            pedidos: usuario.pedidos
          });
        } catch (err) {
          console.error(err);
          return res.status(500).send({
            estado: 'error',
            mensaje: 'Error en el servidor'
          });
        }
      },
    obtenerUsuarioPorId: async (req, res) => {
        const { idUsuario } = req.params;  
    
        try {
            // Validar el ID del usuario
            if (!validator.isMongoId(idUsuario)) {
                return res.status(400).send({
                    estado: 'error',
                    mensaje: 'ID de usuario no válida'
                });
            }
    
            // Buscar al usuario por su ID
            const usuario = await Usuario.findById(idUsuario);
            if (!usuario) {
                return res.status(404).send({
                    estado: 'error',
                    mensaje: 'Usuario no encontrado'
                });
            }
    
            // Devolver todas las propiedades del usuario
            return res.status(200).send({
                estado: 'éxito',
                usuario: usuario
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                estado: 'error',
                mensaje: 'Error en el servidor'
            });
        }
    },
    borrarTodosLosUsuarios: async (req, res) => {
        try {
            // Elimina todos los documentos en la colección de usuarios
            await Usuario.deleteMany({});

            return res.status(200).send({
                estado: 'éxito',
                mensaje: 'Todos los usuarios han sido eliminados'
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                estado: 'error',
                mensaje: 'Error en el servidor'
            });
        }
    },
    obtenerTodosLosUsuarios: async (req, res) => {
        try {
            const usuarios = await Usuario.find();
            return res.status(200).send({
                estado: 'éxito',
                usuarios: usuarios
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                estado: 'error',
                mensaje: 'Error en el servidor'
            });
        }
    },
    eliminarUsuario: async (req, res) => {
        const { idUsuario } = req.body;
    
        try {
            // Validar la ID del usuario
            if (!validator.isMongoId(idUsuario)) {
                return res.status(400).send({
                    estado: 'error',
                    mensaje: 'ID de usuario no válida'
                });
            }
    
            // Buscar y eliminar al usuario por su ID
            const usuarioEliminado = await Usuario.findByIdAndDelete(idUsuario);
            if (!usuarioEliminado) {
                return res.status(404).send({
                    estado: 'error',
                    mensaje: 'Usuario no encontrado'
                });
            }
    
            return res.status(200).send({
                estado: 'éxito',
                mensaje: 'Usuario eliminado correctamente'
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                estado: 'error',
                mensaje: 'Error en el servidor'
            });
        }
    },
    obtenerPedidosPorIdUsuario: async (req, res) => {
        const { idUsuario } = req.params;
    
        try {
            // Validar el ID del usuario
            if (!validator.isMongoId(idUsuario)) {
                return res.status(400).send({
                    estado: 'error',
                    mensaje: 'ID de usuario no válida'
                });
            }
    
            // Buscar al usuario por su ID
            const usuario = await Usuario.findById(idUsuario);
            if (!usuario) {
                return res.status(404).send({
                    estado: 'error',
                    mensaje: 'Usuario no encontrado'
                });
            }
    
            // Devolver los pedidos del usuario
            return res.status(200).send({
                estado: 'éxito',
                pedidos: usuario.pedidos
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                estado: 'error',
                mensaje: 'Error en el servidor'
            });
        }
    },

   eliminarPedido: async (req, res) => {
        const { idUsuario, idPedido } = req.body;

        try {
            // Validar las IDs
            if (!validator.isMongoId(idUsuario) || !validator.isMongoId(idPedido)) {
                return res.status(400).send({
                    estado: 'error',
                    mensaje: 'ID de usuario o ID de pedido no válida'
                });
            }

            // Buscar al usuario
            const usuario = await Usuario.findById(idUsuario);
            if (!usuario) {
                return res.status(404).send({
                    estado: 'error',
                    mensaje: 'Usuario no encontrado'
                });
            }

            // Encontrar el pedido dentro del array de pedidos del usuario
            const pedido = usuario.pedidos.find(p => p._id.toString() === idPedido);
            if (!pedido) {
                return res.status(404).send({
                    estado: 'error',
                    mensaje: 'Pedido no encontrado para este usuario'
                });
            }

            // Eliminar el pedido del array
            usuario.pedidos = usuario.pedidos.filter(p => p._id.toString() !== idPedido);

            // Guardar los cambios
            await usuario.save();

            return res.status(200).send({
                estado: 'éxito',
                mensaje: 'Pedido eliminado correctamente',
                pedidos: usuario.pedidos
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                estado: 'error',
                mensaje: 'Error en el servidor'
            });
        }
        
    },
     
      
}
module.exports = controlador;
