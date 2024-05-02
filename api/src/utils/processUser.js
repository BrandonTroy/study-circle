/**
 * Reformats the user object returned from the database to match the expected format
 * @param {Object} user a user object returned from the database
 * @returns a user object with the expected format
 */
function processUser(user) {
  if (!user) return {};
  user.password = undefined;
  user.salt = undefined;
  user.id = user.user_id;
  delete user.user_id;
  user.name = user.first_name + ' ' + user.last_name;
  delete user.first_name;
  delete user.last_name;
  user.avatar ??= 'DEFAULT_AVATAR_URL';
  return user;
}

module.exports = processUser;