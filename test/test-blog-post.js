const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// this lets us use *should* style syntax in our tests
// so we can do things like `(1 + 1).should.equal(2);`
// http://chaijs.com/api/bdd/
const should = chai.should();

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Blog Posts', function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('Should list blog posts on GET', function() {
    return chai.request(app)
    .get('/blog-post')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.an('object');
      res.body.should.be.an('array');
      const expectedKeys = ['title', 'content', 'author'];
      res.body.forEach(function(item) {
        item.should.include.keys(expectedKeys);
      })
    });
  });

  it('Should create a new blog post on POST', function() {
    const newBlog = {
      'title': 'Biography',
      'content': 'First page',
      'author': 'You'
    };
    return chai.request(app)
    .post('/blog-post')
    .send(newBlog)
    .then(function(res) {
      res.should.have.status(201);
      res.body.id.should.not.be.null;
      res.body.should.include.keys('title', 'content', 'author');
    });
  });

  it('Should update an existing blog post on PUT', function() {
    const updatedBlog = {
      'title': 'Updated Blog',
      'content': 'This is my updated blog',
      'author': 'Someone Else'
    }
    return chai.request(app)
    .get('/blog-post')
    .then(function(res) {
      updatedBlog.id = res.body[0].id
    });
    return chai.request(app)
    .put(`/blog-post/${updatedBlog.id}`)
    .send(updatedBlog)
    .then(function(res) {
      res.should.have.status(204);
    });
  });

  it('Should delete an existing blog post on DELETE', function() {
    return chai.request(app)
    .get('/blog-post')
    .then(function(res) {
      const deleteID = res.body[0].id;
    });
    return chai.request(app)
    .delete(`/blog-post/${deleteID}`)
    .then(function(res) {
      res.should.have.status(204);
    });
  });

});
