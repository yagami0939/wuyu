
var Activity = require('../models/Activity.js');

module.exports = {
	initData:function(req, res) {
		sails.log('start');
		times = [];
		for(var i=0;i < 100000; i++) {
			times.push(i);
		}
		var params={};
		var user = req.user;
    	params.author = user._id;
    	

    params.description="今天是个好日子";
    params.exchange="我需要你的阳光";// 要交换的内容
    params.tags=["你好","我好"];  //活动的标签
    params.images=["www.baodu.com","renren.com"]; //活动图片的地址
  	params.loc={"city":"北京","province":"北京","district":"怀柔"}; //活动的区域

	async.eachLimit(times,10,function(i,callback){

		var latitude = Math.random()*180-90;
		var longitude = Math.random()*360-180;
		params.geo={'latitude':latitude,'longitude':longitude};
		Activity.create(params,function(err,activity) {
			 callback(err);
		});

		},function(err) {
			if(err) return res.badRequest(err);
			return res.ok("nice");
		});

	}
};