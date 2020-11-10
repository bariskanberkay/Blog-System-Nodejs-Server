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


    //RELATIONSHIPS
    db.User.hasMany(db.RefreshToken,{onDelete: 'CASCADE'});
    db.RefreshToken.belongsTo(db.User);

    //SYNC ALL MODELS
    await seq.sync();


}