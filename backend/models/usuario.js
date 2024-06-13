'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ItemCarritoSchema = new Schema({
    camiseta: { type: Schema.Types.ObjectId, ref: 'Camiseta', required: true },
    imagenes: [{ type: String }],
    talla: { type: String, required: true },
    jugador: { type: String },
    cantidad: { type: Number, default: 1 } 
});

const DireccionSchema = new Schema({
    localidad: { type: String, required: true },
    calle: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    piso: { type: String,required:true }
});


const PedidoSchema = new Schema({
    items: [ItemCarritoSchema],
    fecha: { type: Date, default: Date.now },
    direccion: DireccionSchema,
});



var UsuarioSchema = new Schema({
    nombreUsuario: {
        type: String,
        required: true,
        unique:true,
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    contraseña: {
        type: String,
        required: true
    },
    carrito: [ItemCarritoSchema],
    pedidos:[PedidoSchema],
    role: {
        type: String,
        enum: ['admin', 'user'],  
        default: 'user'          
    }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);