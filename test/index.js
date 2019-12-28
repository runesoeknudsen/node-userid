var should = require("should");
var userid = require("../lib/userid.js");
var execSync = require("child_process").execSync;

var execToString = function(command) {
  return execSync(command)
    .toString()
    .replace("\n", "");
};

var execToVal = function(command) {
  return execSync(command) >> 0;
};

var shellUsername = execToString("id -u -n");
var shellGid = execToVal("id -g");
var shellUid = execToVal("id -u");
var shellGroupName = execToString(`getent group ${shellGid} | cut -d: -f1`);
var shellGids = execToString("id -G")
  .split(" ")
  .map(s => +s)
  .sort();

describe("userid", function() {
  describe("userid.ids", function() {
    const test = userid.ids;

    it("should load current user's uid and gid", function() {
      var libIds = test(shellUsername);

      libIds.uid.should.equal(shellUid);
      libIds.gid.should.equal(shellGid);
    });

    it("should throw with too few arguments", function() {
      (() => test()).should.throw("Wrong number of arguments");
    });

    it("should throw with the wrong type of arguments", function() {
      (() => test(0)).should.throw("Argument must be a string");
    });

    it("should throw when username can't be found", function() {
      (() => test("")).should.throw("username not found");
    });
  });

  describe("userid.uid", function() {
    const test = userid.uid;
    it("should load current user's uid", function() {
      test(shellUsername).should.equal(shellUid);
    });
  });

  describe("userid.username", function() {
    const test = userid.username;

    it("should load username of specified uid", function() {
      test(shellUid).should.equal(shellUsername);
    });

    it("should throw with too few arguments", function() {
      (() => test()).should.throw("Wrong number of arguments");
    });

    it("should throw with the wrong type of arguments", function() {
      (() => test("not a number")).should.throw("Argument must be a number");
    });

    it("should throw when uid can't be found", function() {
      (() => test(-1)).should.throw("uid not found");
    });
  });

  describe("userid.gid", function() {
    const test = userid.gid;

    it("should load a group's gid by name", function() {
      test(shellGroupName).should.equal(shellGid);
    });

    it("should throw with too few arguments", function() {
      (() => test()).should.throw("Wrong number of arguments");
    });

    it("should throw with the wrong type of arguments", function() {
      (() => test(0)).should.throw("Argument must be a string");
    });

    it("should throw when gid can't be found", function() {
      (() => test("")).should.throw("groupname not found");
    });
  });

  describe("userid.groupname", function() {
    const test = userid.groupname;

    it("should load a group's name by gid", function() {
      test(shellGid).should.equal(shellGroupName);
    });

    it("should throw with too few arguments", function() {
      (() => test()).should.throw("Wrong number of arguments");
    });

    it("should throw with the wrong type of arguments", function() {
      (() => test("not a number")).should.throw("Argument must be a number");
    });

    it("should throw when gid can't be found", function() {
      (() => test(-1)).should.throw("gid not found");
    });
  });

  describe("userid.gids", function() {
    const test = userid.gids;

    it("should work like shell command", function() {
      test(shellUsername)
        .sort()
        .should.deepEqual(shellGids);
    });

    it("should throw with too few arguments", function() {
      (() => test()).should.throw("Wrong number of arguments");
    });

    it("should throw with the wrong type of arguments", function() {
      (() => test(0)).should.throw("Argument must be a string");
    });

    it("should throw when group can't be found", function() {
      (() => test("")).should.throw("getpwnam");
    });
  });
});
