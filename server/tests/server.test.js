const expect    = require('expect');
const request   = require('supertest');
const {ObjectID}= require('mongodb');   // so object id can be set for seed todos

const {app}     = require('./../server');
const {Todo}    = require('./../models/todo');
  
// seed data for tests
const todos   = [
  {
    _id: new ObjectID(),
  text : 'First thing todo'
  },{
    _id: new ObjectID(),
  text : 'Second thing todo'
}
];

// set database before each test is run
beforeEach((done) => {
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Eat some lunch';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));

    });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET/todos', () => {
  it('should retrive all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      }).end(done);
  });
});

describe('GET/todos/:id', () => {
  it('should remove a todo', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`) // template string grabbing object id of 1st in todos array seed data
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      }).end(done);
  });

  it('should return a 404 if todo not found', (done) => {
    hexId = new ObjectID();    // make a valid ObjectID not in db
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return a 404 for non ObjectIds', (done) => {
    request(app)
      .get('/todos/notanid') // notanid invalid ObjectID
      .expect(404)
      .end(done);
  });
});

describe('DELETE/todos/:id', () => {
  it('should remove todo', (done) => {
    let hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`) // template string grabbing object id of 1st in todos array seed data
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res ) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        })
        .catch((e) => done(e));
      });
  });

  it('should return a 404 if todo not found', (done) => {
    hexId = new ObjectID();    // make a valid ObjectID not in db
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return a 404 for non ObjectIds', (done) => {
    request(app)
      .delete('/todos/notanid') // notanid invalid ObjectID
      .expect(404)
      .end(done);
  });
});
