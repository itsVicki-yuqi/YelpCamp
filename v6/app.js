var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//passport configuration
app.use(require("express-session")({
	secret: "Once again",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser;
	next();
})

// Campground.create({
// 	name: "Salmon Creek",
// 	image: "https://www.photosforclass.com/download/px_2422265",
// 	description: "This is blablalalallalalalalla"
// }, function(err, campground){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			console.log("Create a new campground");
// 			console.log(campground);
// 		}
// });

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
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
	res.render("campgrounds/new");
});
app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampgound){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show", {campground: foundCampgound});
		}
	});
	//res.send("this is show page");
	//res.render("show");
});


// COMMENTS ROUTES
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
	//lookup campground using id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}else{
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

//==================================
//AUTHO ROUTES
//==================================
app.get("/register", function(req, res){
	res.render("register");
});

app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});
//LOGIN
app.get("/login", function(req, res){
	res.render("login");
});
app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
	
});
//LOGOUT
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});

function isLoggedIn(){
	if(req.isAuthenticate()){
		return next();
	}else{
		res.redirect("/login");
	}
}

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The YelpCamp server has started!");
});