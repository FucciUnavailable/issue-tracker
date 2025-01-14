const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  const project = 'test-project';
  let testId; // To store an issue ID for subsequent tests

  suite('POST /api/issues/:project', function () {
    test('Create an issue with every field', function (done) {
      chai
        .request(server)
        .post(`/api/issues/${project}`)
        .send({
          issue_title: 'Test Issue',
          issue_text: 'This is a test issue.',
          created_by: 'Tester',
          assigned_to: 'Dev',
          status_text: 'In Progress',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.equal(res.body.issue_title, 'Test Issue');
          testId = res.body._id; // Store for later use
          done();
        });
    });

    test('Create an issue with only required fields', function (done) {
      chai
        .request(server)
        .post(`/api/issues/${project}`)
        .send({
          issue_title: 'Minimal Issue',
          issue_text: 'This issue has only required fields.',
          created_by: 'Tester',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, '_id');
          assert.equal(res.body.issue_title, 'Minimal Issue');
          assert.equal(res.body.created_by, 'Tester');
          done();
        });
    });

    test('Create an issue with missing required fields', function (done) {
      chai
        .request(server)
        .post(`/api/issues/${project}`)
        .send({
          issue_title: 'Incomplete Issue',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });
  });

  suite('GET /api/issues/:project', function () {
    test('View issues on a project', function (done) {
      chai
        .request(server)
        .get(`/api/issues/${project}`)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    test('View issues on a project with one filter', function (done) {
      chai
        .request(server)
        .get(`/api/issues/${project}`)
        .query({ open: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          res.body.forEach((issue) => {
            assert.equal(issue.open, true);
          });
          done();
        });
    });

    test('View issues on a project with multiple filters', function (done) {
      chai
        .request(server)
        .get(`/api/issues/${project}`)
        .query({ open: true, created_by: 'Tester' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          res.body.forEach((issue) => {
            assert.equal(issue.open, true);
            assert.equal(issue.created_by, 'Tester');
          });
          done();
        });
    });
  });

  suite('PUT /api/issues/:project', function () {
    test('Update one field on an issue', function (done) {
      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send({
          _id: testId,
          issue_text: 'Updated issue text.',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'result');
          assert.equal(res.body.result, 'successfully updated');
          done();
        });
    });

    test('Update multiple fields on an issue', function (done) {
      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send({
          _id: testId,
          issue_text: 'Updated text again.',
          status_text: 'Resolved',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'result');
          assert.equal(res.body.result, 'successfully updated');
          done();
        });
    });

    test('Update an issue with missing _id', function (done) {
      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send({ issue_text: 'This will fail.' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });

    test('Update an issue with no fields to update', function (done) {
      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send({ _id: testId })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'no update field(s) sent');
          done();
        });
    });

    test('Update an issue with an invalid _id', function (done) {
      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send({ _id: 'invalidId', issue_text: 'Invalid ID test.' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'could not update');
          done();
        });
    });
  });

  suite('DELETE /api/issues/:project', function () {
    test('Delete an issue', function (done) {
      chai
        .request(server)
        .delete(`/api/issues/${project}`)
        .send({ _id: testId })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'result');
          assert.equal(res.body.result, 'successfully deleted');
          done();
        });
    });

    test('Delete an issue with missing _id', function (done) {
        chai
          .request(server)
          .delete(`/api/issues/${project}`)
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'missing _id');
            done();
          });
      });
    test('Delete an issue with missing _id', function (done) {
      chai
        .request(server)
        .delete(`/api/issues/${project}`)
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'missing _id');
          done();
        });
    });
  });
});
