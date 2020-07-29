var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/", function(req, res){
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
		}
	});
});

router.post("/", isLoggedIn, function(req, res){
	//get data from form and add to campgrounds array
	//redirect back to campgrounds
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author  = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampgrounds = {name: name, image: image, description: desc, author: author};
	//create new campground and save to DB
	Campground.create(newCampgrounds, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
});

router.get("/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampgound){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show", {campground: foundCampgound});
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else{
		res.redirect("/login");
	}
}

module.exports = router;