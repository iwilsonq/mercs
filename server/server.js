const express = require('express');
const basicAuth = require('basic-auth-connect');
const graphqlHTTP = require('express-graphql');
require('dotenv').config();

const { database } = require('database');
const schema = require('schema');

const PORT = process.env.PORT || 8080;
const app = express();

database.connect(err => {
	if (err) throw err;
	console.log('Connected to MySQL database!');
});

app.use(basicAuth((user, pass) => pass === 'mypassword1'));

app.get('/', (req, res) => {
	res.send({ mercs: 'online' })
})

app.use(
	'/graphql',
	graphqlHTTP(req => {
		const context = 'users:' + req.user
		return {
			schema,
			context,
			graphiql: true,
			pretty: true
		}
	})
);

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}/graphql`));
