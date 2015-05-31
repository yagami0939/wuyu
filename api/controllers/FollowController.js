/**
 * FollowController
 *
 * @description :: Server-side logic for managing follows
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var User = require('../models/User.js');

module.exports = {
	


  /**
   * `FollowController.add()`
   * A 关注 B
   * A 的 followees 中添加 B
   * B 的 followers 中添加 A
   * 
   */
  add: function (req, res) {
    var uid = req.body.uid||'';
    if(!uid) return res.badRequest('需要关注人的id');
    if(uid == req.user._id) return res.badRequest('自己不可以关注自己');
    async.waterfall([
      function(callback) {
        User.findById(uid,callback);
      },
      function(u,callback) {
        if(!u) return('对方用户不存在',null);
        var user = req.user;
        var followees = user.followees;
        sails.log('my followees:'+followees);
        if(followees.indexOf(u._id)>=0) {
          return callback(null,'已经关注过了');
        }
        followees.push(u._id);
        user.followees = followees;
        user.updatedAt = Date.now();

        u.followers.push(user._id);

        async.parallel([
          function(cb){
            user.save(cb);
          },
          function(cb){
            u.save(cb)
          }
          ],
          function(err,results){
            callback(err,user);
        });
      }
      ],
      function(err,result){
        if(err) return res.badRequest(err);
        return res.ok(result);
      });
  },


  /**
   * `FollowController.remove()`
   * 
   * A 取消关注 B
   * A 的 followees 中删除 B
   * B 的 followers 中删除 A
   */
  remove: function (req, res) {
     var uid = req.body.uid||'';
    if(!uid) return res.badRequest('需要关注人的id');


    var user = req.user;
    var followees = user.followees;
    if(followees.indexOf(uid)<0) {
      return res.badRequest('并没有关注对方',null);
    }
    async.waterfall([
      function(callback) {
        User
        .findById(uid)
        .select('followers')
        .exec(callback);
      },
      function(u,callback) {
        sails.log('user:'+u);
        if(!u) return('对方用户不存在',null);
        followees.pull(u._id);
        user.followees = followees;
        user.updatedAt = Date.now();

        u.followers.pull(user._id);

        async.parallel([
          function(cb){
            user.save(cb);
          },
          function(cb){
            u.save(cb)
          }
          ],
          function(err,results){
            callback(err,user);
        });
      }
      ],
      function(err,result){
        if(err) return res.badRequest(err);
        return res.ok(result);
      });
  },


  /**
   * `FollowController.followers()`
   */
  followers: function (req, res) {
    return res.json({
      todo: 'followers() is not implemented yet!'
    });
  },


  /**
   * `FollowController.followees()`
   */
  followees: function (req, res) {
    return res.json({
      todo: 'followees() is not implemented yet!'
    });
  }
};

