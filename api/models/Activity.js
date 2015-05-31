var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Activity = new Schema({  

    author:{type: ObjectId,required:true,ref:'User'},
    description: { type: String},
    exchange:{type:String},
    category:{type:Number,default:0},
    tags:[String],  
    hot: { type: Number,default:0},
    loc:{
      province:String,
      city:String,
      district:String
    },
    geo:{
      longitude:{type:Number}, //经度 -180 180
      latitude:{type:Number},  //纬度 -90 90 
    },
    images:[String],
    wanters:[ObjectId],
    joins:[{type:ObjectId,ref:'Join'}], //交换
    likers:[ObjectId], //赞人
    collectors:[ObjectId], //被收藏的人
    comments:[{type:ObjectId,ref:'Comment'}], //评论
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deleted:{type:Boolean,default:false}
});


Activity.path('geo.longitude').validate(function (v) {
  return v > -180 && v < 180 ;
});

Activity.path('geo.latitude').validate(function (v) {
  return v > -90 && v < 90 ;
});

Activity.virtual('replyCount').get(function () {
  return this.comments.length;
});

Activity.virtual('likerCount').get(function () {
    return this.likers.length;
});

Activity.virtual('collectorCount').get(function() {
    return this.collectors.length;
});

Activity.virtual('wanterCount').get(function() {
  return this.wanters.length;
});

Activity.index({'geo':'2d'});
Activity.index({'updatedAt':-1});

Activity.methods.listPretty = function(user) {
  var activity = this.pretty(user);
  delete activity.comments;
  return activity;
}

Activity.methods.pretty = function(user) {
  var activity = this.toJSON();
  delete activity.wanters;
  delete activity.deleted; 
  delete activity.collectors;
  delete activity.likers;
  delete activity.__v;
  delete activity.joins;


  activity.amIliked = false;
  activity.amIwanted = false;
  if (user) {
    activity.amIliked = this.likers.indexOf(user.id) >=0;
    activity.amIwanted = this.wanters.indexOf(user.id) >=0;
  }
  activity.replyCount = this.replyCount;
  activity.wanterCount = this.wanterCount;
  activity.collectorCount = this.collectorCount;
  activity.likerCount = this.likerCount;

  //delete activity.comments;
  return activity;
};





module.exports = mongoose.model('Activity',Activity);