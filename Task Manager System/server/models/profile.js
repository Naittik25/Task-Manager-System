const mongoose = require("mongoose");
const Joi = require("joi");

const profileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    permission: { type: mongoose.Schema.Types.Mixed, default: {} }
});

const Profile = mongoose.model("profile", profileSchema);

const validate = (data) => {
    const schema = Joi.object({
        id: Joi.string().trim().label("Id"),
        name: Joi.string().trim().required().label("Name"),
        description: Joi.string().trim().max(500).allow(null).allow("").optional().label("Description"),
        permission: Joi.object({
            create_task: Joi.boolean().default(false).label("Create Task"),
            edit_task: Joi.boolean().default(false).label("Edit Task"),
            delete_task: Joi.boolean().default(false).label("Delete Task"),
            view_task: Joi.boolean().default(false).label("View Task"),
            assign_task: Joi.boolean().default(false).label("Assign Task"),
        }).optional().allow(null).label("Permission")
    });
    return schema.validate(data);
};

module.exports = { Profile, validate };
