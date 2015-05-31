/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

mongoose = require('mongoose');
var Schema = mongoose.Schema;  
var ObjectId = Schema.ObjectId;

var User = new Schema({  

    phone:{type:String , required:true, unique:true}, 
    password:{
      type:String,
      required:true
    },
    nickname: { type: String, required: true },

    avatar:{type:String},
    bg: { type: String},
    location:{
        province:String,
        city:String,
        district:String
    },
    birthday:{
        year:Number,
        month:Number,
        day:Number
    },

    description: { type: String},
    sex:{
      type: Number,
      enum:[0,1],
      required:true,
      default:0
    }, 
    credit: { type: Number,default:0},  
    gallery:[String],
    activities:[{type:ObjectId,ref:'Activity'}], //我发布的
    collections:[{type:ObjectId,ref:'Activity'}], //我的收藏
    attends:[{type:ObjectId,ref:'Join'}], //我参与的


    followers:[{type:ObjectId,ref:'User'}], //我的关注的人
    followees:[{type:ObjectId,ref:'User'}], //我的粉丝
    blacklist:[{type:ObjectId,ref:'User'}], //我的黑名单
    addresses:[ObjectId],
    updatedAt:{type:Date, default: Date.now},
    createdAt: { type: Date, default: Date.now }
});



User.path('nickname').validate(function (v) {
  return v.length > 1 && v.length < 10 ;
});


User.path('password').validate(function (v) {
  return v.length > 6 && v.length < 16 ;
});

User.virtual('collectCount').get(function() {
  return this.collections.length;
});

User.virtual('publishCount').get(function() {
  return this.activities.length;
});

User.virtual('attendCount').get(function() {
  return this.attends.length;
});

User.virtual('followeeCount').get(function() {
  return this.followees.length;
});

User.virtual('followerCount').get(function() {
  return this.followers.length;
});

User.virtual('addressCount').get(function () {
  return this.addresses.length;
});

User.pre('save', function (next) {
  // do stuff
  sails.log("fsdfs\n"+this);
  next();
});

User.index({'nickname':1,'phone':1});

User.methods.virtify = function(p) {
  return this.password === p;
}

User.methods.pretty = function() {
  var user = this.toJSON();
  delete user.password;
  delete user.activities;
  delete user.collections;
  delete user.addresses;
  delete user.followers;
  delete user.followees;
  delete user.attends;
  delete user.__v;
  user.publishCount = this.publishCount;
  user.collectCount = this.collectCount;
  user.followeeCount = this.followeeCount;
  user.followerCount = this.followerCount;


  return user;
}


module.exports = mongoose.model('User',User);
  // beforeCreate:function(user,cb) {
  // 	sails.log('beforeCreate');
  // 	bcrypt.genSalt(10, function(err, salt) {
  //     if (err) return cb(err);
  //     bcrypt.hash(user.password, salt, function(err, hash) {
  //       if (err) {
  //         console.log(err);
  //         cb(err);
  //       }else{
  //         user.password = hash;
  //         cb(null, user);
  //       }
  //     });
  //   });
  // },

