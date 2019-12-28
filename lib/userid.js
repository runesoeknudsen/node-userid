// This code is PUBLIC DOMAIN, and is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.

module.exports = require("bindings")("userid.node");

// Remap some functions...

module.exports.ids = module.exports.uid;

module.exports.uid = username => module.exports.ids(username).uid;
