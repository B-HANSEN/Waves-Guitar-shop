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

//==================================================
//                 USERS
//==================================================

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

app.post('/api/users/login', (req, res) => {
	// find email
	User.findOne({ email: req.body.email }, (err, user) => {
		if (!user)
			return res.json({
				loginSuccess: false,
				message: 'Auth failed, email not found',
			});
		// check password
		user.comparePassword(req.body.password, (err, isMatch) => {
			if (!isMatch)
				return res.json({ loginSuccess: false, message: 'Wrong password' });
			// generate a token
			user.generateToken((err, user) => {
				if (err) return res.status(400).send(err);
				res.cookie('w_auth', user.token).status(200).json({
					loginSuccess: true,
				});
			});
		});
	});
});

const port = process.env.PORT || 3002;

app.listen(port, () => {
	console.log(`Server running at ${port}`);
});
