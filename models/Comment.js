const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    datetime: {
        type: String,
        required: true
    },
    post: {
        type: Schema.Types.ObjectID,
        ref: "Post",
        required: true
    },
    user: {
        type: Schema.Types.ObjectID,
        ref: "User",
        required: true
    }
});

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;