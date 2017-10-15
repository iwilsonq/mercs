const express = require('express');
const basicAuth = require('basic-auth-connect');
const graphqlHTTP = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLID } = require('graphql');
require('dotenv').config();

const { NodeInterface, UserType } = require('types');
const loaders = require('loaders');
const { database } = require('database');

const PORT = process.env.PORT || 8080;
const app = express();

database.connect(err => {
	if (err) throw err;
	console.log('Connected to MySQL database!');
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQuery',
	description: 'The root query',
	fields: {
    viewer: {
      type: NodeInterface,
      resolve(source, args, context) {
        return loaders.getNodeById(context)
      }
    },
		node: {
			type: NodeInterface,
			args: {
				id: {
					type: new GraphQLNonNull(GraphQLID),
				},
			},
			resolve(source, args, context) {
				return loaders.getNodeById(args.id);
			},
		},
	},
});

const Schema = new GraphQLSchema({
	types: [UserType],
	query: RootQuery,
});

app.use(basicAuth((user, pass) => pass === 'mypassword1'));

app.use(
	'/graphql',
	graphqlHTTP(req => {
		const context = 'users:' + req.user
		return {
			schema: Schema,
			graphiql: true,
			pretty: true,
			context
		}
	})
);

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}/graphql`));
