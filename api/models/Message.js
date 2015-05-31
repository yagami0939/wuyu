var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Message = new Schema({  

    from:{type: ObjectId,required:true,ref:'User'},
    to:{type: ObjectId,required:true,ref:'User'},
    type:{type:Number,default:0},
    data:{},
    createdAt: { type: Date, default: Date.now },
    unread:{type:Boolean,default:true}
});


module.exports = mongoose.model('Message',Message);