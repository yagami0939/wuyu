module.exports = function authFailed(data, options) {

  var res = this.res;

  if (this.req.wantsJSON) {
    return res.jsonx({'code':88,'message':data});
  }
}