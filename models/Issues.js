const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    project: { type: String, required: true }, // Field to identify the project
    issue_title: {type:String, default: ""},
    issue_text:  {type:String, default: ""}, 
    created_on: { type: Date, default: Date.now, immutable: true },
    updated_on: { type: Date, default: Date.now },
    created_by:  {type:String, default: ""}, 
    assigned_to:  {type:String, default: ""}, 
    open: { type: Boolean, default: true },
    status_text:  {type:String, default: ""}, 
});

// Middleware to automatically update the 'updated_on' field
IssueSchema.pre('save', function (next) {
    this.updated_on = Date.now();
    next();
});

const Issues = mongoose.model('Issues', IssueSchema);

module.exports = Issues;
