#include <napi.h>

namespace userid
{
using namespace Napi;

String GroupName(const CallbackInfo &info);
Array Gids(const CallbackInfo &info);
Number Gid(const CallbackInfo &info);
String UserName(const CallbackInfo &info);
Object Uid(const CallbackInfo &info);
} // namespace userid
