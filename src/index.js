const { ApolloServer } = require('apollo-server');
const {
    ApolloServerPluginLandingPageGraphQLPlayground
} = require("apollo-server-core");
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { getUserId } = require('./utils');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const { PubSub } = require('apollo-server');

const prisma = new PrismaClient();
const pubsub = new PubSub();

const resolvers = {
    Query,
    Mutation,
    User,
    Link  
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: ({req}) => {
        return {
            ...req,
            prisma,
            pubsub,
            userId: req && req.headers.authorization
            ? getUserId(req)
            : console.log("jojojojojo")
        }
    },
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
})

server
.listen()
.then(({ url }) =>
    console.log(`Server is running on ${url}`)
);