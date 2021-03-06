const expect      = require('expect');
const request     = require('supertest');
const {ObjectID}  = require('mongodb');   // so object id can be set for seed todos

const {app}       = require('./../server');
const {Todo}      = require('./../models/todo');
const {User}      = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


// set database before each test is run
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    let text = 'Eat some lunch';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      }).end(done);
  });
});

describe('GET/todos/:id', () => {
  it('should return a todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`) // template string grabbing object id of 1st in todos array seed data
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      }).end(done);
  });

  it('should return not a todo doc created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`) // template string grabbing object id of 1st in todos array seed data
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return a 404 if todo not found', (done) => {
    hexId = new ObjectID();    // make a valid ObjectID not in db
    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return a 404 for non ObjectIds', (done) => {
    request(app)
      .get('/todos/notanid') // notanid invalid ObjectID
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE/todos/:id', () => {
  it('should remove todo', (done) => {
    let hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`) // template string grabbing object id of 1st in todos array seed data
      .set('x-auth', users[1].tokens[0].token)
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
    });
  });

  it('should not remove other users todos', (done) => {
    let hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`) // template string grabbing object id of 1st in todos array seed data
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res ) => {     // custom function
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeTruthy();
          done();
        })
    });
  });

  it('should return a 404 if todo not found', (done) => {
    hexId = new ObjectID();    // make a valid ObjectID not in db
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return a 404 for non ObjectIds', (done) => {
    request(app)
      .delete('/todos/notanid') // notanid invalid ObjectID
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH/todos/:id', () => {
  it('should update the todo', (done) => {
    let hexId = todos[0]._id.toHexString();
    let text = 'new text';
    let now = new Date().getTime();
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeGreaterThanOrEqual(now);
        // expect(typeof res.body.todo.completedAt).toBe('number')
      })
      .end(done);
  });

  it('should not update the other users todo', (done) => {
    let hexId = todos[0]._id.toHexString();
    let text = 'new text';
    let now = new Date().getTime();
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    let hexId = todos[1]._id.toHexString();
    let text = 'newest text';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: false,
        text
      })
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeNull();
      })
      .end(done);
  });

});

describe('GET/users/me', () => {
  it('should return a user if authenticated', (done) => {

    // use users[0] to generate x-auth token
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      }).end(done);
  });

  it('should return a 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      }).end(done);
  });

});

describe('POST/users', () => {
  it('should create a user', (done) => {
    let email = 'newperson@example.com';
    let password = '123456abc';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect( (res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {       // take it a little further
        if (err) {
          return done(err); // if error break out on done with error
        }
        User.findOne({email}).then((user) => {      // query db to inspect user
          expect(user).toBeTruthy();                   // expect to find user
          expect(user.password).not.toBe(password);  // expect password has been hashed
          done();
      }).catch((e) => done(e));
    });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'frank',
        password: '1'})
      .expect(400)
      .expect( (res) => {
        expect(res.body._message).toEqual("User validation failed")
      }).end(done);
  });

  it('should not create a user if email in use', (done) => {
    let email = users[0].email;
    let password = '4brandn3wPa55word';

    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: '4brandn3wPa55word'})
      .expect(400)
      .end(done);
  });

});

describe('POST/users/login', () => {
  it('should login in user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect( (res) => {
        expect(res.headers['x-auth']).toBeTruthy();  //use bracket notation as hyphen in x-auth
      })
      .end((err, res) => {                         // call end then custom function to query db
        if (err) {                                   // if error return done(err) so gets printed to screen
          return done(err);
        }

        User.findById(users[1]._id).then((user) =>{ // else find user by id then expect
          expect(user.tokens[1]).toMatchObject({          // in tokens array for user on db
            access: 'auth',
            token : res.headers['x-auth']             // same token in db as in header
          });
          done();
        }).catch((e) => done(e));                     // catch call for errors
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: 'incorrectPassword'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();  //use bracket notation as hyphen in x-auth
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => { // else find user by id then expect
          expect(user.tokens.length).toBe(1);        // no tokens on db
          done();
        }).catch((e) => done(e));                  // catch call for errors
      });
  });

});

describe('DELETE/users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {      // custom callback to end
        if (err) {
          return done(err);     // handle error - pass to done function
        }
        User.findById(users[0]._id).then((user) => { // else find user by id then expect
          expect(user.tokens.length).toBe(0);        // no tokens on db
          done();
        }).catch((e) => done(e));                    // catch call for errors
    });
  });

});
