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
var shellGids = execToString("id -G").split(" ");

describe("userid", function() {
  describe("userid.ids", function() {
    it("should load current user's uid and gid", function() {
      var libIds = userid.ids(shellUsername);

      libIds.uid.should.equal(shellUid);
      libIds.gid.should.equal(shellGid);
    });
  });

  describe("userid.uid", function() {
    it("should load current user's uid", function() {
      var libUid = userid.uid(shellUsername);

      libUid.should.equal(shellUid);
    });
  });

  describe("userid.username", function() {
    it("should load username of specified uid", function() {
      var libUsername = userid.username(shellUid);

      libUsername.should.equal(shellUsername);
    });
  });

  describe("userid.gid", function() {
    it("should load a group's gid by name", function() {
      var libGid = userid.gid(shellGroupName);

      libGid.should.equal(shellGid);
    });
  });

  describe("userid.groupname", function() {
    it("should load a group's name by gid", function() {
      var libGroupName = userid.groupname(shellGid);

      libGroupName.should.equal(shellGroupName);
    });

    it("should throw with the wrong of arguments", function() {
      (() => userid.groupname()).should.throw("Wrong number of arguments");
    });
  });

  describe("userid.gids", function() {
    it("should work like shell command", function() {
      var shellGids = execToString("id -G").split(" "); //array of strings
      var libGids = userid.gids(shellUsername);

      libGids.length.should.equal(shellGids.length);

      for (var x in shellGids)
        (~libGids.indexOf(shellGids[x] >> 0)).should.not.equal(0); //~-1 = 0
    });
  });
});
