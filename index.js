const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');
const { CONNECTION_STRING } = require('./config');

const PostModel = require('./models/Post');

const typeDefs = gql`
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
    }
    
    type Query {
        getPosts: [Post]
    }
`

const resolvers = {
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


const server = new ApolloServer({
    typeDefs,
    resolvers
});


mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true })
    .then(() => {
        server.listen({ port: 5000 })
            .then(res => console.log(`Server running @ ${res.url}`))
            .catch(console.error);
    })
    .catch(console.error);
