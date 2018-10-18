// const MongoClient = require('mongodb').MongoClient;


const {MongoClient, ObjectID} = require('mongodb');

// let obj = new ObjectID();
//
// console.log(obj);



// let user = {name: 'Ian Marley', age: 48};
// let {name} = user;
//
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log('unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp')

  db.collection('Todos').insertOne({
    text: 'Something to do',
    completes: false
  }, (err, result) => {
    if (err) {
      return console.log('unable to insert todo', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });
  // Insert new doc into Users (name, age, location)

  db.collection('Users').insertOne({
    name: 'Ian Marley',
    age: 48,
    location: 'Brighton'
  }, (err, result) => {
    if (err) {
      return console.log('unable to insert user', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
    // add result.ops[0]._id.getTimestamp() for timestamp
  });

  client.close();
});
