const mongoose = require('mongoose');
const moment = require('moment');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp',  { useNewUrlParser: true });

module.exports = {mongoose};
