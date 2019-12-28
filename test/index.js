const should = require("should");
const userid = require("../lib/userid.js");
const execSync = require("child_process").execSync;

const execToString = command =>
  execSync(command)
    .toString()
    .replace("\n", "");

const execToVal = command => +execSync(command);

const shellUsername = execToString("id -un");
const shellGroupName = execToString("id -gn");
const shellUid = execToVal("id -u");
const shellGid = execToVal("id -g");
const shellGids = execToString("id -G")
  .split(" ")
  .map(s => +s)
  .sort();

function testErrors(test, type, missing, error, options = {}) {
  if (options.badValue === undefined)
    options.badValue = type == "string" ? 0 : "not a number";

  if (options.missingValue === undefined)
    options.missingValue = type == "string" ? "" : -1;

  it("should throw with too few arguments", () => {
    (() => test()).should.throw("Wrong number of arguments");
  });

  it(`should throw with the wrong type of argument. Expects ${type}, giving [${options.badValue}].`, () => {
    (() => test(options.badValue)).should.throw(`Argument must be a ${type}`);
  });

  it(`should throw when ${missing} [${options.missingValue}] can't be found`, () => {
    (() => test(options.missingValue)).should.throw(error);
  });
}

describe("userid", () => {
  describe("userid.ids", () => {
    const test = userid.ids;

    it(`should load a user's uid [${shellUid}] and gid [${shellGid}] by username [${shellUsername}]`, () => {
      const libIds = test(shellUsername);

      libIds.uid.should.equal(shellUid);
      libIds.gid.should.equal(shellGid);
    });

    testErrors(test, "string", "username", "username not found");
  });

  describe("userid.uid", () => {
    const test = userid.uid;

    it(`should load user's uid [${shellUid}] by username [${shellUsername}]`, () => {
      test(shellUsername).should.equal(shellUid);
    });
  });

  describe("userid.username", () => {
    const test = userid.username;

    it(`should load a username [${shellUsername}] by uid [${shellUid}]`, () => {
      test(shellUid).should.equal(shellUsername);
    });

    testErrors(test, "number", "uid", "uid not found");
  });

  describe("userid.gid", () => {
    const test = userid.gid;

    it(`should load a group's gid [${shellGid}] by name [${shellGroupName}]`, () => {
      test(shellGroupName).should.equal(shellGid);
    });

    testErrors(test, "string", "groupname", "groupname not found");
  });

  describe("userid.groupname", () => {
    const test = userid.groupname;

    it(`should load a group's name [${shellGroupName}] by gid [${shellGid}]`, () => {
      test(shellGid).should.equal(shellGroupName);
    });

    testErrors(test, "number", "gid", "gid not found");
  });

  describe("userid.gids", () => {
    const test = userid.gids;

    it(`should load a list of gids [${shellGids}] by username [${shellUsername}]`, () => {
      test(shellUsername)
        .sort()
        .should.deepEqual(shellGids);
    });

    testErrors(test, "string", "user", "getpwnam");
  });
});
