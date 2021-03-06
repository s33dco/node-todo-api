const {ObjectID}= require('mongodb');   // so object id can be set for seed todos
const {Todo}    = require('./../../models/todo');
const {User}    = require('./../../models/user');
const jwt       = require('jsonwebtoken');


// user seed data
const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users   = [
  {
    _id: userOneId,
    email: 'withtoken@example.com',
    password: 'user1Password',
    tokens: [{
      access: 'auth',
      token : jwt.sign({_id : userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id: userTwoId,
    email: 'notokens@example.com',
    password: 'user2Password',
    tokens: [{
      access: 'auth',
      token : jwt.sign({_id : userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
  }
];


// todo seed data
const todos   = [
  {
    _id: new ObjectID(),
  text : 'First thing todo',
  _creator: userOneId
  },{
    _id: new ObjectID(),
  text : 'Second thing todo',
  completed: true,
  completedAt : 333,
  _creator: userTwoId
}
];

// functions to delete and repopulate collections

const populateTodos = (done) => {
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.deleteMany({}).then(() => {
    // need to run middleware to generate auth so can't just insert many
    let userOne = new User(users[0]).save(); // returns promise (save will run middleware)
    let userTwo = new User(users[1]).save(); // returns promise

    // Promise.all waits for each of promises in array to resolve..
    return Promise.all([userOne, userTwo])
  }).then(() => done()); // fulfills promise so .save() for each
}

module.exports = { todos, populateTodos, users, populateUsers};
