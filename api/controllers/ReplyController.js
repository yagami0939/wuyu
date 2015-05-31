/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Activity = require('../models/Activity.js');
var Comment = require('../models/Comment.js');
var User = require('../models/User.js');
module.exports = {
  reply: function (req, res) {
    var params = req.body;
    var aid = params.aid || '';
    var to = params.to || '';
    if (!aid) return res.badRequest();

    var text = params.text || '';
    if (!text.length) return res.badRequest();

    async.waterfall([
      function (callback) {
        Activity.findById(aid).where({deleted:false}).exec(callback);
      },
      function (activity,callback) {
        if (!activity) return callback('没找到对应活动，或者已经删除',null);
        sails.log(activity);
        if (to.length > 0) {
          User.findById(to,function (err,to) {
            if (err) {
              callback(err,null);
            }else {
              callback(err,activity,to);
            }
          })
        }else {
          callback(null,activity);
        }
      },
      function (activity,to,callback) {
        var cc = {'activity':activity._id,'text':text,'from':req.user._id};
        if (typeof(to) === 'function') {
          callback = to;
        }else {
          cc.to = to._id;
        }

        Comment.create(cc,function(err,comment) {
          if(err) {
            callback(err,null);
          }else {
            callback (null,comment,activity);
          }
        });
      },
      function (comment,activity,callback) {
        comments = activity.comments;
        
        comments.push(comment._id);
        activity.comments = comments;
        activity.updatedAt = Date.now();
        activity.save(function(err) {
          if(err) {
            callback(err,null);
          }else {
            callback(null,comment);
          }
        });

        sails.log(activity);
      }
      ],
      function(err,result) {
        if(err) {
          return res.badRequest(err);
        }
        return res.ok(result.pretty());
      });

  },

  delComment:function(req, res) {
    var aid = req.body.aid || '';
    var cid = req.body.cid || '';
    if (!aid) return res.badRequest('需要输入活动的id');
    async.waterfall([
      function(callback) {
        Comment
        .findById(cid)
        .where({'deleted':false,'from':req.user._id,'activity':aid})
        .populate({
          path:'activity',
          select:'comments'
        })
        .exec(callback);
      },
      function(comment,callback) {
        if(!comment) return res.badRequest('活动属性与评论不服，或者没有权限删除');
        comment.deleted = true;
        var activity = comment.activity;
        sails.log(comment);
        var index = activity.comments.indexOf(comment._id);
        if(index >=0 ){
          activity.comments.splice(index, 1);
        }

        async
        .parallel([
          function(cb) {
            comment.updatedAt = Date.now();
            comment.save(cb);
          },
          function(cb) {
            activity.updatedAt = Date.now();
            activity.save(cb);
          }
          ],function(err,results){
            callback(err,null);
        });
      }],
      function(err,result){
        if(err) return res.badRequest(err);
        return res.ok('删除成功');
      });
  },
};