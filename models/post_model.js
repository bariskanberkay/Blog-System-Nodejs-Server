const {DataTypes} = require('sequelize');

module.exports = postModel;

function postModel(sequelize){

    const attrs = {
        user_id:{type:DataTypes.INTEGER,allowNull:false},
        title:{type:DataTypes.STRING,allowNull:false},
        s_description:{type:DataTypes.STRING},
        content:{type:DataTypes.TEXT,allowNull:true},
        status:{type:DataTypes.STRING,allowNull:true,defaultValue:'draft'},
        published:{type:DataTypes.DATE},
        created:{type:DataTypes.DATE,allowNull:false,defaultValue:DataTypes.NOW},
        updated:{type:DataTypes.DATE},
    }

    const options = {
        timestamps : false,
    }

    return sequelize.define('post',attrs,options);

    
}