const router = require("express").Router();
const { Task, validate } = require("../models/task");
const { Project } = require("../models/project");
const { ProjectUser } = require("../models/projectUser");
const { Profile } = require("../models/profile");
const { User } = require("../models/user");
const { model } = require("mongoose");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const task = await Task.findOne({ name: req.body.name, project_id: req.body.project_id });
		if (task)
			return res
				.status(409)
				.send({ message: "Task is already exists!" });

		const newTask = await new Task(req.body).save();
		res.status(201).send({ message: "Task created successfully", data: newTask });
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

		const task = await Task.findById(req.body.id);
        if (!task) return res.status(404).send({ message: "Task not found" });

		const existTask = await Task.findOne({ name: req.body.name, _id: { $ne: req.body.id } });
		if (existTask) return res.status(422).send({ message: "Task is already exist" });

        const taskdata = await Task.findByIdAndUpdate(req.body.id, {$set: req.body}, { new: true });
		return res.status(200).send({ data: taskdata, message: "Task updated successfully" });
	} catch (error) {
		res.status(500).send({ message: "Something went wrong try again later." });
	}
});
  
router.get("/:id", async (req, res) => {
	try {
		let users;
		const { id } = req.params;
		const { user_id } = req.query;
		const task = await Task.find({ project_id: id }).lean();
		const projectUser = await ProjectUser.findOne({ project_id: id, user_id }).lean().select("profile_id");
		const profile = await Profile.findById(projectUser?.profile_id);
		const results = await Promise.all(task?.map(async e=>{
			let projectUser,reporterUser;
			if (e?.assignee_id) {
			projectUser = await ProjectUser.findById(e.assignee_id).populate([{
					path: "user_id",
					model: "user"
				}, {
					path: "profile_id",
					model: "profile"
				}]).lean();
			}
			if (e?.reporter_id){

			reporterUser = await ProjectUser.findById(e.reporter_id).populate([{
					path: "user_id",
					model: "user"
				}, {
					path: "profile_id",
					model: "profile"
				}]).lean();

			}
			return { 
				...e,
				permission: profile?.permission || null,
				reporter : { id: reporterUser?._id, name: reporterUser?.user_id?.fullName, profile_name: reporterUser?.profile_id?.name },
				assignee: { id: projectUser?._id, name: projectUser?.user_id?.fullName, profile_name: projectUser?.profile_id?.name  } 
			}
		}))

		return res.status(200).send({ data: results, message: "Task loaded successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Something went wrong try again later." });
	}
})

// router.get("/:id", async (req, res) => {
// 	try {
// 		const task = await Task.findById(req.params.id);
// 		if (!task) return res.status(404).send({ message: "Task not found" });

// 		const user = await ProjectUser.find({ project_id: req.params.id }); 

// 		if (user.length) {
// 			await Promise.all(user.map(async e => {
// 				const userdetail = await User.findById(e.user_id);
// 				const profile = await Profile.findById(e.profile_id);
// 				e._doc.name = userdetail?.fullName;
// 				e._doc.profile_name = profile?.name;
// 				return { name: userdetail?.fullName, ...e };
// 			}))
// 			project._doc.users = user || [];
// 		}

// 		return res.status(200).send({ data: project, message: "Project loaded successfully" });
// 	} catch (error) {
// 		res.status(500).send({ message: "Something went wrong try again later.", data: error });
// 	}
// })

// DELETE route to delete a project by its ID
router.delete("/:id", async (req, res) => {
	try {
	  // Extract the project ID from the URL parameter
	  const projectId = req.params.id;
  
	  // Find and delete the project by ID
	  const project = await Task.findByIdAndDelete(projectId);
  
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
