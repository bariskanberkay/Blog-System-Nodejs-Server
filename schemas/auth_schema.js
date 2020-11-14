const Joi = require('joi');
const validateRequest = require('../middlewares/validate_request');

exports.loginSchema = (req,res,next) => {
    const schema = Joi.object(
        {
            email:Joi.string().required(),
            password: Joi.string().required()
        }
    );
    validateRequest(req,next,schema);
}

exports.registerSchema = (req,res,next) =>{
    
    const schema = Joi.object(
        {
            email:Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
            username: Joi.string().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
        }
    );
    validateRequest(req,next,schema);
}

exports.verifyEmailSchema = (req,res,next) =>{
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

exports.forgotPasswordSchema = (req,res,next) =>{
    const schema = Joi.object({
        email: Joi.string().email().required()
    });
    validateRequest(req, next, schema);
}

exports.validateResetTokenSchema = (req,res,next) =>{
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

exports.resetPasswordSchema = (req,res,next) =>{
    const schema = Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    });
    validateRequest(req, next, schema);
}