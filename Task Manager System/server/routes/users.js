const router = require("express").Router();
const { User, validate, editvalidate } = require("../models/user");
const { Profile } = require("../models/profile");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Something went wrong try again later." });
	}
});

router.put("/", async (req, res) => {
	try {
		const { error } = editvalidate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findById(req.body.id);
		if (!user)
			return res
				.status(404)
				.send({ message: "User not found!" });

		if (req.body.profile_id) {
			const profile = await Profile.findById(req.body.id);
			if (!profile) return res.status(404).send({ message: "Profile not found" });
		}

		await User.findByIdAndUpdate(req.body.id, {$set: req.body});
		return res.status(200).send({ message: "User updated successfully" });
	} catch (error) {
		res.status(500).send({ message: "Something went wrong try again later." });
	}
});

router.get("/", async (req, res) => {
	try {
		const user = await User.find();

		return res.status(200).send({ data: user, message: "User loaded successfully" });
	} catch (error) {
		res.status(500).send({ message: "Something went wrong try again later." });
	}
})

module.exports = router;
