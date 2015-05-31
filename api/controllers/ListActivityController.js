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

  latest:function(req, res) {
    sails.log(req.query);
    var page = parseInt(req.query.page) || 1;
    var size = parseInt(req.query.size) || 20;
    async.waterfall([
      function(callback) {
        Activity
        .find({deleted:false})
        .skip((page-1)*size)
        .limit(size)
        .populate('author','nickname sex')
        .sort('-updatedAt')
        .exec(callback);
      }
      ],
      function(err,result) {
        if (err) return res.badRequest();
        var data=[];
        result.forEach(function(activity) {
          data.push(activity.listPretty(req.user));
        });
        res.ok(data);
      })
  },

  nearest:function (req, res) {
    sails.log(req.query);
    var page = parseInt(req.query.page) || 1;
    var size = parseInt(req.query.size) || 20;
    var lat = parseFloat(req.query.lat);
    var lon = parseFloat(req.query.lon);

    async.waterfall([
      function(callback) {
        Activity.find({geo:{$near:[lat,lon],$distanceField:'distance'}})
        .where({'deleted':false})
        .limit(size)
        .populate('author','nickname sex')
        .exec(callback);
      }
      ],
      function(err,result) {
        if (err) return res.badRequest(err);
        var data=[];
        result.forEach(function(activity) {
          var act = activity.listPretty(req.user);

          data.push(act);
        });
        res.ok(data);
      })
  },
};

