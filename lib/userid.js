var _userid = require("bindings")("userid.node");

/**
 * Get uid and gid for user.
 *
 * @param {String} username - username
 *
 * @return {Object} object with uid and gid, e.g. { uid: 1, gid: 2 }
 *
 */
exports.ids = _userid.uid;

/**
 * Get uid for user.
 *
 * @param {String} username - username in /etc/passwd
 *
 * @return {Integer} uid
 *
 */
exports.uid = function(username) {
  var user = _userid.uid(username);
  return user.uid;
};

/**
 * Get gid for groupname
 *
 * @param {String} groupname - name of group in /etc/group
 *
 * @return {Integer} gid
 *
 */
exports.gid = _userid.gid;

/**
 * Get group name for gid
 *
 * @param {Integer} gid - group id
 *
 * @return {String} groupname - name of group in /etc/group
 */
exports.groupname = _userid.groupname;

/**
 * Get user name for uid
 *
 * @param {Integer} uid - user id
 *
 * @return {String} username - name of user in /etc/passwd
 */
exports.username = _userid.username;

/**
 * Get array of gids of user's groups
 *
 * @param {String} username - name of user in /etc/passwd
 *
 * @return {Array} gid
 *
 */
exports.gids = _userid.gids(username);
