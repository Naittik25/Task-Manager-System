const router = require("express").Router();
const { Profile, validate } = require("../models/profile");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const profile = await Profile.findOne({ name: req.body.name });
		if (profile)
			return res
				.status(409)
				.send({ message: "Profile is already exists!" });

		const newProfile = await new Profile(req.body).save();
		res.status(201).send({ message: "Profile created successfully", data: newProfile });
	} catch (error) {
		res.status(500).send({ message: "Something went wrong try again later." });
	}
});

router.put("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const profile = await Profile.findById(req.body.id);
        if (!profile) return res.status(404).send({ message: "Profile not found" });

		const existProfile = await Profile.findOne({ name: req.body.name, id: { $ne: req.body.id } });
		if (existProfile) return res.status(422).send({ message: "Profile is already exist" });

        const profiledata = await Profile.findByIdAndUpdate(req.body.id, {$set: req.body}, { new: true });
		return res.status(200).send({ data: profiledata, message: "Profile updated successfully" });
	} catch (error) {
		res.status(500).send({ message: "Something went wrong try again later." });
	}
});

router.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { permission } = req.body;
  
	try {
	  // Find and update the profile with the new permissions
	  const updatedProfile = await Profile.findByIdAndUpdate(
		id,
		{ permission },
		{ new: true }
	  );
  
	  // If no profile found, return an error
	  if (!updatedProfile) {
		return res.status(404).send({ success: false, message: "Profile not found" });
	  }
  
	  // Return the updated profile
	  res.status(200).send({ success: true, data: updatedProfile });
	} catch (error) {
	  console.error("Error updating profile permissions:", error.message);
	  res.status(500).send({ success: false, message: "Internal Server Error" });
	}
  });
  
  

router.get("/", async (req, res) => {
	try {
		const profile = await Profile.find();

		return res.status(200).send({ data: profile, message: "Profile loaded successfully" });
	} catch (error) {
				res.status(500).send({ message: "Something went wrong try again later." });
	}
})

// DELETE route to delete a profile by its ID
router.delete("/:id", async (req, res) => {
	try {
	  // Extract the profile ID from the URL parameter
	  const profileId = req.params.id;
  
	  // Find and delete the profile by ID
	  const profile = await Profile.findByIdAndDelete(profileId);
  
	  // If no profile was found, send an error response
	  if (!profile) {
		return res.status(404).send({ message: "Profile not found" });
	  }
  
	  // If deletion was successful, send a success response
	  return res.status(200).send({ message: "Profile deleted successfully" });
	} catch (error) {
	  console.error(error);
	  return res.status(500).send({ message: "Something went wrong, please try again later." });
	}
  });
  
module.exports = router;
