const {ObjectID}  = require('mongodb');  // load in ObjectID from mongo native driver for util methods .isValid?

const {mongoose}  = require('./../server/db/mongoose');
const {Todo}      = require('./../server/models/todo');
const {User}      = require('./../server/models/user');


// delete multiple records
//
// Todo.deleteMany({}).then((result) => {
//   console.log(result);
// });

// Todo.findOne
// Todo.findById return document


//
// Todo.findByIdAndDelete('5bf6b68fdd4d90496c979cc0').then((doc)=>{
//   console.log(JSON.stringify(doc, undefined, 2));
// });

// Todo.findOneAndDelete('5bf6b681dd4d90496c979ca8').then((doc)=>{
//   console.log(JSON.stringify(doc, undefined, 2));
// });

// Todo.findOneAndDelete({ text: 'say bye bye'}).then((doc)=>{
//   console.log(JSON.stringify(doc, undefined, 2));
// });
Todo.findOneAndRemove('5bf6b68add4d90496c979cb2').then((doc)=>{
  console.log(JSON.stringify(doc, undefined, 2));
});
