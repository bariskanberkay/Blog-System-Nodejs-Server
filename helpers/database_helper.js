const config = require('config.json');
const mysql = require('mysql2/promise');

const { Sequelize } = require('sequelize');

module.exports = db = {}

initialize();

async function initialize() {

    const { host, port, user, password, database } = config.database;
    const con = await mysql.createConnection({ host, port, user, password });

    await con.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    const seq = new Sequelize(database, user, password, { dialect: 'mysql' });



    //MODELS
    db.User = require('../models/user.model')(seq);
    db.RefreshToken = require('../models/refresh_token.model')(seq);
    db.Post = require('../models/post_model')(seq);
    db.Category = require('../models/category_model')(seq);
    db.PostCategory = require('../models/post_category_model')(seq);

    db.Tag = require('../models/tag_model')(seq);
    db.PostTag = require('../models/post_tag_model')(seq);


    
    //RELATIONSHIPS
    db.User.hasMany(db.RefreshToken,{onDelete: 'CASCADE'});
    db.RefreshToken.belongsTo(db.User);

    db.Post.belongsToMany(db.Category,{
        through: db.PostCategory,
        foreignKey:'post_id',
        as:'cats'
    });

    db.Category.belongsToMany(db.Post,{
        through: db.PostCategory,
        foreignKey:'category_id',
        as:'posts'
    });

    db.Post.belongsToMany(db.Tag,{
        through: db.PostTag,
        foreignKey:'post_id',
        as:'tags'
    });

    db.Tag.belongsToMany(db.Post,{
        through: db.PostTag,
        foreignKey:'tag_id',
        as:'posts'
    });

    //SYNC ALL MODELS
    await seq.sync();


}