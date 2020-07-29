var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//schema setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

Campground.create({
	name: "Salmon Creek",
	image: "https://www.photosforclass.com/download/px_2422265",
	description: "This is blablalalallalalalalla"
}, function(err, campground){
		if(err){
			console.log(err);
		}else{
			console.log("Create a new campground");
			console.log(campground);
		}
});

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("index", {campgrounds:allCampgrounds});
		}
	});
});

app.post("/campgrounds", function(req, res){
	//get data from form and add to campgrounds array
	//redirect back to campgrounds
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampgrounds = {name: name, image: image, description: desc};
	//create new campground and save to DB
	Campground.create(newCampgrounds, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
});

app.get("/campgrounds/new", function(req, res){
	res.render("new");
});
app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id, function(err, foundCampgound){
		if(err){
			console.log(err);
		}else{
			res.render("show", {campground: foundCampgound});
		}
	});
	//res.send("this is show page");
	//res.render("show");
});


app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The YelpCamp server has started!");
});