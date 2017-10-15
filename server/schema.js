const { GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLID } = require('graphql');
const { NodeInterface, UserType } = require('types');
const loaders = require('loaders');

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

const schema = new GraphQLSchema({
	types: [UserType],
	query: RootQuery,
});

module.exports = schema;