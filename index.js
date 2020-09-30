const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://crud_user:Muna789@cluster0.zjgsq.mongodb.net/cruddb?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

client.connect((err) => {
	const collection = client.db('cruddb').collection('users');
	app.get('/users', (req, res) => {
		collection.find({}).toArray((err, documents) => {
			res.send(documents);
		});
	});

	app.get('/user/:id', (req, res) => {
		collection.find({ _id: ObjectID(req.params.id) }).toArray((err, documents) => {
			res.send(documents[0]);
		});
	});
	app.post('/addUser', (req, res) => {
		const user = req.body;
		collection.insertOne(user).then((result) => {
			console.log('products added successfully');
			res.send('success');
		});
	});

	app.delete('/delete/:id', (req, res) => {
		collection.deleteOne({ _id: ObjectID(req.params.id) }).then((result) => {
			console.log(result);
		});
	});

	app.patch('/update/:id', (req, res) => {
		console.log(req.body.name);
		collection
			.updateOne(
				{ _id: ObjectID(req.params.id) },
				{
					$set: { name: req.body.name, age: req.body.age },
				}
			)
			.then((result) => {});
	});
});

app.listen(3000, () => {
	console.log('Running on 3000');
});
