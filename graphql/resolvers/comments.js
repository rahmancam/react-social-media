const PostModel = require('../../models/Post');
const checkAuth = require('../../helpers/check-auth');
const { UserInputError, AuthenticationError } = require('apollo-server');

const resolver = {
    Mutation: {
        async createComment(_, { postId, body }, context) {
            const { username } = checkAuth(context);

            if (body.trim() === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment body must not be empty'
                    }
                })
            }

            const post = await PostModel.findById(postId);

            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post;
            } else {
                throw new UserInputError('Post not found');
            }
        },
        async deleteComment(_, { postId, commentId }, context) {
            const { username } = checkAuth(context);

            const post = await PostModel.findById(postId);

            if (post) {
                const commentIndex = post.comments.findIndex(c => c.id === commentId);

                if (post.comments[commentIndex]) {
                    if (post.comments[commentIndex].username === username) {
                        post.comments.splice(commentIndex, 1);
                        await post.save();
                        return post;
                    } else {
                        throw new AuthenticationError('Action not allowed');
                    }
                } else {
                    throw new UserInputError('Comment not found');
                }

            } else {
                throw new UserInputError('Post not found');
            }
        },
        async likePost(_, { postId }, context) {
            const { username } = checkAuth(context);

            const post = await PostModel.findById(postId);

            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    post.likes = post.likes.filter(like => like.username !== username);
                } else {
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    });
                }
                await post.save();
                return post;
            } else {
                throw new UserInputError('Post not found');
            }
        }
    }
}

module.exports = resolver;