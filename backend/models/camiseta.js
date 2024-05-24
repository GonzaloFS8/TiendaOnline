'use strcit'

var mongoose= require ('mongoose');
var Schema = mongoose.Schema;

//Por cada coleccion en mi base de datos un modelo
var CamisetaSchema = Schema({
    equipo:String,
    equipacion:Number,
    año:String,
    jugadores: [{
        nombre: String,
        numero: Number
    }],
    descripcion:String,
    precio:Number,
    liga:String,
    imagenes:[String],
    talla: [String], 
});
//Nombre del Modelo,Esquema que voy a usar para ese Modelo
module.exports = mongoose.model('Camisetas',CamisetaSchema);
//camisetas --> Guarda documentos de esre tipo y con estructura dentro de la coleccion.
