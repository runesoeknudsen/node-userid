#include "userid.hh"

#if defined(__unix__) || (defined(__APPLE__) && defined(__MACH__))
#include <pwd.h>
#else
// Mocks for Windows

typedef uint32_t uid_t;
typedef uint32_t gid_t;
struct passwd
{
  char *pw_name;   /* username */
  char *pw_passwd; /* user password */
  uid_t pw_uid;    /* user ID */
  gid_t pw_gid;    /* group ID */
  char *pw_gecos;  /* user information */
  char *pw_dir;    /* home directory */
  char *pw_shell;  /* shell program */
};

/**
 * The getpwnam() function returns a pointer to a structure containing
 * the broken-out fields of the record in the password database (e.g.,
 * the local password file /etc/passwd, NIS, and LDAP) that matches the
 * username name.
 */
struct passwd *getpwnam(const char *name);
#endif

using namespace Napi;
using namespace userid;

Object Uid(const CallbackInfo &info)
{
  auto env = info.Env();

  if (info.Length() < 1)
  {
    TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return Object::New(env);
  }

  if (!info[0].IsString())
  {
    TypeError::New(env, "Argument must be a string").ThrowAsJavaScriptException();
    return Object::New(env);
  }

  auto utfname = std::string(info[0].As<String>()).c_str();
  auto user = getpwnam(utfname);

  if (!user)
  {
    Error::New(env, "username not found").ThrowAsJavaScriptException();
    return Object::New(env);
  }

  auto ret = Object::New(env);

  ret["uid"] = Number::New(env, user->pw_uid);
  ret["gid"] = Number::New(env, user->pw_gid);

  return ret;
}
