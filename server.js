const express = require('express');
const path    = require('path');
const {v4}    = require('uuid');
const app     = express();

let contacts = [{
	id:     v4(),
	name:   'Громозека',
	value:  '320кг',
	marked: false,
}];

app.use(express.json());

app.get('/api-v1/contacts', (req, res) => {
	res.status(200).json(contacts);
});

app.post('/api-v1/contacts', (req, res) => {
	const contact = {
		...req.body,
		id: v4(),
		marked: false
	};

	contacts.push(contact);

	res.status(201).json(contact);
});

app.delete('/api-v1/contacts/:id', (req, res) => {
	contacts = contacts.filter(item => item.id !== req.params.id);

	res.json({message: 'Contact was deleted'});
})

app.put('/api-v1/contacts/:id', (req, res) => {
	const contactsIndex     = contacts.findIndex(item => item.id === req.params.id);
	contacts[contactsIndex] = req.body;

	res.status(200).json(contacts[contactsIndex]);
})

//region -- Basic
let clientDir = 'client';
app.use(express.static(path.resolve(__dirname, clientDir)));

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, clientDir, 'index.html'));
});

app.listen(3000, () => {
	console.log('Started server');
});
//endregion
