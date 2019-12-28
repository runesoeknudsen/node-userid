module.exports = require("bindings")("userid.node");

// Remap some functions...

module.exports.ids = module.exports.uid;

module.exports.uid = username => module.exports.ids(username).uid;
