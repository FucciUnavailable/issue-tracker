'use strict';
const Issues = require('../models/Issues.js');
module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let project = req.params.project;
      const params = req.query;
      if(!project) return res.send({ error: 'No project provided'})
      const issues = await Issues.find({project: project, ...params});
      res.send(issues);

    })
    
    .post(async function (req, res){
      let project = req.params.project;
      let data = req.body;
      if(!data.issue_title || !data.issue_text || !data.created_by) return res.send({ error: 'required field(s) missing' });
      data.project = project;
      console.log(data)
      const issues = new Issues(data);
      await issues.save();
      res.json(issues);
      
    })
    
    .put(async function (req, res) {
      let project = req.params.project; // Not currently used, but kept for context
      let data = req.body;
      let dataLength = Object.keys(data).length;
      if(!data._id) return res.send({ error: 'missing _id' });
      if (dataLength<=1) {
        return res.send({ error: 'no update field(s) sent', '_id': data._id  });
      }
    
      try {
        const issue = await Issues.findOneAndUpdate(
          { _id: data._id },  // Find the document by its _id
          {...data,  updated_on: new Date()},               // Update with the new data
          { new: true }       // Return the updated document
        );
    
        if (!issue) {
          return res.send({ error: 'could not update', '_id': data._id });
        }
    
        res.send({ result: 'successfully updated', '_id': issue._id });
      } catch (error) {
        res.send({ error: 'could not update', '_id': data._id });
      }
    }) 
    .delete(async function (req, res){
      let project = req.params.project;
      const id = req.body._id;
      if(!id) return res.send({ error: 'missing _id' });
      const issue = await Issues.findByIdAndDelete(id)
      if(!issue){
        return res.send({ error: 'could not delete', '_id': id });
      }
      res.send({ result: 'successfully deleted', '_id': id })
    });
    
};
