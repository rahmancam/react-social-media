const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config()

const { CONNECTION_STRING } = process.env;

const typeDefs = require('./graphql/typeDefs');
const PostModel = require('./models/Post');
const resolvers = require('./graphql/resolvers');

const PORT = process.env.PORT || 5000;

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub })
});

mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true })
    .then(() => {
        server.listen({ port: PORT })
            .then(res => console.log(`Server running @ ${res.url}`))
            .catch(console.error);
    })
    .catch(console.error);
