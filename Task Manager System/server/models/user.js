const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const crypto = require('crypto');

const secretKey = crypto.randomBytes(64).toString('hex');

const userSchema = new mongoose.Schema({
	fullName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	isAdmin: { type: Boolean, default: false }, // Add isAdmin field with default value
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, secretKey, {
		expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		fullName: Joi.string().required().label("Full Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
		isAdmin: Joi.boolean().optional().label("Admin Status"), // Validation for isAdmin field
	});
	return schema.validate(data);
};

const editvalidate = (data) => {
	const schema = Joi.object({
		id: Joi.string().required().label("Id"), // Corrected to string (ObjectId)
		fullName: Joi.string().required().label("Full Name"),
		profile_id: Joi.string().optional().label("Profile Id"),
		email: Joi.string().email().required().label("Email"),
		isAdmin: Joi.boolean().optional().label("Admin Status"), // Validation for isAdmin field
	});
	return schema.validate(data);
};

module.exports = { User, validate, editvalidate };
