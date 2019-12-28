/* This code is PUBLIC DOMAIN, and is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND. See the accompanying
 * LICENSE file.
 */

#include "userid.hh"

using namespace Napi;
using namespace userid;

Object Init(Env env, Object exports)
{
  exports["uid"] = Function::New(env, &Uid);
  exports["gid"] = Function::New(env, &Gid);
  exports["gids"] = Function::New(env, &Gids);
  exports["username"] = Function::New(env, &UserName);
  exports["groupname"] = Function::New(env, &GroupName);

  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);
