require("should");

const { execSync } = require("child_process");

const userid = require(process.env.MOCHA_IMPORT_OVERRIDE || "../lib/userid.js");

// Utility functions

const execToString = command =>
  execSync(command)
    .toString()
    .replace("\n", "");

// Simply test against current user's info

const shellUsername = execToString("id -un");
const shellGroupName = execToString("id -gn");

const shellUid = Number(execToString("id -u"));
const shellGid = Number(execToString("id -g"));

// Get a nice list
const shellGids = execToString("id -G")
  .split(" ")
  .map(s => Number(s))
  .sort();

// TODO: programmatically find these values. But this seems to work fine.
const nonExistentUidGid = -42;
const nonExistentUserGroup = "";

/**
 * Helper function to exercise Error condition coverage tests.
 * Since all the functions error in pretty much the same way, we can take advantage of this.
 *
 * @param {Function} test to run
 * @param {"string" | "number"} type expected as argument
 * @param {String} missing name of argument
 * @param {String} error string when not found
 * @param {Object} options Extra options
 */
function testErrors(test, type, missing, error, options = {}) {
  if (options.badValue === undefined)
    options.badValue = type == "string" ? 0 : "not a number";

  if (options.missingValue === undefined)
    options.missingValue =
      type == "string" ? nonExistentUserGroup : nonExistentUidGid;

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

const testIds = test => () => {
  it(`should load a user's uid [${shellUid}] and gid [${shellGid}] by username [${shellUsername}]`, () => {
    const libIds = userid.ids(shellUsername);

    libIds.uid.should.equal(shellUid);
    libIds.gid.should.equal(shellGid);
  });

  testErrors(userid.ids, "string", "username", "username not found");
};

describe("userid", () => {
  describe("userid.ids", testIds(userid.ids));

  if (process.env.MOCHA_NATIVE_API_TEST) {
    describe("userid.uid", testIds(userid.uid));
  } else {
    describe("userid.uid", () => {
      it(`should load user's uid [${shellUid}] by username [${shellUsername}]`, () => {
        userid.uid(shellUsername).should.equal(shellUid);
      });
    });
  }

  describe("userid.username", () => {
    it(`should load a username [${shellUsername}] by uid [${shellUid}]`, () => {
      userid.username(shellUid).should.equal(shellUsername);
    });

    testErrors(userid.username, "number", "uid", "uid not found");
  });

  describe("userid.gid", () => {
    it(`should load a group's gid [${shellGid}] by name [${shellGroupName}]`, () => {
      userid.gid(shellGroupName).should.equal(shellGid);
    });

    testErrors(userid.gid, "string", "groupname", "groupname not found");
  });

  describe("userid.groupname", () => {
    it(`should load a group's name [${shellGroupName}] by gid [${shellGid}]`, () => {
      userid.groupname(shellGid).should.equal(shellGroupName);
    });

    testErrors(userid.groupname, "number", "gid", "gid not found");
  });

  describe("userid.gids", () => {
    it(`should load a list of gids [${shellGids}] by username [${shellUsername}]`, () => {
      userid
        .gids(shellUsername)
        .sort()
        .should.deepEqual(shellGids);
    });

    testErrors(userid.gids, "string", "user", "getpwnam");
  });
});
