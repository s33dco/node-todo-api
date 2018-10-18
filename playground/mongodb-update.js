const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log('unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp')

// db.collection('Todos').findOneAndUpdate({
//   _id: new ObjectID('5bc85420e5603a33c87587a1')
//   }, {
//     $set: {
//       completed: true
//     }
//   }, {
//     returnOriginal: false
//   }).then((result) => {
//     console.log(result);
// });


db.collection('Users').findOneAndUpdate({
  _id: new ObjectID('5bc720e879b842033f829ad0')
  }, {
    $set: {
      name: 'Ian Marley'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
});


  // client.close();
});
