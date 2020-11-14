const express = require('express');
const router = express.Router();

const postController = require('../controllers/post.controller');
const authentication = require('../middlewares/authentication');
const postSchemas = require('../schemas/post_schema');

router.get('/', authentication(), postController.getAll);
router.get('/:id', authentication(), postController.getById);
router.post('/', authentication(), postSchemas.createPostSchema, postController.create);
router.put('/:id', authentication(), postSchemas.updatePostSchema, postController.update);
router.delete('/:id', authentication(), postController._delete);

module.exports = router;