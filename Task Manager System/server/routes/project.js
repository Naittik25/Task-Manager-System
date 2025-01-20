const router = require("express").Router();
const { Project, validate } = require("../models/project");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const project = await Project.findOne({ name: req.body.name });
		if (project)
			return res
				.status(409)
				.send({ message: "Profile is already exists!" });

		const newProject = await new Project(req.body).save();
		res.status(201).send({ message: "Project created successfully", data: newProject });
	} catch (error) {
		res.status(500).send({ message: "Something went wrong try again later." });
	}
});

router.put("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const project = await Project.findById(req.body.id);
        if (!project) return res.status(404).send({ message: "Project not found" });

		const existProject = await Project.findOne({ name: req.body.name, id: { $ne: req.body.id } });
		if (existProject) return res.status(422).send({ message: "Project is already exist" });

        const projectdata = await Project.findByIdAndUpdate(req.body.id, {$set: req.body}, { new: true });
		return res.status(200).send({ data: projectdata, message: "Project updated successfully" });
	} catch (error) {
		res.status(500).send({ message: "Something went wrong try again later." });
	}
});
  
router.get("/", async (req, res) => {
	try {
		const project = await Project.find();

		return res.status(200).send({ data: project, message: "Project loaded successfully" });
	} catch (error) {
		res.status(500).send({ message: "Something went wrong try again later." });
	}
})

// DELETE route to delete a project by its ID
router.delete("/:id", async (req, res) => {
	try {
	  // Extract the project ID from the URL parameter
	  const projectId = req.params.id;
  
	  // Find and delete the project by ID
	  const project = await Project.findByIdAndDelete(projectId);
  
	  // If no profile was found, send an error response
	  if (!project) {
		return res.status(404).send({ message: "Project not found" });
	  }
  
	  // If deletion was successful, send a success response
	  return res.status(200).send({ message: "Project deleted successfully" });
	} catch (error) {
	  console.error(error);
	  return res.status(500).send({ message: "Something went wrong, please try again later." });
	}
  });
  
module.exports = router;
