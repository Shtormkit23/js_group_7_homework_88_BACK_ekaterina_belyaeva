const express = require("express");
const config = require("./config");
const posts = require("./app/posts");
const users = require("./app/users");
const comments = require("./app/comments");


const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 8001;


app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const run = async () => {
    await mongoose.connect(config.db.url + "/" + config.db.name, {useNewUrlParser: true, autoIndex: true});

    app.use("/posts", posts);
    app.use("/users", users);
    app.use("/comments", comments);


    console.log("Connected to mongoDB");

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });
};

run().catch(console.log);