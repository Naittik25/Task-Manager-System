const mongoose = require("mongoose");
const Joi = require("joi");

const projectUserSchema = new mongoose.Schema({
    project_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'projects',
		required: false
	},
    user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		required: false
	},
    profile_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'profile',
		required: false
	},
});

const ProjectUser = mongoose.model("project_users", projectUserSchema);

const validate = (data) => {
    const schema = Joi.object({
        project_id: Joi.string().trim().label("Project Id"),
        profile_id: Joi.string().trim().label("Profile Id"),
        user_id: Joi.string().trim().label("User Id"),
    });
    return schema.validate(data);
};

module.exports = { ProjectUser, validate };