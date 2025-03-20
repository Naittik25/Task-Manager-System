const mongoose = require("mongoose");
const Joi = require("joi");

const taskSchema = new mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'projects',
        required: false
    },
    name: { type: String, required: true },
    description: { type: String },
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date },
    due_date: { type: Date },
    status: { type: String, enum: ['Pending', 'In Progress', 'Hold', 'Completed', 'In Testing', 'Ready For Deploy'], default: 'Pending' },
    priority: { type: String, enum: ['High', 'Low', 'Medium'], default: 'Low' },
    reporter_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project_users',
        required: false
    },
    assignee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project_users',
        required: false
    },
    estimate_hour: { type: String },
    task_log_hour: { type: String },
    task_type: { type: String, enum: ['New Implementation', 'Enhancement', 'Bug', 'Customization', 'Optimization'] }
});

const Task = mongoose.model("tasks", taskSchema);

const validate = (data) => {
    const schema = Joi.object({
        id: Joi.string().trim().label("Id"),
        project_id: Joi.string().trim().required().label("Project Id"),
        name: Joi.string().trim().required().label("Name"),
        description: Joi.string().trim().max(500).allow(null).optional().allow("").label("Description"),
        start_date: Joi.date().raw().allow(null).allow("").label("Start date"),
        end_date: Joi.date().raw().allow(null).allow("").label("End date"),
        due_date: Joi.date().raw().allow(null).allow("").label("Due date"),
        status: Joi.string().trim().valid('Pending', 'In Progress', 'Hold', 'Completed', 'In Testing', 'Ready For Deploy').label('Status'),
        priority: Joi.string().trim().valid('High', 'Low', 'Medium').default('Low').label('Priority'),
        reporter_id: Joi.string().trim().allow(null).allow("").label("Reported Id"),
        assignee_id: Joi.string().trim().allow(null).allow("").label("Assignee Id"),
        estimate_hour: Joi.string().trim().allow(null).allow("").label("Estimation hour"),
        task_log_hour: Joi.string().trim().allow(null).allow("").label("Task log hour"),
        task_type: Joi.string().trim().valid('New Implementation', 'Enhancement', 'Bug', 'Customization', 'Optimization').label('Task type'),
    });
    return schema.validate(data);
};

module.exports = { Task, validate };
