const express = require('express');
const router = express.Router();

const userSchemas = require('../schemas/user_schema');
const userController = require('../controllers/user.controller');

const authentication = require('../middlewares/authentication')
const Role = require('../helpers/user_roles_helper');

router.post('/revoke-token', authentication(), userSchemas.revokeUserToken, userController.revokeToken);
router.get('/', authentication(Role.Admin), userController.getAll);
router.get('/:id', authentication(), userController.getById);
router.post('/', authentication(Role.Admin), userSchemas.createUserSchema, userController.create);
router.put('/:id', authentication(), userSchemas.updateUserSchema, userController.update);
router.delete('/:id', authentication(), userController._delete);

module.exports = router;