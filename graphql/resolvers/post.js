const PostModel = require('../../models/Post');
const checkAuth = require('../../helpers/check-auth');
const { AuthenticationError } = require('apollo-server');

const resolver = {
    Query: {
        async getPosts() {
            try {
                const posts = await PostModel.find().sort({ createdAt: -1 })
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPost(_, { postId }) {
            try {
                const post = await PostModel.findById(postId);
                if (post) {
                    return post
                } else {
                    throw new Error('Post not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) {
            const user = checkAuth(context);

            const newPost = new PostModel({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save();

            context.pubsub.publish('NEW_POST', {
                newPost: post
            });
            return post;
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);

            try {
                const post = await PostModel.findById(postId);
                if (user.username === post.username) {
                    await (await post).delete();
                    return 'Post deleted successfully';
                } else {
                    throw new AuthenticationError('Action not allowed');
                }

            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Subscription: {
        newPost: {
            subscribe(_, __, { pubsub }) {
                return pubsub.asyncIterator('NEW_POST');
            }
        }
    }
}

module.exports = resolver;