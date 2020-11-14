const {DataTypes} = require('sequelize');

module.exports = PostCategoryModel;
function PostCategoryModel(sequelize){

    const attrs = {
        post_id:{type:DataTypes.INTEGER,allowNull:false},
        category_id:{type:DataTypes.INTEGER,allowNull:false},
    }

    const options = {
        timestamps : false,
    }

    return sequelize.define('Post_Category',attrs,options);
}