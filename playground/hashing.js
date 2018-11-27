const {SHA256} = require('crypto-js');

const jwt = require('jsonwebtoken');

let data = {
  id: 10
}

// check jwt.io
// jwt creates tokem with following output
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTU0MzMxMzE2MX0.X98hjPGDJdn3hKTBoCdKTtok6QyFBeuXje1D39LzCUA
// header includes encoding and type (before first dot)
// payload includes data and iat (issued at timestamp) (between 2nd and 3rd)
// verification (after 2nd . ) (either vliad or invalid)

let token = jwt.sign(data, '123abc');

console.log('token string:', token);

let decoded = jwt.verify(token, '123abc');
console.log ('decoded :', decoded);




// //
// // let message = "I am the one and only";
// // let hash = SHA256(message).toString();
// //
// //
// // let messages = ['the one and only', 'they think it is all over', 'reasons to be cheerfull part 3',
// //                 'bye bye mr american pie, took my chevvy to the levvy but the levy was dry',
// //                 'first i was afraid i was petrified.....', 'first i was afraid i was petrified.....',
// //                 'what you hear is not a test im rapping to the beat']
// //
// // messages.forEach((message) => {
// //   let emails = ['ian@s33d.co', 'code@s33d.co', 'jillyflowerbag@yahoo.co.uk', 'alfred@example.com'];
// //   emails.forEach((email) => {
// //     console.log(`Email: ${email}`);
// //     console.log(`Message: ${message}`);
// //     console.log(`Hashed value: ${SHA256(message + email)}`);
// //   })
// // });
//
// let data = {
//   id: 4
// };
//
// let token = {
//   data,
//   hash : SHA256(JSON.stringify(data) + 'somesecretsalt').toString() // token is the data plus hash of data.
// }
//
//
// // to try to tamper...
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data) + 'guessing the SALT').toString();
//
// // to validate...
//
// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecretsalt').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('do not trust');
// };
