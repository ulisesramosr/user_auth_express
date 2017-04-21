var mongoose = require('mongoose');

var seguidorSchema = new mongoose.Schema({
  idEquipo: {
    type: String,
    index: true,
    unique: true
  },

  idPlanta: {
    type: String,
    uppercase: true
  },

  ubicacion: {
    latitud: Number,          // -35.845500
    longitud:  Number         // -71.598000
  },

  orientacionActual: {
    azimut: Number,
    elevacion:  Number
  },

  orientacionObjetivo: {
    azimut: Number,
    elevacion:  Number
  },

  orientacionInicio: {        // orientación al amanecer
    azimut: Number,
    elevacion:  Number
  },

  orientacionFin: {           // orientación en la cual termina el día
    azimut: Number,
    elevacion:  Number
  },

  activo: Boolean,

  propietario:  String,     // nombre del propietario
  potencia:   String,
  date: { type: Date, default: Date.now },
  comments: [{ body: String, date: Date }]
});

db3 = mongoose.createConnection("mongodb://localhost:27017/seguidoresSolares");//  "mongodb://localhost:27017/bookworm"
db3.on('error', console.error.bind(console, 'connection error:'));
var Equipo = db3.model('Equipo', seguidorSchema);
module.exports = Equipo;