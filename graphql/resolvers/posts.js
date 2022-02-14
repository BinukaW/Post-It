const { AuthenticationError, UserInputError} = require('apollo-server');
const { argsToArgsConfig } = require('graphql/type/definition');

const Post = require('../../models/Post.js');
const auth = require('../../util/auth.js');


module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts
            } catch(err){
                throw new Error(err);
            }
        },
        async getPost(_, { postId }) {
            try{
                const post = await Post.findById(postId);
                if(post){
                    return post;
                } else {
                    throw new Error('Post not found')
                }
            } catch (err){
                throw new Error(err);
            }
        }
    }, 
    Mutation: {
        async createPost(_, { body }, context){
            const user = auth(context);
            console.log(user);
            if (argsToArgsConfig.body.trim() === '') {
                throw new Error('Post area must not be empty');
            }

            const newPost = new Post({ 
                body,
                user: user.id,
                username:user.username,
                createdAt: new Date().toISOString()
            });
            const post = await newPost.save();

            return post;
        },
        async deletePost(_, { postId }, context) {
            const user = auth(context);

            try{
                const post = await Post.findById(postId);
                if(user.username === post.username) {
                    await post.delete();
                    return 'Post deleted';
                } else {
                    throw new AuthenticationError('This action is not allowed');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async likePost(_, { postId }, context){
            const { username } = auth(context);

            const post = await Post.findById(postId);
            if(post){
                if(post.likes.find(like => like.username === username)){
                    post.likes = post.likes.filter(like => like.username !== username);
                } else {
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString(),
                    })
                }
                
                await post.save();
                return
            } else throw new UserInputError('Post not found')
        }

    }
}