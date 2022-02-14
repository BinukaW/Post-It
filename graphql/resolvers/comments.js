// const { UserInputError } = require('apollo-server');
// const Post = require('../../models/Post.js');

// module.exports = {
//     Mutation: {
//         createComment: async (_, { postId, body }, context) => {
//             const { username } = auth(context);
//             if(body.trim() === '') {
//                 throw new UserInputError('Empty comment', {
//                     errors: {
//                         body: 'Comment body must not be empty'
//                     }
//                 })
//             }

//             const post = await Post.findById(postId);
            
//             if(post) {
//                 post.comments.unshift({
//                     body,
//                     username,
//                     createdAt: new Date().toISOString()
//                 })
//                 await post.save();
//                 return post;
//             } else throw new UserInputError('Post not found');
//         }
//     }
// }

const { UserInputError, AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post.js');
const auth = require('../../util/auth.js');

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = auth(context);
            // If comment is empty, throw error
            if(body.trim() == ''){
                throw new UserInputError('Empty Comment', {
                    errors: {
                        body: 'Comment field must not be empty'
                    }
                })
            }

            const post = await Post.findById(postId);

            if(post){
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post;
            } else throw new UserInputError('Post not found');
        },

        async deleteComment(_, { postId, commentId}, context){
            const { username } = auth(context);

            const post = await Post.findById(postId);

            if(post){
                const commentIndex = post.comments.findIndex(c => c.id === commentId);

                if(post.comments[commentIndex].username === username){
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('This Action is not allowed')
                }
            } else {
                throw new UserInputError('Post is not found');
            }
        }
    }
}