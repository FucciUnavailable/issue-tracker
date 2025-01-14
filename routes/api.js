'use strict';
const Issues = require('../models/Issues.js');
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let project = req.params.project;
      const params = req.query;
      if(!project) return res.send({ error: 'No project provided'})
      const issues = await Issues.find({project: project, ...params}).select('-project');

      res.send(issues);

    })
    
    .post(async function (req, res){
      let project = req.params.project;
      let data = req.body;
      data.project = project;
      console.log(data)
      const issues = new Issues(data);
      await issues.save();
      res.json(issues);
      
    })
    
    .put(async function (req, res){
      let project = req.params.project;
      let data = req.body
      const issue = await Issues.findOneAndUpdate({_id: data._id}, data, {new: true});
      await issue.save();
      res.send(issue);
    })
    
    .delete(async function (req, res){
      let project = req.params.project;
      const id = req.body._id;
      if(!id) return res.send({ error: 'No _id provided'});
      const issue = await Issues.findByIdAndDelete(id)
      res.send("deleted successfully")
    });
    
};
