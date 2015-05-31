/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var User = require('../models/User.js');

module.exports = {


  checkPhone:function(req, res, next) {
    var phone = req.params.phone || '';
    if (!phone || !util.checkPhone(phone)) return res.badRequest('不是合法的手机号码');
    User.findOne().where({'phone':phone}).exec(function(err,user) {
      if(err) return res.badRequest(err);
      if(user) return res.ok({'result':1,'message':'手机号码已被注册'});
      return res.ok({'result':0,'message':'手机号码未被注册'});
    });
  },
	
  /**
   * `AuthController.login()`
   */
  login: function (req, res,next) {

    req.logout();
    sails.log(req.body);

    require('passport').authenticate('local', function(err, user, info){
      if (err) {
        return res.authFailed(err);
      }
      if (!user) {
        return res.authFailed(info);
      }
      req.logIn(user, function(err){
        if (err) return res.authFailed(err);
        // Redirect to the user page.
        return res.ok(user.pretty());
      });
    })(req, res,next);
  },


  /**
   * `AuthController.logout()`
   */
  logout: function (req,res){
    req.logout();
    res.ok('logout successful');
  },

  signin: function (req, res) {
    console.log(req.body);

    var phone = req.body.phone;
    if (!phone) return res.wrongFormat('需要手机号码');

    var password = req.body.password;

    var confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) return res.wrongFormat('两次密码不相同');

    var nickname = req.body.nickname || '';
    var location = req.body.location || '';
    var sex = req.body.sex || 0;
    var avatar = req.body.avatar || '';
    var opts = {};
    opts.phone = phone;
    opts.password = password;
    opts.nickname = nickname;
    opts.location = location;
    opts.sex = sex;
    opts.avatar = avatar;

    User.create(opts,function(err,user){
      if(err) {
        return res.badRequest(err);
      }
      req.login(user, function(err){
        if (err) return res.badRequest(err);
        // Redirect to the user page.
        return res.ok(user.pretty());
      });
    });
  }
};

