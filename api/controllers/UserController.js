/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var User = require('../models/User.js');
module.exports = {
	
  //获取用户资料
  profile:function(req, res) {
    var uid = req.params.uid || '';
    if(!uid) return res.badRequest('需要用户的id');
    User.findById(uid).exec(function(err,user) {
      if (err) return res.badRequest(err);
      if (!user) return res.badRequest('未找到对应用户');
      return res.ok(user.pretty());
    });
  },

  //更新用户资料
  updateProfile:function(req, res) {
    var params = req.body;
    var user = req.user;
    if (params.phone) return res.badRequest('手机号码不可以修改');
    if (params.password) return res.badRequest('密码不可以修改');
    //user.nickname = "fsfsfsdfsd";
    user.set(params);
    user.save(function(err) {
      if (err) return res.badRequest(err);
    });
    req.user = user;
    return res.ok(user);
  },
  me:function(req, res) {
    return res.ok(req.user);
  },
  lists:function(req,res) {
    User
    .find()
    .select('loc.city')
    .exec(function(err,users){
      if(err) return res.badRequest(err);
      return res.ok(users);
    });
  },
};

