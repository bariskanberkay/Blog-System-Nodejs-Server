const Joi = require('joi');
const validateRequest = require('../middlewares/validate_request');

exports.createPostSchema = (req,res,next) =>{
    
    const schema = Joi.object(
        {
            title: Joi.string().min(6).required(),
            s_description: Joi.string().required(),
            content: Joi.string().required(),
            status: Joi.string(),
            category:Joi.array(),
            tags:Joi.string(),
        }
    );
    validateRequest(req,next,schema);
}

exports.updatePostSchema = (req,res,next) =>{
    
    const schema = Joi.object(
        {
            user_id:Joi.string().empty(''),
            title: Joi.string().min(6).empty(''),
            s_description: Joi.string().empty(''),
            content: Joi.string().empty(''),
            status: Joi.string().empty(''),
            category:Joi.array().empty(''),
            tags:Joi.string(),
        }
    );


    validateRequest(req,next,schema);
}