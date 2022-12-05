const axios = require('axios');
const { json } = require('body-parser');
require('dotenv').config()
const {API_KEY} = process.env
const { Videogame, Genre, Description } = require('./db.js')

//cargamos todos los juegos
module.exports = {  loadingvideogames : async () => {
    var videogamesReq = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}`)
    var videogamesReq2 = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=2`)
    var videogamesReq3 = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=3`)
    var videogamesReq4 = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=4`)
    var videogamesReq5 = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=5`)
    var videogamesjoin =  videogamesReq.data.results.concat(videogamesReq2.data.results).concat(videogamesReq3.data.results)
    .concat(videogamesReq4.data.results).concat(videogamesReq5.data.results)
    const videogames = []
    videogamesjoin.forEach(game => {
       let plataformas = game.parent_platforms.map(plataforma => {
             return plataforma.platform.name
        }).join()
        videogames.push({
            idapi : game.id,
            name : game.name,
            release_date : game.released,
            rating : game.rating,
            platforms : plataformas,
            background_image : game.background_image
        });
    });
   await Videogame.bulkCreate(videogames);
 },//cargamos los generos en la tabla
 loadinggenres : async () => {
      const genres = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`);
        const names = genres.data.results.map(genre => {
          const {name,id} = genre 
          return {name, idapi:id}
          });
     await Genre.bulkCreate(names);
 },// hacemos una tabla con la descripcion de cada juego y el id a cual pertenece
 loadingdescription : async () => {
   const ids = await Videogame.findAll({attributes : ['idapi']});
   ids.forEach( id => {
       axios.get(`https://api.rawg.io/api/games/${id.idapi}?key=${API_KEY}`)
     .then(async (espera)=> {
     await Description.create({description : espera.data.description_raw, idapi : espera.data.id}) 
     })
   })
 },// llenamos la tabla intermediaria con los generos de cada juego
 genresforeachgame : async () => {
  try {
    const juegos = await Videogame.findAll();
    juegos.forEach(juego => {
      axios.get(`https://api.rawg.io/api/games/${juego.idapi}?key=${API_KEY}`)
      .then((game) => {
      game.data.genres.forEach( async genre => {
        await juego.addGenre(genre.id) 
      });
      });
    })
  } catch (error) {
    console.log(error.message);
  }
 }
}