const {nanoid} = require("nanoid");
const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const auth = require("../middleware/auth");
const multer = require("multer");
const config = require("../config");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().sort({datetime: -1}).populate("user");
        res.send(posts)
    } catch (e) {
        res.status(422).send(e);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const result = await Post.findById(req.params.id).populate("user");
        if (result) {
            res.send(result);
        } else {
            res.sendStatus(404);
        }
    } catch {
        res.sendStatus(500);
    }
});


router.post("/", upload.single("image"), auth,async (req, res) => {
    const token = req.get('Authorization');
    const userToken = await User.findOne({token});

    const postData = req.body;
    postData.datetime = new Date();
    postData.user = userToken._id;

    if (req.file) {
        postData.image = req.file.filename;
    }
    const user = await User.findById(req.body.user);

    if (!user) return res.status(400).send("User does not exists");
    const post = new Post(postData);

    try {
        await post.save();
        res.send(post);
    } catch (e) {
        res.status(400).send(e);
    }
});



module.exports = router;

