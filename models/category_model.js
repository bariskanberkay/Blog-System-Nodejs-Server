const {DataTypes} = require('sequelize');

module.exports = categoryModel;


function categoryModel(sequelize){

    const attrs = {
        title:{type:DataTypes.STRING,allowNull:false},
        slug:{type:DataTypes.STRING,allowNull:false},
        content:{type:DataTypes.STRING},
    }

    const options = {
        timestamps : false,
    }

    return sequelize.define('category',attrs,options);

    
}






