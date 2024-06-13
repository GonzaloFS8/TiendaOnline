'use strict';

const validator = require('validator'); //Validar Datos
const Camiseta = require('../models/camiseta');

const fs = require('fs'); 
const path = require('path');


const controller = {

    test: (req, res) => {
        return res.status(200).send({
            message: 'Accion test de Mi controlador de Camisetas'
        });
    },

    save: async (req, res) => {
        // Recoger parametros por post
        const params = req.body;

        // Validar datos (validator)
        try {
            const validate_equipo = !validator.isEmpty(params.equipo);
            const validate_equipacion = !validator.isEmpty(params.equipacion);
            const validate_año = !validator.isEmpty(params.año);
            const validate_descripcion = !validator.isEmpty(params.descripcion);
            const validate_precio = !validator.isEmpty(params.precio);
            const validate_liga = !validator.isEmpty(params.liga);

            // Comprobamos que haya al menos una talla y un jugador seleccionados
            const validate_jugadores = Array.isArray(params.jugadores) && params.jugadores.length > 0;
            const validate_talla = Array.isArray(params.talla) && params.talla.length > 0;

            if (validate_equipo && validate_equipacion && validate_año &&
                validate_descripcion && validate_precio && validate_liga &&
                validate_jugadores && validate_talla) {
                // Crear el objeto a guardar
                const camiseta = new Camiseta();
                // Asignar valores
                camiseta.equipo = params.equipo;
                camiseta.equipacion = params.equipacion;
                camiseta.año = params.año;
                camiseta.jugadores = params.jugadores;
                camiseta.descripcion = params.descripcion;
                camiseta.precio = params.precio;
                camiseta.liga = params.liga;
                camiseta.talla = params.talla;
                camiseta.imagenes = [];
                camiseta.talla = params.talla;
                camiseta.imagenes = [];

                // Guardar la Camiseta
                const camisetaStored = await camiseta.save();
                // Devolver una Respuesta
                return res.status(200).send({
                    status: 'success',
                    camiseta: camisetaStored
                });

            } else {
                return res.status(200).send({
                    status: 'error',
                    message: 'Los Datos No son Válidos'
                });
            }

        } catch (err) {
            console.error(err);
            return res.status(500).send({
                status: 'error',
                message: 'Ha ocurrido un error en el servidor'
            });
        }
    },

    getCamisetas: async (req, res) => {


        try {
            const camisetas = await Camiseta.find({}).sort('-id').exec();
            if (camisetas.length === 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay camisetas para mostrar!!'
                });
            }
            return res.status(200).send({
                status: 'success',
                camisetas
            });
        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al devolver las camisetas!!'
            });
        }
    },

    getCamiseta: async (req, res) => {
        try {
            // Recoger el id de la URL
            const camisetaId = req.params.id;

            // Comprobar que existe
            if (!camisetaId || camisetaId == null) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe la camiseta!!'
                });
            }

            // Buscar la camiseta
            const camiseta = await Camiseta.findById(camisetaId);

            if (!camiseta) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe la camiseta!!'
                });
            }

            // Devolverla en JSON
            return res.status(200).send({
                status: 'success',
                camiseta
            });
        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al devolver los datos!!'
            });
        }
    },

    
    editCamiseta: async (req, res) => {
        try {
            // Recoger el id de la camiseta de la URL
            const camisetaId = req.params.id;
    
            // Verificar si el ID es válido
            if (!camisetaId) {
                return res.status(400).send({
                    status: 'error',
                    message: 'El ID de la camiseta no es válido'
                });
            }
    
            // Recoger los datos actualizados de la camiseta
            const updatedData = req.body;
    
            // Verificar si se proporcionaron datos para actualizar
            if (!updatedData || Object.keys(updatedData).length === 0) {
                return res.status(400).send({
                    status: 'error',
                    message: 'No se proporcionaron datos para actualizar'
                });
            }
    
            // Buscar la camiseta por su ID y actualizar los campos permitidos
            const updatedCamiseta = await Camiseta.findByIdAndUpdate(camisetaId, {
                $set: {
                    equipo: updatedData.equipo,
                    equipacion: updatedData.equipacion,
                    año: updatedData.año,
                    jugadores: updatedData.jugadores,
                    descripcion: updatedData.descripcion,
                    precio: updatedData.precio,
                    liga: updatedData.liga,
                    talla: updatedData.talla
                }
            }, { new: true });
    
            // Verificar si la camiseta fue encontrada y actualizada
            if (!updatedCamiseta) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encontró la camiseta o no se pudo actualizar'
                });
            }
    
            // Si se actualizó , devolver una respuesta con la camiseta actualizada
            return res.status(200).send({
                status: 'success',
                message: 'Camiseta actualizada correctamente',
                camiseta: updatedCamiseta
            });
        } catch (error) {
            // Manejar errores de base de datos
            console.error(error);
            return res.status(500).send({
                status: 'error',
                message: 'Error al actualizar la camiseta'
            });
        }
    },
    
    delete: async (req, res) => {
        try {
            // Recoger el id de la camiseta de la URL
            const camisetaId = req.params.id;

            // Verificar si el ID es válido
            if (!camisetaId) {
                return res.status(400).send({
                    status: 'error',
                    message: 'El ID de la camiseta no es válido'
                });
            }

            // Buscar la camiseta por su ID y eliminarla
            const deletedCamiseta = await Camiseta.findByIdAndDelete(camisetaId);

            // Verificar si la camiseta fue encontrada y eliminada
            if (!deletedCamiseta) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encontró la camiseta'
                });
            }

            // Si se eliminó , devolver una respuesta 
            return res.status(200).send({
                status: 'success',
                message: 'Camiseta eliminada correctamente',
                camiseta: deletedCamiseta
            });
        } catch (error) {
            // Manejar errores de base de datos 
            console.error(error);
            return res.status(500).send({
                status: 'error',
                message: 'Error al eliminar la camiseta'
            });
        }
    },

    upload: async (req, res) => {
        try {
            // Verificar si se enviaron archivos
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'No se subieron archivos.'
                });
            }

            // Obtener ID de la camiseta de la URL
            const camisetaId = req.params.id;

            // Buscar la camiseta por su ID
            const camiseta = await Camiseta.findById(camisetaId);

            // Verificar si la camiseta existe
            if (!camiseta) {
                return res.status(404).json({
                    status: 'error',
                    message: 'La camiseta no existe.'
                });
            }

            // Ruta de destino para subir archivos
            const uploadDir = path.join(__dirname, '../upload/camisetas');

            // Recorrer los archivos subidos
            for (const key in req.files) {
                // Obtener la información del archivo
                const file = req.files[key];

                // Obtener el nombre del archivo
                const fileName = file.name;

                // Definir la ruta de destino
                const uploadPath = path.join(uploadDir, fileName);

                // Guardar el nombre del archivo en el array de imágenes de la camiseta
                camiseta.imagenes.push(fileName);

                // Mover el archivo a la carpeta de destino
                await file.mv(uploadPath);
            }

            // Guardar la camiseta actualizada con las nuevas imágenes
            const camisetaActualizada = await camiseta.save();

            // Enviar respuesta con la camiseta actualizada
            return res.status(200).json({
                status: 'success',
                camiseta: camisetaActualizada
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al subir las imágenes.'
            });
        }
    },

    deleteImage: async (req, res) => {
        try {
            // Obtener el ID de la camiseta y el nombre de la imagen a eliminar
            const { id, imageName } = req.params;

            // Buscar la camiseta por su ID
            const camiseta = await Camiseta.findById(id);

            // Verificar si la camiseta existe
            if (!camiseta) {
                return res.status(404).json({
                    status: 'error',
                    message: 'La camiseta no existe.'
                });
            }

            // Encontrar y eliminar la imagen del array de imágenes de la camiseta
            const index = camiseta.imagenes.indexOf(imageName);
            if (index !== -1) {
                camiseta.imagenes.splice(index, 1); // Eliminar la imagen del array
            } else {
                return res.status(404).json({
                    status: 'error',
                    message: 'La imagen no existe en la camiseta.'
                });
            }

            // Guardar la camiseta actualizada sin la imagen eliminada
            const camisetaActualizada = await camiseta.save();

            // Devolver una respuesta 
            return res.status(200).json({
                status: 'success',
                message: 'Imagen eliminada correctamente.',
                camiseta: camisetaActualizada
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al eliminar la imagen.'
            });
        }
    },

    searchCamisetas: async (req, res) => {
        try {
            // Recoger los parámetros del body
            const { equipo, liga } = req.body;

            // Construir el objeto de consulta basado en los parámetros de búsqueda
            const query = {};

            if (equipo) {
                query.equipo = equipo;
            }

            if (liga) {
                query.liga = liga;
            }

            // Realizar la consulta a la base de datos
            const camisetas = await Camiseta.find(query);

            // Verificar si se encontraron camisetas
            if (camisetas.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'No se encontraron camisetas que coincidan con los criterios de búsqueda.'
                });
            }

            // Devolver las camisetas encontradas
            return res.status(200).json({
                status: 'success',
                camisetas
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al realizar la búsqueda de camisetas.'
            });
        }
    },
    getImageByCamisetaId: async (req, res) => {
        try {
            // Obtener el ID de la camiseta de la URL
            const camisetaId = req.params.id;
            const imageName = req.params.imageName;

            // Buscar la camiseta por su ID
            const camiseta = await Camiseta.findById(camisetaId);

            // Verificar si la camiseta existe
            if (!camiseta) {
                return res.status(404).json({
                    status: 'error',
                    message: 'La camiseta no existe.'
                });
            }

            // Ordenar las imágenes alfabéticamente
            const sortedImages = camiseta.imagenes.sort();

            // Verificar si la imagen está en las imágenes de la camiseta
            if (!sortedImages.includes(imageName)) {
                return res.status(404).json({
                    status: 'error',
                    message: 'La imagen no existe en la camiseta.'
                });
            }

            // Construir la ruta de la imagen
            const imagePath = path.join(__dirname, `../upload/camisetas/${imageName}`);

            // Establecer las cabeceras para la imagen
            res.setHeader('E-F-A', 'image/jpeg'); //Tipo de Imagen
            res.setHeader('E-F-A', `attachment; filename="${imageName}"`); //Especifica que la imgaen debe ser tratada como un archivo

            // Enviar la imagen al cliente
            fs.createReadStream(imagePath).pipe(res);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener la imagen de la camiseta.'
            });
        }
    },
    getLigas: async (req, res) => {
        try {
            const camisetas = await Camiseta.find({});
            if (camisetas.length === 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay camisetas para mostrar!!'
                });
            }

            // Obtener ligas únicas
            const ligas = [...new Set(camisetas.map(camiseta => camiseta.liga))];

            return res.status(200).send({
                status: 'success',
                ligas
            });
        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al devolver las ligas!!'
            });
        }
    },

    getEquipos: async (req, res) => {
        try {
            // Obtener todas las camisetas 
            const camisetas = await Camiseta.find();

            // Verificar si hay camisetas 
            if (camisetas.length === 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay camisetas para mostrar!!'
                });
            }

            // Obtener equipos únicos
            const equipos = [...new Set(camisetas.map(camiseta => camiseta.equipo))];

            // Devolver la respuesta con los equipos únicos
            return res.status(200).send({
                status: 'success',
                equipos
            });
        } catch (error) {
            // Manejar errores de la base de datos
            return res.status(500).send({
                status: 'error',
                message: 'Error al devolver los equipos!!'
            });
        }
    },

    getEquiposPorLiga: async (req, res) => {
        // Validar que se haya pasado el parámetro de la liga
        if (!req.params.liga || validator.isEmpty(req.params.liga.trim())) {
            return res.status(400).json({ status: 'error', message: 'Se requiere especificar la liga.' });
        }

        try {
            // Obtener la liga del parámetro de la URL
            const liga = req.params.liga;

            // Construir la consulta de búsqueda
            const query = { liga };

            // Obtener todas las camisetas de la base de datos que coincidan con la liga
            const camisetas = await Camiseta.find(query);

            // Verificar si hay camisetas en la base de datos
            if (camisetas.length === 0) {
                return res.status(404).json({ status: 'error', message: 'No hay camisetas para mostrar.' });
            }

            // Obtener equipos únicos
            const equipos = [...new Set(camisetas.map(camiseta => camiseta.equipo))];

            // Devolver la respuesta con los equipos únicos
            return res.status(200).json({ status: 'success', equipos });
        } catch (error) {
            // Manejar errores de la base de datos
            console.error(error);
            return res.status(500).json({ status: 'error', message: 'Error al obtener los equipos por liga.' });
        }
    },

     getDetallesCarritoCamisetaPorId : async (req, res) => {
        try {
            // Recoger el ID de la camiseta de la URL
            const camisetaId = req.params.id;
    
            // Verificar si el ID de la camiseta es válido
            if (!camisetaId) {
                return res.status(400).json({ status: 'error', message: 'ID de camiseta no válido.' });
            }
    
            // Buscar la camiseta por su ID
            const camiseta = await Camiseta.findById(camisetaId);
    
            // Verificar si la camiseta existe
            if (!camiseta) {
                return res.status(404).json({ status: 'error', message: 'No se encontró la camiseta.' });
            }
    
            // Extraer los detalles necesarios de la camiseta
            const { equipo, equipacion, año, precio } = camiseta;
    
            // Devolver los detalles de la camiseta
            return res.status(200).json({ status: 'success', detallesCamiseta: { equipo, equipacion, año, precio } });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: 'error', message: 'Error al obtener los detalles de la camiseta.' });
        }
    }

};

module.exports = controller;
