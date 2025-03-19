const router = require("express").Router();
const { Project, validate } = require("../models/project");
const { Task } = require("../models/task");
const { ProjectUser } = require("../models/projectUser");
const { Profile } = require("../models/profile");
const { User } = require("../models/user");

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

		const existProject = await Project.findOne({ name: req.body.name, _id: { $ne: req.body.id } });
		if (existProject) return res.status(422).send({ message: "Project is already exist" });

        const projectdata = await Project.findByIdAndUpdate(req.body.id, {$set: req.body}, { new: true });
		return res.status(200).send({ data: projectdata, message: "Project updated successfully" });
	} catch (error) {
		res.status(500).send({ message: "Something went wrong try again later." });
	}
});
  
router.get("/", async (req, res) => {
	try {
		let result;
		const project = await Project.find().lean();
		if (!req.query.isAdmin) {
			const projectUser = await ProjectUser.find({ user_id: req.query.user_id }).lean();
			const projectId = projectUser?.map(e=>e?.project_id?.toString());
			result = project.filter(i=> projectId.includes(i._id.toString()));
		} else result = project;
		result = await Promise.all(result?.map(async e => {
			const tasks = await Task.count({ project_id: e._id });
			const completeTask = await Task.count({ project_id: e._id, status: "Completed" });
			const task = (100 * (completeTask || 0))/(tasks || 1);
			return { ...e, task }
		}))
		return res.status(200).send({ data: result, message: "Project loaded successfully" });
	} catch (error) {
		res.status(500).send({ message: "Something went wrong try again later." });
	}
})

router.get("/:id", async (req, res) => {
	try {
		const project = await Project.findById(req.params.id).lean();
		if (!project) return res.status(404).send({ message: "Project not found" });

		const tasks = await Task.find({ project_id: req.params.id });

		const user = await ProjectUser.find({ project_id: req.params.id }); 

		if (user.length) {
			await Promise.all(user.map(async e => {
				const userdetail = await User.findById(e.user_id);
				const profile = await Profile.findById(e.profile_id);
				e._doc.name = userdetail?.fullName;
				e._doc.profile_name = profile?.name;
				e._doc.permission = profile?.permission;
				return { name: userdetail?.fullName, ...e };
			}))
			project.users = user || [];
		}

		return res.status(200).send({ data: { ...project, tasks }, message: "Project loaded successfully" });
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Something went wrong try again later.", data: error });
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
