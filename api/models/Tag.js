var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Tag = new Schema({  

    text: { type: String, required:true},
    category:{type:Number, default:0},
    count:{type:Number, default:1},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deleted:{type:Boolean,default:false}
});


module.exports = mongoose.model('Tag',Tag);