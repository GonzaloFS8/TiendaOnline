'use strict';

var validator = require('validator'); //Validar Datos
var Camiseta = require('../models/camiseta');
//Eliminar archivos 
var fs= require('fs');
var path=require('path');


var controller = {

    test: (req, res) => {
        return res.status(200).send({
            message: 'Accion test de Mi controlador de Camisetas'
        });
    },

    save: async (req, res) => {
        // Recoger parametros por post
        var params = req.body;
    
        // Validar datos (validator)
        try {
            var validate_equipo = !validator.isEmpty(params.equipo);
            var validate_equipacion = !validator.isEmpty(params.equipacion);
            var validate_año = !validator.isEmpty(params.año);
            var validate_descripcion = !validator.isEmpty(params.descripcion);
            var validate_precio = !validator.isEmpty(params.precio);
            var validate_liga = !validator.isEmpty(params.liga);
    
            // Comprobamos que haya al menos una talla y un jugador seleccionados
            var validate_jugadores = Array.isArray(params.jugadores) && params.jugadores.length > 0;
            var validate_talla = Array.isArray(params.talla) && params.talla.length > 0;
    
            if (validate_equipo && validate_equipacion && validate_año &&
                validate_descripcion && validate_precio && validate_liga &&
                validate_jugadores && validate_talla) {
                // Crear el objeto a guardar
                var camiseta = new Camiseta();
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
        var query = Camiseta.find({});

        var last =req.params.last //Si le paso un parametro ala ruta es decir /camisetas/cualquiercosa
        if(last || last !=undefined){
            query.limit(2);
        } //Visualizara 2 Camisetas

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

    update: async (req, res) => {
    // Recoger el id de la camiseta por la URL
    var camisetaId = req.params.id;

    // Recoger los datos que llegan por PUT
    var params = req.body;

    // Validar datos
    try {
        // Aquí validamos, 
        var validate_equipo = !validator.isEmpty(params.equipo);
        var validate_equipacion = !validator.isEmpty(params.equipacion);
        var validate_año = !validator.isEmpty(params.año);
        var validate_descripcion = !validator.isEmpty(params.descripcion);
        var validate_precio = !validator.isEmpty(params.precio);
        var validate_liga = !validator.isEmpty(params.liga);
    } catch (err) {
        return res.status(400).send({
            status: 'error',
            message: 'Faltan datos'
        });
    }

    // Si los datos son válidos
    if (validate_equipo && validate_equipacion && validate_año &&
        validate_descripcion && validate_precio && validate_liga) {
        try {
            // Utilizar async/await para buscar y actualizar la camiseta
            const camisetaUpdated = await Camiseta.findOneAndUpdate(
                { _id: camisetaId },
                params,
                { new: true }
            );

            // Verificar si se encontró y actualizó la camiseta
            if (!camisetaUpdated) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe la camiseta'
                });
            }

            // Enviar la respuesta con la camiseta actualizada
            return res.status(200).send({
                status: 'success',
                Camiseta: camisetaUpdated
            });
        } catch (err) {
            // Manejar errores de base de datos 
            return res.status(500).send({
                status: 'error',
                message: 'Error al actualizar la camiseta'
            });
        }
    }

    // Si no se pasaron las validaciones
    return res.status(400).send({
        status: 'error',
        message: 'Datos de la camiseta inválidos'
    });
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

        // Si se eliminó con éxito, devolver una respuesta 
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

        // Devolver una respuesta de éxito
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
        // Recoger los parámetros de búsqueda del body
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

        // Verificar si la imagen está en las imágenes de la camiseta
        if (!camiseta.imagenes.includes(imageName)) {
            return res.status(404).json({
                status: 'error',
                message: 'La imagen no existe en la camiseta.'
            });
        }

        // Construir la ruta de la imagen
        const imagePath = path.join(__dirname, `../upload/camisetas/${imageName}`);

        // Establecer las cabeceras para la imagen
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${imageName}"`);

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



};

module.exports = controller;
