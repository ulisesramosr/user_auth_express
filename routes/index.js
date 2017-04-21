var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var Equipo = require('../models/equipo');
var Lista01 = require('../models/listado'); // Vocabulario
var mid = require('../middleware');


// GET /profile
router.get('/profile', mid.requiresLogin, function(req, res, next) {
  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('profile', { title: 'Profile', name: user.name, organization: user.organization });
        }
      });
});

// GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

// GET /login
router.get('/login', mid.loggedOut, function(req, res, next) {
  return res.render('login', { title: 'Log In'});
});

// POST /login
router.post('/login', function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      }  else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});

// GET /register
router.get('/register', mid.loggedOut, function(req, res, next) {
  return res.render('register', { title: 'Sign Up' });
});

// POST /register
router.post('/register', function(req, res, next) {
  if (req.body.email &&
    req.body.name &&
    req.body.organization &&
    req.body.password &&
    req.body.confirmPassword) {

      // confirm that user typed same password twice
      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
      }

      // create object with form input
      var userData = {
        email: req.body.email,
        name: req.body.name,
        organization: req.body.organization,
        password: req.body.password
      };

      // use schema's `create` method to insert document into Mongo
      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      });

    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
})

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

// *************** BASE DE DATOS LISTADO GENÉRICO ******************************************
// GET /ingresar lista
router.get('/ingresaLista', mid.requiresLogin,  function(req, res, next) {
  return res.render('ingresaLista', { title: 'Ingresa datos a Lista' });
});

// POST /ingresar lista
router.post('/ingresaLista', function(req, res, next) {
  if (req.body.campo1 &&
    req.body.campo2 &&
    req.body.campo3 &&
    req.body.campo4) {

      // create object with form input
      var auxiliar = {
        campo1: req.body.campo1,
        campo2: req.body.campo2,
        campo3: req.body.campo3,
        campo4: req.body.campo4
      };

      // use schema's `create` method to insert document into Mongo
      Lista01.create(auxiliar, function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.redirect('/ingresaLista');
        }
      });

    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
})


// GET / Traductor
router.get('/buscar', mid.requiresLogin, function(req, res, next) {
  return res.render('buscar', { title: 'Buscar en Lista' });
});

// POST / Traductor
router.post('/buscar', function(req, res, next) {
  //
  var aux = {
    campo1: req.body.campo1
  };

  Lista01.findOne(aux, function (err, doc){ // Model.findOne({_id: id}, function(err, user){
    if (err) {
      return next(err);
    } else {
      console.log(doc.campo2);
      return res.render('resultado', { title: 'Resultado', campo1: doc.campo1, campo2: doc.campo2 });
    }
  });
})

// *************** BASE DE DATOS SEGUIDORES SOLARES ******************************************
// GET /Registrar Equipo Seguidor Solar
router.get('/crearEquipo', mid.requiresLogin,  function(req, res, next) {
  return res.render('crearEquipo', { title: 'Registro Seguidor Solar' });
});

// POST /Registrar Equipo Seguidor Solar
router.post('/crearEquipo', function(req, res, next) {
  if (req.body.idEquipo &&
    req.body.idPlanta &&
    req.body.propietario) {

      // create object with form input
      var equipo = {
        idEquipo: req.body.idEquipo,
        idPlanta: req.body.idPlanta,
        propietario: req.body.propietario
      };

      // use schema's `create` method to insert document into Mongo
      Equipo.create(equipo, function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.redirect('/crearEquipo');
        }
      });

    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
})

// ************* Buscador **************
// GET / Buscador
router.get('/buscador', mid.requiresLogin, function(req, res, next) {
  return res.render('buscador', { title: 'Buscador' });
});

// POST / Buscador
router.post('/buscador', function(req, res, next) {
  //
  var aux = {
    idEquipo: req.body.idEquipo
  };

  Equipo.findOne(aux, function (err, doc){ // Model.findOne({_id: id}, function(err, user){
    if (err) {
      return next(err);
    } else {
      console.log(doc.idPlanta);
      return res.render('resultado', { title: 'Resultado', idEquipo: doc.idEquipo, idPlanta: doc.idPlanta });
    }
  });
})
// ************************************************************************************

module.exports = router;
