const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    project: { type: String, required: true }, // Field to identify the project
    issue_title: String, 
    issue_text: String,
    created_on: { type: Date, default: Date.now, immutable: true },
    updated_on: { type: Date, default: Date.now },
    created_by: String,
    assigned_to: String,
    open: { type: Boolean, default: true },
    status_text: String
});

// Middleware to automatically update the 'updated_on' field
IssueSchema.pre('save', function (next) {
    this.updated_on = Date.now();
    next();
});

const Issues = mongoose.model('Issues', IssueSchema);

module.exports = Issues;
