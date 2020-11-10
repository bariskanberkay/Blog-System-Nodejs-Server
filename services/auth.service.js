const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const { Op } = require('sequelize');
const db = require('../helpers/database_helper');
const Role = require('../helpers/user_roles_helper');


module.exports = {
    login,
    register,
    refreshToken,
    verifyEmail,
    forgotPassword,
    validateResetToken,
    resetPassword
}

async function login({ email, password, ipAddress }) {
    const user = await db.User.scope('withHash').findOne({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw 'Email or password is incorrect';
    }

    if (!user.isVerified) {
        throw 'Account Not Verified';
    }

    

    const jwtToken = generateJwtToken(user);
    const createdRefreshToken = generateRefreshToken(user, ipAddress);

    console.log(createdRefreshToken)
    await createdRefreshToken.save();

    return {
        ...basicDetails(user),
        jwtToken,
        refreshToken: createdRefreshToken.token
    };

}

async function register(params, origin) {
    if (await db.User.findOne({ where: { email: params.email } })) {
        //return await sendAlreadyRegisteredEmail(params.email, origin);
        throw 'Account Already Registered';
    }

    const account = new db.User(params);

    const isFirstAccount = (await db.User.count()) === 0;
    account.role = isFirstAccount ? Role.Admin : Role.User;
    account.verificationToken = randomTokenString();

    account.password = await hash(params.password);

    await account.save();

    //await sendVerificationEmail(account, origin);
}




async function refreshToken({ token, ipAddress }) {
    const refreshToken = await getRefreshToken(token);
    const account = await refreshToken.getUser();

    // replace old refresh token with a new one and save
    const newRefreshToken = generateRefreshToken(account, ipAddress);
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // generate new jwt
    const jwtToken = generateJwtToken(account);

    // return basic details and tokens
    return {
        ...basicDetails(account),
        jwtToken,
        refreshToken: newRefreshToken.token
    };
}

async function verifyEmail({ token }) {
    const user = await db.User.findOne({ where: { verificationToken: token } });

    if (!user) throw 'Verification failed';

    user.verified = Date.now();
    user.verificationToken = null;
    await user.save();
}

async function forgotPassword({ email }, origin) {
    const user = await db.User.findOne({ where: { email } });

    
    if (!user) return;

    
    user.resetToken = randomTokenString();
    user.resetTokenExpires = new Date(Date.now() + 24*60*60*1000);
    await user.save();


    //await sendPasswordResetEmail(account, origin);
}

async function validateResetToken({ token }) {
    const user = await db.User.findOne({
        where: {
            resetToken: token,
            resetTokenExpires: { [Op.gt]: Date.now() }
        }
    });

    if (!user) throw 'Invalid token';

    return user;
}

async function resetPassword({ token, password }) {
    const user = await validateResetToken({ token });

   
    user.passwordHash = await hash(password);
    user.passwordReset = Date.now();
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();
}

//HELPERS

async function hash(password) {
    return await bcrypt.hash(password, 10);
}


function generateJwtToken(user) {

    return jwt.sign({ sub: user.id, id: user.id }, config.app_secret, { expiresIn: '15m' });
}

function generateRefreshToken(user, ipAddress) {

    return new db.RefreshToken({
        userId: user.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdByIp: ipAddress
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function basicDetails(user) {
    const { id, title, firstName, lastName, email, role, created, updated, isVerified } = user;
    return { id, title, firstName, lastName, email, role, created, updated, isVerified };
}



async function getRefreshToken(token) {
    const refreshToken = await db.RefreshToken.findOne({ where: { token } });
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

