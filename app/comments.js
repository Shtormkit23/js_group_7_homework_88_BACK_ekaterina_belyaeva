const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");

router.get('/', async (req, res) => {
    let query;
    if (req.query.post) {
        query = {post: req.query.post};
    }
    try {
        const comments = await Comment.find(query).populate("user");
        res.send(comments)
    } catch {
        res.sendStatus(500);
    }
});


router.post("/", auth ,async (req, res) => {
    const token = req.get('Authorization');
    const userToken = await User.findOne({token});

    const commentData = req.body;
    commentData.datetime = new Date();
    commentData.user = userToken._id;

    const post = await Post.findById(req.body.post);

    if (!post) return res.status(400).send("Post does not exists");
    const comment = new Comment(commentData);

    try {
        await comment.save();
        res.send(comment);
    } catch (e) {
        res.status(400).send(e);
    }
});


module.exports = router;