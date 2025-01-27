const mongoose = require("mongoose");
const Joi = require("joi");

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date },
    due_date: { type: Date },
    status: { type: String, enum: ['Pending', 'In Progress', 'Hold', 'Completed'], default: 'Pending' },
    priority: { type: String, enum: ['High', 'Low', 'Medium'], default: 'Low' }
});

const Project = mongoose.model("projects", projectSchema);

const validate = (data) => {
    const schema = Joi.object({
        id: Joi.string().trim().label("Id"),
        name: Joi.string().trim().required().label("Name"),
        description: Joi.string().trim().max(500).allow(null).optional().label("Description"),
        start_date: Joi.date().raw().label("Start date"),
        end_date: Joi.date().raw().allow(null).label("End date"),
        due_date: Joi.date().raw().allow(null).label("Due date"),
        status: Joi.string().trim().valid('Pending', 'In Progress', 'Hold', 'Completed').label('Status'),
        priority: Joi.string().trim().valid('High', 'Low', 'Medium').default('Low').label('Priority')
    });
    return schema.validate(data);
};

module.exports = { Project, validate };
