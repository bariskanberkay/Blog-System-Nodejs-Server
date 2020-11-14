const {DataTypes} = require('sequelize');

module.exports = PostTagModel;

function PostTagModel(sequelize){

    const attrs = {
        post_id:{type:DataTypes.INTEGER,allowNull:false},
        tag_id:{type:DataTypes.INTEGER,allowNull:false},
    }

    const options = {
        timestamps : false,
    }

    return sequelize.define('Post_Tag',attrs,options);
}