var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Join = new Schema({  

    from:{type: ObjectId,required:true,ref:'User'},
    activity:{type: ObjectId,required:true,ref:'Activity'},
    text: { type: String,required:true},
    image:{type:String,required:true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deleted:{type:Boolean,default:false}
});

module.exports = mongoose.model('Join',Join);