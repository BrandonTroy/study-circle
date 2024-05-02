/**
 * Processes the connection object returned from the database to match the expected format
 * @param {Object} connection the connection object returned from the database
 * @returns the connection object with the expected format
 */
function processConnection(connection) {
  if (!connection) return {};
  connection.id = connection.connection_id;
  connection.requestTime = connection.connection_datetime;
  delete connection.connection_id;
  connection.status = Boolean(connection.status);
  return connection;
}

module.exports = processConnection;