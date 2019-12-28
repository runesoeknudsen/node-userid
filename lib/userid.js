module.exports = require("bindings")("userid.node");

module.exports.uid = username => _userid.uid(username).uid;