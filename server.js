const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

//BodyParser Middleware
app.use(express.json());

//DB config
const db = require('./config/keys').mongoURI;

//Connect Mongodb using mongoose

mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true})
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err));


//Use Routes
app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));

//Serve static assets if in production
if(process.env.NODE_ENV === 'production'){
	//Set static folder
	app.use(express.static('client/build'));
	app.get('*', (request, response) => {
		response.sendFile(path.resolve(__dirname, 'client','build','index.html'));
	});
}


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));