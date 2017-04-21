var mongoose = require('mongoose');

var listaSchema  = new mongoose.Schema({  
    campo1: {
      type: String
    },
    campo2: {
      type: String
    },
    campo3: {
      type: String
    },
    campo4: {
      type: String
    }
});

db2 = mongoose.createConnection("mongodb://localhost:27017/lista01");//  "mongodb://localhost:27017/bookworm"
db2.on('error', console.error.bind(console, 'connection error:'));
var Lista01 = db2.model('Lista01', listaSchema);
module.exports = Lista01;