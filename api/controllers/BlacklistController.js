/**
 * BlacklistController
 *
 * @description :: Server-side logic for managing blacklists
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var User = require('../models/User.js');

module.exports = {
	add:function(req, res){
		var us = req.body.uids || [];
		var uids = [];
		if (! us instanceof Array) {
			uids[0]=us;
		}else {
			uids = us;
		} 
		if(!uids.length) return res.badRequest('需要用户id');
		if(uids.length >100) return res.badRequest('一次最多批量操作100条');

		async.waterfall([
			function(callback){

			User
        	.find()
        	.where('_id').in(uids)
        	.select('_id')
        	.exec(callback);
			},
			function(users,callback) {
				if(!users.length) return callback('屏蔽的用户不存在',null);
				var user = req.user;
				var blacklists=user.blacklist;
		 	 	users.forEach(function(u) {
 	 				if(blacklists.indexOf(u._id) <0)
		 				blacklists.push(u._id);
		 		});
		 		user.blacklist = blacklists;
		 		user.updatedAt = Date.now();
		 		user.save(function(err){
		 			callback(err,user);
		 		});
			}
			],
			function(err,user){
				if(err) return res.badRequest(err);
				req.user = user;
				return res.ok(user);
			});
	},
	remove:function(req, res) {
		var us = req.body.uids || [];
		var uids = [];
		if (! us instanceof Array) {
			uids[0]=us;
		}else {
			uids = us;
		} 
		if(!uids.length) return res.badRequest('需要用户id');
		if(uids.length >100) return res.badRequest('一次最多批量操作100条');

		var user = req.user;
		var blacklists=user.blacklist;
		uids.forEach(function(uid) {
			var index = blacklists.indexOf(uid);
			if(index >=0) blacklists.splice(index, 1);
		});
		user.blacklist = blacklists;
		user.save(function(err){
			if(err) return res.badRequest(err);
			req.user = user;
			return res.ok(user);
		});

	},
	blacklist:function(req, res) {

		var blacklists = req.user.blacklist;
		if (!blacklists.length) return res.ok();

		User
        .find()
        .where('_id').in(blacklists)
        .select('nickname sex')
        .exec(function(err,users) {
        	if(err) return res.badRequest(err);
        	return res.ok(users);
        })
	}
};

