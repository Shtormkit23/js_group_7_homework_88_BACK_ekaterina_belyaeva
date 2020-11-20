const router = require("express").Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch(e) {
        res.sendStatus(500);
    }
});
router.post("/", async (req, res) => {
    try {
        const user = new User(req.body);
        user.generateToken();
        await user.save();
        res.send(user);
    } catch(e) {
        return res.status(400).send(e);
    }
});
router.post("/sessions", async (req, res) => {

    const checkEmail = /^[\w-.]+@(\b[a-z-]+\b)[^-].[a-z]{2,10}$/g;

    let queryKey = "username";

    if (checkEmail.test(req.body.username)) {
        queryKey = "email";
    }

    const user = await User.findOne({[queryKey]: req.body.username});
    if (!user) {
        return res.status(400).send({error: "Username not found"});
    }
    const isMatch = await user.checkPassword(req.body.password);
    if (!isMatch) {
        return res.status(400).send({error: "Password is wrong"});
    }

    user.generateToken();
    await user.save({validateBeforeSave: false});

    res.send(user);
});

router.delete("/sessions", async (req, res) => {
    const token = req.get("Authorization");
    const success = {message: "Success"};

    if (!token) return res.send(success);
    const user = await User.findOne({token});

    if(!user) return res.send(success);

    user.generateToken();
    user.save({validateBeforeSave: false});

    return res.send(success);
});


module.exports = router;