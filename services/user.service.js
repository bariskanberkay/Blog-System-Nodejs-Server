const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const { Op } = require('sequelize');
const db = require('../helpers/database_helper');
const Role = require('../helpers/user_roles_helper');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    const users = await db.User.findAll();
    return users.map(x => basicDetails(x));
}

async function getById(id) {
    const user = await getUser(id);
    return basicDetails(user);
}

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const user = new db.User(params);
    user.verified = Date.now();

    // hash password
    user.password = await hash(params.password);

    // save account
    await user.save();

    return basicDetails(user);
}

async function update(id, params) {
    const user = await getUser(id);

    // validate (if email was changed)
    if (params.email && user.email !== params.email && await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.password = await hash(params.password);
    }

    // copy params to account and save
    Object.assign(user, params);
    user.updated = Date.now();
    await user.save();

    return basicDetails(user);
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}


/////////////
async function hash(password) {
    return await bcrypt.hash(password, 10);
}

function basicDetails(user) {
    const { id, title, firstName, lastName, email, role, created, updated, isVerified } = user;
    return { id, title, firstName, lastName, email, role, created, updated, isVerified };
}

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'Account not found';
    return user;
}