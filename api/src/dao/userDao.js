
const db = require('./DBConnection');
const crypto = require('crypto');
const processUser = require('../utils/processUser');


function validatePassword(password, salt, hash) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) {
        reject("Error: " + err);
      }
      const digest = derivedKey.toString('hex');
      if (digest === hash) {
        resolve(true);
      } else {
        reject("Invalid username or password")
      }
    });
  });
}

// Endpoint to get an authenticated user by username or email
function getUserByCredentials(login, password) {
  const query = `
    SELECT * FROM user WHERE username = ? OR email = ?
  `;
  return db.query(query, [login, login]).then(result => {
    const user = result.results[0];
    if (!user) {
      return null;
    }
    return validatePassword(password, user.salt, user.password).then(valid => {
      if (valid) {
        return processUser(user);
      } else {
        throw "Invalid username or password";
      }
    });
  });
}

// Create a new user with a salt and hashed password, and return the sanitized user object
function createAuthenticatedUser(first_name, last_name, username, email, password) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, salt) => {
      if (err) {
        reject("Error: " + err);
      }
      crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) {
          reject("Error: " + err);
        }
        const digest = derivedKey.toString('hex');
        const query = `
          INSERT INTO user (first_name, last_name, email, username, password, salt) VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [first_name, last_name, email, username, digest, salt.toString('hex')]).then(result => {
          console.log("Result of insert query: ", result);
          const query = `
            SELECT * FROM user WHERE user_id = ?
          `;
          db.query(query, [result.results.insertId]).then(result => {
            const user = result.results[0];
            resolve(processUser(user));
          }).catch(err => {
            reject(err);
          });
        }).catch(err => {
          reject(err);
        });
      });
    });
  });
}

// Endpoint to get a user by username
async function getUserByUsername(username) {
  const query = `
    SELECT * FROM user WHERE username = ?
  `;
  const result = await db.query(query, [username]);
  const user = result.results[0];
  return processUser(user);
}

// Endpoint to get a user by user id
async function getUserByUserId(userId) {
  const query = `
    SELECT * FROM user WHERE user_id = ?
  `;
  const result = await db.query(query, [userId]);
  const user = result.results[0];
  return processUser(user);
}

module.exports = {
  getUserByCredentials: getUserByCredentials,
  createAuthenticatedUser: createAuthenticatedUser,
  getUserByUsername: getUserByUsername,
  getUserByUserId: getUserByUserId
};
