const router = require('express').Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('My Blog', 'Today, I had a good day.', 'Steven');
BlogPosts.create('DT', "God is good", 'John');

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) {
    if (!(requiredFields[i] in req.body)) {
      const message = `Sorry, missing ${requiredFields[i]}`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);
});

router.get('/', (req, res) =>{
  res.json(BlogPosts.get());
})

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) {
    if (!(requiredFields[i] in req.body)) {
      const message = `Sorry, missing ${requiredFields[i]}`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.body.id !== req.params.id) {
    const message = `Requested path does not match`
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post item ${req.params.id}`);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate || Date.now()
  });
  res.status(204).end();
});

router.delete('/:id', (req, res) => {
  console.log(`Deleted blog post ${req.params.id}`)
  BlogPosts.delete(req.params.id);
  res.status(204).end();
});


module.exports = router;
