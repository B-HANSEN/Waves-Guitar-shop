const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_I = 10;
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		unique: 1,
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
	},
	name: {
		type: String,
		required: true,
		maxlength: 100,
	},
	lastname: {
		type: String,
		required: true,
		maxlength: 100,
	},
	cart: {
		type: Array,
		default: [],
	},
	history: {
		type: Array,
		default: [],
	},
	role: {
		type: Number,
		default: 0, // user instead of admin
	},
	token: {
		type: String,
	},
});

userSchema.pre('save', function (next) {
	var user = this;

	if (user.isModified('password')) {
		bcrypt.genSalt(SALT_I, function (err, salt) {
			if (err) return next(err);

			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) return next(err);
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

userSchema.methods.generateToken = function (cb) {
	var user = this;
	var token = jwt.sign(user._id.toHexString(), process.env.SECRET); // mongo saves as user._id

	user.token = token;
	user.save(function (err, user) {
		if (err) return cb(err);
		cb(null, user);
	});
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
