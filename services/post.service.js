const db = require('../helpers/database_helper');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    const posts = await db.Post.findAll();
    return posts;
}

async function getById(id) {
    return getPost(id);
}


async function create(params,userId) {
   
    
    params.created = Date.now();
    params.user_id = userId;
    if(params.status === 'published'){
        params.published = Date.now();
    }

    const post = await db.Post.create(params);
    let tags ;
    if(params.tags != '' && params.tags != undefined){
        let tagsRawArray = [];
        let tagsRaw = params.tags.split(',');
            
        tagsRaw.forEach(element => {
           let tag = createTags(element);
           tagsRawArray.push(tag)
        });
        tags = await Promise.all(tagsRawArray);
        console.log(tags)
         await post.addTags(tags)
    }
    
    if(Array.isArray(params.category) && params.category.length > 0){
        let categoriesRaw = []
        params.category.forEach(element => {
            categoriesRaw.push( db.Category.findByPk(element.id));
         });
         categories = await Promise.all(categoriesRaw);
         await post.addCats(categories)
    }


    return getPost(post.id);
}
async function update(id, params) {
    const post = await getPost(id);


    Object.assign(post, params);
    post.updated = Date.now();

    if(params.status === 'published' && post.published === null){
        post.published = Date.now();
    }
    if(params.tags != '' && params.tags != undefined){
        let tagsRawArray = [];
        let tagsRaw = params.tags.split(',');
            
        tagsRaw.forEach(element => {
           let tag = createTags(element);
           tagsRawArray.push(tag)
        });
        tags = await Promise.all(tagsRawArray);
    
         await post.addTags(tags)
    }
    if(Array.isArray(params.category) && params.category.length > 0){
        let categoriesRaw = []
        params.category.forEach(element => {
            categoriesRaw.push( db.Category.findByPk(element.id));
         });
         categories = await Promise.all(categoriesRaw);
         await post.addCats(categories)
    }

    await post.save();
    return getPost(post.id);
}

async function _delete(id) {
    const post = await getPost(id);
    await post.destroy();
}


async function getPost(id) {
    const post = await db.Post.findByPk(id,{
        include: [
            { model: db.Category, as: 'cats', through: { attributes: [] } },
            { model: db.Tag, as: 'tags', through: { attributes: [] } }
        ]
    });
    if (!post) throw 'Post not found';
    return post;
}

async function createTags(tagTitle){
    const [tag,status] = await db.Tag.findOrCreate({where: {title: tagTitle}})
  return tag;
}

