const express = require('express');
const connectDB = require('../config/db');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
// connect db
connectDB();

// const mongoose = require('mongoose');
// require('dotenv').config();

// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.DATABASE, {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Models
const { User } = require('./models/user');

app.post('/api/users/register', (req, res) => {
	const user = new User(req.body);
	user.save((err, doc) => {
		if (err) return res.json({ success: false, err });
		res.status(200).json({
			success: true,
			userdata: doc,
		});
	});
});

const port = process.env.PORT || 3002;

app.listen(port, () => {
	console.log(`Server running at ${port}`);
});
