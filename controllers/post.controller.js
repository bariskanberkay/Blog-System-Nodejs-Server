const postService = require('../services/post.service');
const Role = require('../helpers/user_roles_helper');

module.exports = {
    getAll,
    getById,
    create,
    update,
    _delete
}

function getAll(req, res, next) {
    postService.getAll()
        .then(posts => res.json(posts))
        .catch(next);
}

function getById(req, res, next) {
    
    postService.getById(req.params.id)
        .then(post => post ? res.json(post) : res.sendStatus(404))
        .catch(next);
}

function create(req, res, next) {
    postService.create(req.body,req.user.id)
        .then(post => res.json(post))
        .catch(next);
}

function update(req, res, next) {
    // users can update their own account and admins can update any account
    if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    postService.update(req.params.id, req.body)
        .then(post => res.json(post))
        .catch(next);
}

function _delete(req, res, next) {
    // users can delete their own account and admins can delete any account
    if (Number(req.params.id) !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    postService.delete(req.params.id)
        .then(() => res.json({ message: 'Post deleted successfully' }))
        .catch(next);
}