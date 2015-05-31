var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Best = new Schema({  

    description: { type: String},
    users:[{type:ObjectId,ref:'User'}],
    otitle:{type:String}, // out title
    odesc:{type:String}, // out describe
    obgurl:{type:String}, // out background url
    ititle:{type:String}, // in title
    idesc:{type:String}, // in describe
    ibgurl:{type:String}, // in background url
    likers:[ObjectId], //赞人
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deleted:{type:Boolean,default:false}
});

module.exports = mongoose.model('Best',Best);