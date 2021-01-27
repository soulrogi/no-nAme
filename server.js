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

let contactsCount = contacts.length;

app.use(express.json());

app.get('/api-v1/contacts/count', async (req, res) => {
	res.set({
		'Cache-Control': 'no-cache',
		'Content-Type': 'text/event-stream',
		'Connection': 'keep-alive'
	});
	res.flushHeaders();

	res.write('retry: 10000\n\n');

	res.write(`data: ${JSON.stringify({contactsCount: contacts.length})}\n\n`);
	res.write(`id: ${v4()}\n\n`);

	while (true) {
		await new Promise(resolve => setTimeout(resolve, 1000));

		if (contactsCount !== contacts.length) {
			contactsCount = contacts.length

			res.write(`data: ${JSON.stringify({contactsCount: contacts.length})}\n\n`);
			res.write(`id: ${v4()}\n\n`);
		}

		// res.write(`event: customEvent\ndata: ${v4()}\n\n`);
	}
});

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
