const Joi = require('Joi');
const validateRequest = require('../middlewares/validate_request');
const Role = require('../helpers/user_roles_helper');

exports.createUserSchema = (req,res,next) =>{
    
    const schema = Joi.object(
        {
            email:Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
            username: Joi.string().required(),
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            role: Joi.string().valid(Role.Admin, Role.User).required()
        }
    );
    validateRequest(req,next,schema);
}

exports.updateUserSchema = (req,res,next) =>{
    
    const schema = Joi.object(
        {
            email:Joi.string().email().empty(''),
            password: Joi.string().min(6).empty(''),
            confirmPassword: Joi.string().valid(Joi.ref('password')).empty(''),
            username: Joi.string().empty(''),
            firstName: Joi.string().empty(''),
            lastName: Joi.string().empty(''),
        }
    );

    if (req.user.role === Role.Admin) {
        schema.role = Joi.string().valid(Role.Admin, Role.User).empty('');
    }

    


    validateRequest(req,next,schema);
}

exports.revokeUserToken = (req,res,next) =>{
    const schema = Joi.object({
        token: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}
