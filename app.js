//jshint esversion:6
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
	res.render("home");
});


app.route("/login").get((req, res) => {
	res.render("login");
}).post((req, res)=>{
    const user = req.body.username;
    const pass = req.body.password;

    User.findOne({email: user},(err, user)=>{
        if(err){
            console.log(err);
        }else{
            if(user){
                if(user.password === pass){
                    res.render("secrets");
                }
            }
        }
    });
});

app.route("/register")
	.get((req, res) => {
		res.render("register");
	})
	.post((req, res) => {
		User.create(
			{ email: req.body.username, password: req.body.password },
			(err) => {
				if (err) {
					console.log(err);
				} else {
					res.render("secrets");
				}
			}
		);
	});

app.listen(3000, () => {
	console.log("Server listening on port 3000");
});
