var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/at_app");

var tSchema = new mongoose.Schema({
	name: String,
	age: Number,
	temperament: String
});

var at = mongoose.model("Cat", tSchema);

// var george = new Cat({
// 	name: "George",
// 	age: 11,
// 	temperament: "Grouchy"
// });

// george.save(function(err, cat){
// 	if(err){
// 		console.log("SOMETHING WENT WRONG");
// 	}else{
// 		console.log(cat);
// 	}
// });

at.create({
	name: "Snow White",
	age: 15,
	temperament: "bland"
}, function(err, jat){
	if(err){
		console.log(err);
	}else{
		console.log(jat);
	}
});

// Cat.find({}, function(err, cats){
// 	if(err){
// 		console.log("ERROR");
// 		console.log(err);
// 	}else{
// 		console.log(cats);
// 	}
// });

