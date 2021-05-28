const PostModel = require('../../models/Post');

const resolver = {
    Query: {
        async getPosts() {
            try {
                const posts = await PostModel.find()
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        }
    }

}

module.exports = resolver;