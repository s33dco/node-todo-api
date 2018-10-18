const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log('unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp')

  //  deleteMany

  // db.collection('Todos').deleteMany({text: 'Eat Lunch'}).then( (result) => {
  //   console.log(result);
  // });


  // deleteOne

  // db.collection('Todos').deleteOne({text: 'Walk the dog'}).then( (result) => {
  //   console.log(result);
  // });

  // findOneAndDelete
  db.collection('Todos').findOneAndDelete({text: 'Walk the dog'}).then( (result) => {
    console.log(result);
  });

  // db.collection('Users').deleteMany({name: 'Ian Marley'}).then( (result) => {
  //   console.log(result);
  // });

  // findOneAndDelete
  db.collection('Users').findOneAndDelete({_id: new ObjectID('5bc71ff2daa4f90339ca9dc7')}).then((result) => {
    console.log(JSON.stringify(result, undefined, 2));
  });



  // client.close();
});
