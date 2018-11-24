require('./config/config');

const _           = require('lodash');
const express     = require('express');
const bodyParser  = require('body-parser');
const {ObjectID}  = require('mongodb');

const {mongoose}  = require('./db/mongoose');
const {Todo}      = require("./models/todo");
const {User}      = require("./models/user");

let app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc) =>{
    res.send(doc);
  }, (e) => {
    res.status(400).send(e.message);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e.message);
  });
});

app.get('/todos/:id', (req, res) => {  // :id sets up parameter on req object
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();  // as ever return prevents function execution
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', (req, res) => {  // :id sets up parameter on req object
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();  // as ever return prevents function execution
  }

  Todo.findByIdAndDelete(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']); // only these attributes accepted via lodash

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
