/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Activity = require('../models/Activity.js');
var Comment = require('../models/Comment.js');
var User = require('../models/User.js');
var Join = require('../models/Join.js');
module.exports = {
	


  /**
   * `ActivityController.publish()`
   */
  publish: function (req, res) {
    var params = req.body;
    var user = req.user;
    params.author = user._id;

    async.waterfall([
      function (callback) {
        Activity.create(params,callback);
      },
      function (activity,callback) {
        user.activities.push(activity._id);
        user.updatedAt = Date.now();
        user.save(function(err) {
          if (err) return callback(err,null);
          callback(null,activity);
        });
      }
      ],
      function (err,result) {
        if (err) return res.badRequest(err);
        return res.ok(result.pretty(user));
      });

  },

  delActivity: function(req, res) {
    var aid = req.body.aid || '';
    if (!aid) return res.badRequest('需要活动id');

    async.waterfall([
      function(callback) {
        Activity
        .findOne({_id:aid,deleted:false})
        .exec(callback);
      },
      function(activity,callback) {

        if(!activity) return res.badRequest('对应活动不存在'); 
        activity.deleted = true;
        activity.updatedAt = Date.now();
        activity.save(function(err) {
          if(err) return callback(err,null);
          return callback(null,activity);
        });
      }
      ],function(err,result) {
        if(err) return res.badRequest(err);
        return res.ok('删除成功');
    });
  },

  like:function(req,res) {
    var aid = req.body.aid || '';

    if (!aid) return res.badRequest('需要输入活动的id');

    async.waterfall([
      function(callback){
        Activity.findById(aid).where({'deleted':false})
        .exec(callback);
      },
      function(activity,callback) {
        if (!activity) return callback('找不到对应活动',null);
        sails.log(activity);
        likers = activity.likers;
        like = false;
        var index = likers.indexOf(req.user._id);
        if(index >=0 ){
          likers.splice(index, 1);
        }else {
          likers.push(req.user._id);
          like = true;
        }

        activity.updatedAt = Date.now();
        //req.user.updatedAt = Date.now();

        activity.save(function(err) {
          if (err) {
            callback(err,null);
          }else {
            callback(null,{'liked':like,'count':activity.likerCount})
          }
        });
      }
      ],
      function(err,result) {
        if(err) return res.badRequest(err);
        return res.ok(result);
    });
  },

  collect: function(req, res) {
    var aid = req.body.aid || '';
    var user = req.user;

    if (!aid) return res.badRequest('需要输入活动的id');

    async.waterfall([
      function(callback){
        Activity.findById(aid).where({'deleted':false})
        .exec(callback);
      },
      function(activity,callback) {
        if (!activity) return callback('找不到对应活动',null);
        collectors = activity.collectors;
        like = false;
        var index = collectors.indexOf(user._id);
        var collections = user.collections;
        if(index >=0 ){
          collectors.splice(index, 1);
          collections.splice(collections.indexOf(activity._id));
        }else {
          collectors.push(user._id);
          like = true;
          collections.push(activity._id);
        }

        activity.collectors = collectors;

        activity.updatedAt = Date.now();

        user.collections = collections;
        user.updatedAt = Date.now();



        async.parallel([
          function(cb) {
            activity.save(cb);
          },
          function(cb) {

            sails.log('user collections:'+user.collections);
            user.save(cb);
          }
          ],
          function(err,results) {
            if(err) return callback(err,null);
            req.user = user;
            callback(null,activity);
          }); 
      }
      ],
      function(err,result) {
        if(err) return res.badRequest(err);
        
        sails.log('fskjflskj'+result);
        return res.ok({'collected':like,'count':result.collectorCount});
    });
  },

  attend: function(req, res) {
    var aid = req.body.aid || '';
    var text = req.body.text || '';
    var image = req.body.image;
    var user = req.user;

    if (!aid) return res.badRequest('需要输入活动的id');

    async.waterfall([
      function(callback){
        Activity.findById(aid).where({'deleted':false})
        .exec(callback);
      },
      function(activity,callback) {
        if (!activity) return callback('找不到对应活动',null);
        wanters = activity.wanters;
        var index = wanters.indexOf(user._id);
        var attends = user.attends;
        if(index >=0 ){
          return callback('已经参加报名',null);
        }
        wanters.push(user._id);
        wanted = true;
        activity.wanters = wanters;

        Join
        .create({
          'from':user._id,
          'activity':activity._id,
          'text':text,
          'image':image
        },function(err,join){
          if(err) return callback(err,null);
          user.attends.push(join._id);

          user.updatedAt = Date.now();
          activity.updatedAt = Date.now();
          activity.joins.push(join._id);
          callback(null,activity,user);

        });
      },function(activity,user,callback){
        async.parallel([
          function(cb) {
            activity.save(cb);
          },
          function(cb) {

            sails.log('user attends:'+user.attends);
            user.save(cb);
          }
          ],
          function(err,results) {
            if(err) return callback(err,null);
            req.user = user;
            callback(null,activity);
          }); 
      }
      ],
      function(err,result) {
        if(err) return res.badRequest(err);
        
        sails.log('fskjflskj'+result);
        return res.ok({'count':result.wanterCount});
    });
  },

  quit:function(req, res) {

    var aid = req.body.aid||'';
    if (!aid) return res.badRequest('需要输入活动的id');
    var user = req.user;
    if (!user.attends.length) return res.badRequest('您并没有参与任何报名');

    async.waterfall([
      function(callback) {

        Join
        .findOne()
        .where('_id').in(user.attends)
        .where({'activity':aid,'deleted':false})
        .exec(callback);
      },
      function(join,callback){
        if(!join) return callback('您并没有参与该活动的报名',null);
        Activity
        .findById(aid)
        .select('wanters joins')
        .exec(function(err,activity) {
          if(err) return callback(err,null);
          if(!activity) return callback('对应活动不存在',null);
          return callback(null,join,activity);
        });
      },function(join,activity,callback){
        async.parallel([
            function(cb){

              sails.log('join:::::'+activity +'\n');
              activity.joins.splice(activity.joins.indexOf(join._id));
              activity.wanters.splice(activity.wanters.indexOf(user._id));
              activity.updatedAt = Date.now();

              sails.log('after join:::::'+activity +'\n');
              activity.save(cb);
            },
            function(cb){

              user.attends.splice(user.attends.indexOf(join._id));
              user.updatedAt = Date.now();
              user.save(cb);
            },
            function(cb){

              Join
              .findByIdAndUpdate(join._id,
                { $set: { deleted:true,updatedAt:Date.now()}}
                ,null,cb);
            }
          ],
          function(err,results) {
            if(err) return callback(err,null);
            req.user = user;
            callback(null,activity);
          })
      }
      ],
      function(err,result){
        if(err) return res.badRequest(err);
        return res.ok({'count':result.wanterCount});
    });
  },

  detail: function (req, res) {
    
    var aid = req.params.aid || '';
    sails.log(aid);
    async.waterfall([
      function(callback) {
        Activity
        .findById(aid)
        .where({'deleted':false})
        .populate('author','nickname phone sex')
        .populate({
          path: 'comments',
          select: 'text from to updatedAt',
          options: { limit: 10 ,sort:'-updatedAt'}
        })
        .exec(callback);
      },
      function(activity,callback) {
        if (!activity) return callback('找不到对应活动',null);
        var uids = [];
        activity.comments.forEach(function(comment) {
          var from = comment.from;
          var to = comment.to;
          if (uids.indexOf(from) <0) {
            uids.push(from);
          }
          if (to && uids.indexOf(to) <0) {
            uids.push(to);
          }
        });

        sails.log(uids);

        User
        .find()
        .where('_id').in(uids)
        .select('nickname sex')
        .exec(function(err,users) {
          if(err) {
            callback(err,null);
          }else {
            data = {'activity':activity.pretty(req.user),'users':users};
            callback(null,data);
          }
        });

      }
      ],function(err,result) {
        if(err) return res.badRequest(err);
        res.ok(result);
    });
  },

  
};

