'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cart: [{
        camiseta: {
            type: Schema.Types.ObjectId,
            ref: 'Camiseta'
        },
        talla: String,
        jugador: {
            nombre: String,
            numero: Number
        }
    }]
});

module.exports = mongoose.model('Usuario', userSchema);