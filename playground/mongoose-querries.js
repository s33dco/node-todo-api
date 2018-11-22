const {ObjectID}  = require('mongodb');  // load in ObjectID from mongo native driver for util methods .isValid?

const {mongoose}  = require('./../server/db/mongoose');
const {Todo}      = require('./../server/models/todo');
const {User}      = require('./../server/models/user');

// let id = '5bc9aa13d508f905e1a567eb11';
//
// if (!ObjectID.isValid(id)) {
//   console.log(`${id} is not a valid id.`)
// }


//
// Todo.find({
//   _id: id
// }).then((todos) => {
//   if (todos.length === 0) {
//     return console.log(`No todos found`);
//   }
//   console.log("\n.find\n");
//   console.log('Todos', todos)
// });
//
//
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   if (!todo) {
//     return console.log(`Id ${id} not found`);
//   }
//   console.log("\n.findOne\n");
//   console.log('Todo', todo)
// });



// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log(`Id ${id} not found`);
//   }
//   console.log("\n.findById\n");
//   console.log('Todo', todo)
// }).catch((e) => console.log(e.message));

//  User.findById

let uid = '5bc870d9a405f0065e034f56';

// User.findById('5bc870d9a405f0065e034f56').then .....

User.findById(uid).then((user) => {
  if (!user) {
    return console.log(`User with id ${uid} not found`);
  }
  console.log(`User with id ${uid} found, email ${user.email}`);
  console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e.message));
