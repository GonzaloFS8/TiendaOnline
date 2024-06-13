// models/Reseña.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resenaSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  valoracion: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comentario: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resena', resenaSchema);
