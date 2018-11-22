const mongoose  = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp',  { useNewUrlParser: true }); // use heroku mlab addon || localhost db

module.exports = {mongoose};
