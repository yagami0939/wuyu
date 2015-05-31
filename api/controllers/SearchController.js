var User = require('../models/User.js');
module.exports = {
	
	// 通过 手机号码或者昵称来搜索用户
	userinfo:function(req, res) {
		var kw = req.query.kw || '';
		if(!kw) return req.badRequest('需要关键字');
		User
		.find()
		.or([{phone:{ $regex: kw, $options: 'i' }},
			{nickname:{ $regex: kw, $options: 'i' }}])
		.exec(function(err,users) {
			if(err) return res.badRequest(err);
			return res.ok(users);
		});
	},

	// 通过 活动标签来搜索
	
};