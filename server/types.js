const { 
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString
} = require('graphql');

const tables = require('tables');
const loaders = require('loaders');

const NodeInterface = new GraphQLInterfaceType({
  name: 'Node',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolveType: (source) => {
    console.log('NodeInterface.resolveType')
    if (source.__tableName === tables.users.getName()) {
      return UserType;
    }
    // return PostType;
  }
});

const resolveId = (source) => {
  console.log(source);
  return tables.dbIdToNodeId(source.id, source.__tableName);
};

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'The User type represents a user of our application',
  interfaces: [ NodeInterface ],
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLID),
        resolve: resolveId
      },
      name: { type: new GraphQLNonNull(GraphQLString) },
      about: { type: GraphQLString },
    }
  }
})

module.exports = {
  NodeInterface,
  UserType
};