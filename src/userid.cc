/* This code is PUBLIC DOMAIN, and is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND. See the accompanying
 * LICENSE file.
 */

#include <sys/types.h>
#include <grp.h>
#include <pwd.h>
#include <napi.h>

#if defined(__unix__) || (defined(__APPLE__) && defined(__MACH__))
#include <sys/param.h>

// BSD needs unistd.h for getgrouplist function
#if defined(BSD)
#include <unistd.h>
#endif

#endif

using namespace Napi;

String GroupName(const CallbackInfo &info)
{
  auto env = info.Env();

  if (info.Length() < 1)
  {
    TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return String::New(env, "");
  }

  if (!info[0].IsNumber())
  {
    TypeError::New(env, "Only number argument is supported for this function").ThrowAsJavaScriptException();
    return String::New(env, "");
  }

  int gid = info[0].As<Number>().Int32Value();

  auto group = getgrgid(gid);

  if (!group)
  {
    Error::New(env, "gid not found").ThrowAsJavaScriptException();
    return String::New(env, "");
  }

  return String::New(env, group->gr_name);
}

Array Gids(const CallbackInfo &info)
{
  auto env = info.Env();

  if (info.Length() < 1)
  {
    TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return Array::New(env, 0);
  }

  if (!info[0].IsString())
  {
    TypeError::New(env, "Only string argument is supported for this function").ThrowAsJavaScriptException();
    return Array::New(env, 0);
  }

  auto username = std::string(info[0].As<String>()).c_str();

  errno = 0;
  struct passwd *pw = getpwnam(username);

  if (pw == NULL)
  {
    // TODO: More verbose error message that includes errno
    Error::New(env, "getpwnam").ThrowAsJavaScriptException();
    return Array::New(env, 0);
  }

#ifdef __APPLE__
  typedef int gidType;
#else  // ifdef __APPLE__
  typedef gid_t gidType;
#endif // ifdef __APPLE__

  gidType *groups = NULL;

  int foundGroups;
  int ngroups = 4;

  do
  {
    // It is safe to delete NULL on first run
    delete[] groups;

    // Make our list of groups bigger by 4 at a time
    ngroups *= 2;

    groups = new gidType[ngroups];

    if (groups == NULL)
    {
      Error::New(env, "Malloc error generating list of groups").ThrowAsJavaScriptException();
      return Array::New(env, 0);
    }

    foundGroups = getgrouplist(username, pw->pw_gid, groups, &ngroups);

    // getgrouplist forces us to guess how many groups the user might be in
    // returns `-1` if we guessed too low
  } while (foundGroups == -1);

  auto ret = Array::New(env, foundGroups);

  for (int i = 0; i < ngroups; i++)
  {
    // TODO: What happens when `napi_value`s are assigned to an array? Do their allocations need to stay around?
    ret[uint32_t(i)] = Number::New(env, groups[i]);
  }

  delete[] groups;

  return ret;
}

Number Gid(const CallbackInfo &info)
{
  auto env = info.Env();

  struct group *group = NULL;

  if ((info.Length() > 0) && info[0].IsString())
  {
    auto utfname = std::string(info[0].As<String>()).c_str();

    group = getgrnam(utfname);
  }
  else
  {
    Error::New(env, "you must supply the groupname").ThrowAsJavaScriptException();
    return Number::New(env, 0);
  }

  if (group)
  {
    return Number::New(env, group->gr_gid);
  }
  else
  {
    Error::New(env, "groupname not found").ThrowAsJavaScriptException();
    return Number::New(env, 0);
  }
}

String UserName(const CallbackInfo &info)
{
  auto env = info.Env();

  struct passwd *user = NULL;

  if ((info.Length() > 0) && info[0].IsNumber())
  {
    user = getpwuid(info[0].As<Number>().Int32Value());
  }
  else
  {
    Error::New(env, "you must supply the uid").ThrowAsJavaScriptException();
    return String::New(env, "");
  }

  if (user)
  {
    return String::New(env, user->pw_name);
  }
  else
  {
    Error::New(env, "uid not found").ThrowAsJavaScriptException();
    return String::New(env, "");
  }
}

Object Uid(const CallbackInfo &info)
{
  auto env = info.Env();

  struct passwd *user = NULL;

  if ((info.Length() > 0) && info[0].IsString())
  {
    auto utfname = std::string(info[0].As<String>()).c_str();
    user = getpwnam(utfname);
  }
  else
  {
    Error::New(env, "you must supply the username").ThrowAsJavaScriptException();
    return Object::New(env);
  }

  if (user)
  {
    auto ret = Object::New(env);

    ret["uid"] = Number::New(env, user->pw_uid);
    ret["gid"] = Number::New(env, user->pw_gid);

    return ret;
  }
  else
  {
    Error::New(env, "username not found").ThrowAsJavaScriptException();
    return Object::New(env);
  }
}

Object Init(Env env, Object exports)
{
  exports["uid"] = Function::New(env, &Uid);
  exports["username"] = Function::New(env, &UserName);
  exports["gid"] = Function::New(env, &Gid);
  exports["gids"] = Function::New(env, &Gids);
  exports["groupname"] = Function::New(env, &GroupName);

  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);