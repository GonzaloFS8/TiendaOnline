'use strict';

const validator = require('validator');
const Reseña = require('../models/Reseña');
const Usuario = require('../models/Usuario');

const resenaController = {
    crearReseña: async (req, res) => {
        const { usuarioId, valoracion, comentario } = req.body;

        try {
            // Validar si el usuario existe
            const usuario = await Usuario.findById(usuarioId);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Validar la valoración
            if (!validator.isInt(valoracion.toString(), { min: 1, max: 5 })) {
                return res.status(400).json({ message: 'La valoración debe ser un número entre 1 y 5' });
            }

            // Crear la nueva reseña
            const nuevaReseña = new Reseña({
                usuario: usuarioId,
                valoracion,
                comentario
            });

            // Guardar la reseña en la base de datos
            await nuevaReseña.save();

            res.status(201).json({ message: 'Reseña creada correctamente' });
        } catch (error) {
            console.error('Error al crear la reseña:', error);
            res.status(500).json({ message: 'Error al crear la reseña' });
        }
    },

    obtenerTodasReseñas: async (req, res) => {
        try {
            // Obtener todas las reseñas
            const reseñas = await Reseña.find().populate('usuario', 'nombreUsuario');;

            res.status(200).json({ reseñas });
        } catch (error) {
            console.error('Error al obtener las reseñas:', error);
            res.status(500).json({ message: 'Error al obtener las reseñas' });
        }
    }
};


module.exports = resenaController;
