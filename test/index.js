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

describe("userid", function() {
  describe("userid.ids", function() {
    it("should work like shell command", function() {
      var username = execToString("id -u -n");

      var shellUid = execToVal("id -u");
      var shellGid = execToVal("id -g");

      var libIds = userid.ids(username);

      libIds.uid.should.equal(shellUid);
      libIds.gid.should.equal(shellGid);
    });
  });

  describe("userid.uid", function() {
    it("should work like shell command", function() {
      var username = execToString("id -u -n");

      var shellUid = execToVal("id -u");
      var libUid = userid.uid(username);

      libUid.should.equal(shellUid);
    });
  });

  describe("userid.username", function() {
    it("should work like shell command", function() {
      var username = execToString("id -u -n");

      var shellUid = execToVal("id -u");
      var libUsername = userid.username(shellUid);

      libUsername.should.equal(username);
    });
  });

  describe("userid.gid", function() {
    it("should work like shell command", function() {
      var shellGid = execToVal("id -g");

      var groupName = execToString(
        "getent group " + shellGid + " | cut -d: -f1"
      );
      var libGid = userid.gid(groupName);

      libGid.should.equal(shellGid);
    });
  });

  describe("userid.groupname", function() {
    it("should work like shell command", function() {
      var shellGid = execToVal("id -g");

      var groupName = execToString(
        "getent group " + shellGid + " | cut -d: -f1"
      );
      var libGroupName = userid.groupname(shellGid);

      libGroupName.should.equal(groupName);
    });

    it("should throw with the wrong of arguments", function() {
      (() => userid.groupname()).should.throw("Wrong number of arguments")
    });
  });

  describe("userid.gids", function() {
    it("should work like shell command", function() {
      var username = execToString("id -u -n");

      var shellGids = execToString("id -G").split(" "); //array of strings
      var libGids = userid.gids(username);

      libGids.length.should.equal(shellGids.length);

      for (var x in shellGids)
        (~libGids.indexOf(shellGids[x] >> 0)).should.not.equal(0); //~-1 = 0
    });
  });
});
