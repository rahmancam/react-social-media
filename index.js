const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const { CONNECTION_STRING } = require('./config');

const typeDefs = require('./graphql/typeDefs');
const PostModel = require('./models/Post');
const resolvers = require('./graphql/resolvers');

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
