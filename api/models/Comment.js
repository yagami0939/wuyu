var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Comment = new Schema({
  text: { type: String },
  activity: { 
    type: ObjectId,
    required:true,
    ref:'Activity'
  },
  from: { 
    type: ObjectId,
    required:true,
    ref:'User' 
  },
  to: { type: ObjectId },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deleted: {type: Boolean, default: false},
});

Comment.index({aid: 1});
Comment.index({from: 1, createdAt: -1});

Comment.methods.pretty = function() {
  var comment = this.toJSON();
  delete comment.__v;
  delete comment.deleted;
  return comment;
}

module.exports = mongoose.model('Comment', Comment);
