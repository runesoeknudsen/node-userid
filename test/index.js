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

var shellUsername = execToString("id -un");
var shellGroupName = execToString("id -gn");
var shellUid = execToVal("id -u");
var shellGid = execToVal("id -g");
var shellGids = execToString("id -G")
  .split(" ")
  .map(s => +s)
  .sort();

describe("userid", function() {
  describe("userid.ids", function() {
    const test = userid.ids;

    it(`should load a user's uid [${shellUid}] and gid [${shellGid}] by username [${shellUsername}]`, function() {
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
    it(`should load user's uid [${shellUid}] by username [${shellUsername}]`, function() {
      test(shellUsername).should.equal(shellUid);
    });
  });

  describe("userid.username", function() {
    const test = userid.username;

    it(`should load a username [${shellUsername}] by uid [${shellUid}]`, function() {
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

    it(`should load a group's gid [${shellGid}] by name [${shellGroupName}]`, function() {
      test(shellGroupName).should.equal(shellGid);
    });

    it("should throw with too few arguments", function() {
      (() => test()).should.throw("Wrong number of arguments");
    });

    it("should throw with the wrong type of arguments", function() {
      (() => test(0)).should.throw("Argument must be a string");
    });

    it("should throw when groupname can't be found", function() {
      (() => test("")).should.throw("groupname not found");
    });
  });

  describe("userid.groupname", function() {
    const test = userid.groupname;

    it(`should load a group's name [${shellGroupName}] by gid [${shellGid}]`, function() {
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

    it(`should load a list of gids [${shellGids}] by username [${shellUsername}]`, function() {
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
