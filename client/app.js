import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'

new Vue({
	el: '#app',
	data: () => ({
		form: {
			name: '',
			value: '',
		},
		contacts: [],
	}),
	async mounted() {
		this.contacts = await request('/api-v1/contacts');
	},
	methods: {
		async createContact() {
			const contact = await request('/api-v1/contacts', 'POST', {...this.form});

			this.contacts.push(contact);

			this.form.name = '';
			this.form.value = '';
		},
		async markContact(id) {
			const contact        = this.contacts.find(item => item.id === id);
			const updatedContact = await request(`/api-v1/contacts/${id}`, 'PUT', {
				...contact,
				marked: true,
			});

			contact.marked = updatedContact.marked;
		},
		async removeContact(id) {
			await request(`/api-v1/contacts/${id}`, 'DELETE');

			this.contacts = this.contacts.filter(item => item.id !== id);
		},
	},
	computed: {
		canCreate() {
			return this.form.value.trim() && this.form.name.trim();
		}
	},
});

async function request(url, method = 'GET', date = null) {
	try {
		const headers = {};
		let body;

		if (date) {
			headers['Content-Type'] = 'application/json';
			body                    = JSON.stringify(date);
		}

		const response = await fetch(url, {
			method,
			headers,
			body,
		})

		return await response.json();
	}
	catch (e) {
		console.log('Error: ', e.message);
	}
}
