const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');
const { CONNECTION_STRING } = require('./config');

const typeDefs = require('./graphql/typeDefs');
const PostModel = require('./models/Post');
const resolvers = require('./graphql/resolvers');

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub })
});

mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true })
    .then(() => {
        server.listen({ port: 5000 })
            .then(res => console.log(`Server running @ ${res.url}`))
            .catch(console.error);
    })
    .catch(console.error);
