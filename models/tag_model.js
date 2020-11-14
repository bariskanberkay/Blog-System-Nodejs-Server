const {DataTypes} = require('sequelize');

module.exports = tagModel;


function tagModel(sequelize){

    const attrs = {
        title:{type:DataTypes.STRING,allowNull:false},
    }

    const options = {
        timestamps : false,
    }

    return sequelize.define('tag',attrs,options);

    
}