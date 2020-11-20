const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: function() {
            return !this.image;
        }
    },
    image: {
        type: String,
        required: function() {
            return !this.description;
        }
    },
    user: {
        type: Schema.Types.ObjectID,
        ref: "User",
        required: true
    },
    datetime: {
        type: String,
        required: true
    }
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;