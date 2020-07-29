var express = require("express");
var app = express();
var bodyParser = require("body-parser");



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");



var campgrounds = [
	{name: "Salmon Creek", image: "https://www.photosforclass.com/download/px_2422265"},
	{name: "Salmon Creek", image: "https://www.photosforclass.com/download/px_2422265"},
	{name: "Salmon Creek", image: "https://www.photosforclass.com/download/px_2422265"},
	{name: "Salmon Creek", image: "https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?auto=compress&cs=tinysrgb&h=350"},
	{name: "Salmon Creek", image: "https://pixabay.com/get/57e1d14a4e52ae14f1dc84609620367d1c3ed9e04e507440712e73d7944fc2_340.jpg"},
	{name: "Salmon Creek", image: "https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&h=350"},
	{name: "Salmon Creek", image: "https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?auto=compress&cs=tinysrgb&h=350"},
	{name: "Salmon Creek", image: "https://pixabay.com/get/57e1d14a4e52ae14f1dc84609620367d1c3ed9e04e507440712e73d7944fc2_340.jpg"},
	{name: "Salmon Creek", image: "https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&h=350"}
];

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	
	res.render("campgrounds", {campgrounds : campgrounds});
});

app.post("/campgrounds", function(req, res){
	//get data from form and add to campgrounds array
	//redirect back to campgrounds
	var name = req.body.name;
	var image = req.body.image;
	var newCampgrounds = {name: name, image: image};
	campgrounds.push(newCampgrounds);
	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
	res.render("new");
});


app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The YelpCamp server has started!");
});