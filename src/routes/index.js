const e = require('express');
const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require('axios').default
const { Videogame, Genre, Description, VideogameGenre} = require('../db.js')
const {Op} = require('sequelize')

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get('/videogames', async (req, res) =>{
    try {
   const nombre = req.query.name
   if(nombre){
    const game = await Videogame.findAll({
       where : { 
        name : {
          [Op.iLike] : `%${nombre}%`
          } 
        }, 
        include : Genre,
        limit : 15
        }) // trayendo todos los juegos buscados en el search con los generos
      res.status(200).send(game)
   } else {
      const games = await Videogame.findAll({include : Genre}) // trayendo todos los juegos con generos
     res.status(200).send(games);
   }
    } catch (error) {
        res.status(404).send(error.message)
    }  
});

router.get('/videogame/:id', async (req, res) => {
  try {
    const identifier = req.params.id
    const videogame = await Videogame.findByPk(identifier, {include : Genre})  //buscando el juego por id y juntando con sus genero
    const description = await Description.findOne({where : {[Op.or] : [{idapi : videogame.idapi}, {idDB : videogame.id}]}})// usando el videogame que trajimos con id para buscar la descripcion de ese juego con el adapi
    res.status(200).send({videogame,description : description?.description});
  } catch (error) {
    res.status(404).send(error.message)
  }
});

router.post('/videogames/create', async (req, res) =>{
  try {
    let {name,description,release_date,rating,genres,platforms} = req.body
     platforms = platforms.join()
    await Videogame.create({name,release_date,rating,platforms})
    const createdgame = await Videogame.findOne({where : {name : name }})
    genres.forEach(async genre => {
      await createdgame.addGenre(genre.idapi)
    })
    await Description.create({description : description, idDB : createdgame.id})
   return res.status(200).send(createdgame)
  } catch (error) {
    res.status(404).send(error.message)
  }
});

router.get('/genres', async (req, res) => {
 try {
    const genres = await Genre.findAll()
    res.status(200).send(genres)
 } catch (error) {
   res.status(404).send(error.message)
 }
});

router.get('/games/:order', async (req, res) => {
  const {order} = req.params
  console.log(order)
  switch(order){
  case 'A-Z':
    const gameorderedASC = await Videogame.findAll({order : [['name', 'ASC']], include: Genre})
    return res.status(200).send(gameorderedASC)
    case 'Z-A':
      const gameorderedDESC = await Videogame.findAll({order : [['name', 'DESC']], include : Genre})
    return res.status(200).send(gameorderedDESC)
    case 'Best' :
      const gameorderderBEST = await Videogame.findAll({order : [['rating', 'DESC']],include : Genre})
      return res.status(200).send(gameorderderBEST)
    case 'Worst' :
    const gameorderedWORST = await Videogame.findAll({order : [['rating', 'ASC']],include : Genre})
    return res.status(200).send(gameorderedWORST)
    case 'Api' :
    const gamesfromapi = await Videogame.findAll({where : {[Op.not] : [{idapi : null}]}, include : Genre})
    return res.status(200).send(gamesfromapi)
    case 'Created' :
    const gamescreated = await Videogame.findAll({where : {idapi : 'no tiene idapi'}, include : Genre})
    return res.status(200).send(gamescreated)
  }
});

router.get('/game/:genre', async (req, res) =>{
  const {genre} = req.params
 const juegardos = await Videogame.findAll({include: {model : Genre, where : {name : genre}}})
 if(juegardos.length === 0) return res.status(200).send([])
  res.status(200).send(juegardos)
})

module.exports = router;
