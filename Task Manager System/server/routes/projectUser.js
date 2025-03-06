const router = require("express").Router();
const { ProjectUser, validate } = require("../models/projectUser");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await ProjectUser.findOne({
			project_id: req.body.project_id,
			user_id: req.body.user_id,
			profile_id: req.body.profile_id
		});
		if (user)
			return res
				.status(409)
				.send({ message: "Project User is already exists!" });

		const newProject = await new ProjectUser(req.body).save();
		res.status(201).send({ message: "Project User created successfully", data: newProject });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Something went wrong try again later." });
	}
});

router.put("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const projectUser = await ProjectUser.findById(req.body.id);
        if (!projectUser) return res.status(404).send({ message: "Project User not found" })

        const profiledata = await ProjectUser.findByIdAndUpdate(req.body.id, {$set: req.body}, { new: true });
		return res.status(200).send({ data: profiledata, message: "Project User updated successfully" });
	} catch (error) {
		res.status(500).send({ message: "Something went wrong try again later." });
	}
});  

router.get("/", async (req, res) => {
	try {
		const projectUser = await ProjectUser.find().populate([
			{
				model: "user",
				path: "user_id"
			},
			{
				model: "profile",
				path: "profile_id"
			}
		]);

		return res.status(200).send({ data: projectUser, message: "Project User loaded successfully" });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Something went wrong try again later." });
	}
})

// DELETE route to delete a projectUser by its ID
router.delete("/:id", async (req, res) => {
	try {
	  // Extract the projectUser ID from the URL parameter
	  const profileId = req.params.id;
  
	  // Find and delete the projectUser by ID
	  const projectUser = await ProjectUser.findByIdAndDelete(profileId);
  
	  // If no projectUser was found, send an error response
	  if (!projectUser) {
		return res.status(404).send({ message: "Project User not found" });
	  }
  
	  // If deletion was successful, send a success response
	  return res.status(200).send({ message: "Project User deleted successfully" });
	} catch (error) {
	  console.error(error);
	  return res.status(500).send({ message: "Something went wrong, please try again later." });
	}
  });
  
module.exports = router;
