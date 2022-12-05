const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Videogame', {
    idapi : {
     type : DataTypes.TEXT,
     allowNull : false,
     defaultValue : 'no tiene idapi'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    release_date: {
     type : DataTypes.DATEONLY
    },
    rating: {
      type : DataTypes.FLOAT
    },
    platforms: {
      type : DataTypes.STRING,
      allowNull : false
    },
    background_image : {
      type : DataTypes.STRING
    }
  }, {timestamps : false});
};
