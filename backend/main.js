var express = require("express");
var app = express();
const path = require("path");
const mongoose = require("mongoose");
const config = require("./config/database");

//init db
mongoose.connect(config.database);
let db = mongoose.connection;

//check db connection
db.once("open", function () {
	console.log("Connected to mongodb");
});

//check for db errors
db.on("error", function (err) {
	console.log(err);
});
app.set("views", path.join(__dirname, "."));
app.set("view engine", "pug");

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
	extended: true
}));

//include Session model
const Session = require("./models/session");

//load view engine
app.use(express.static(path.join(__dirname, "..")));
// app.engine('html', engines.mustache);

app.get("/", function (req, res) {
	Session.find({}, function (err, sessions) {
		if (err) {
			console.log(err);
		}
		else {
			res.header("Content-Type", "text/html");
			res.render("main", {
				sessions: sessions
			});
		}
	});
});

app.get("/jsonSessions", function (req, res) {
	res.header("Content-Type", "application/json");
	Session.find({}, function (err, sessions) {
		if (err) {
			console.log(err);
		}
		else {
			res.json(sessions);
		}
	});
});

app.get("/new", function (req, res) {
	res.header("Content-Type", "text/html");
	res.render("main", {
		newSession: true
	});
});

app.post("/new", function (req, res) {
	let session = new Session();
	session.latitude = parseFloat(req.body.latitude).toFixed(10);
	session.longitude = parseFloat(req.body.longitude).toFixed(10);
	session.date = req.body.date;
	session.objects = req.body.objects;
	session.save(function (err) {
		if (err) {
			console.log(err);
			return;
		}
		else {
			res.header("Content-Type", "text/html");
			res.redirect("/");
		}
	});
});

app.get("/sessions/:id", function (req, res) {
	Session.findById(req.params.id, function (err, session) {
		var date = new Date(session.date);
		let month = "" + (date.getMonth() + 1);
		let day = "" + date.getDate();
		let year = date.getFullYear();
		if (month.length < 2) {
			month = "0" + month;
		}
		if (day.length < 2) {
			day = "0" + day;
		}
		date = day + "." + month + "." + year;
		session.date = date;
		if (err) {
			console.log(err);
		}
		else {
			res.header("Content-Type", "text/html");
			res.render("main", {
				viewSession: true,
				session: session,
				date: date
			});
		}
	});
});

app.get("/edit/:id", function (req, res) {
	Session.findById(req.params.id, function (err, session) {
		var date = new Date(session.date);
		let month = "" + (date.getMonth() + 1);
		let day = "" + date.getDate();
		let year = date.getFullYear();
		if (month.length < 2) {
			month = "0" + month;
		}
		if (day.length < 2) {
			day = "0" + day;
		}
		date = year + "-" + month + "-" + day;
		res.render("main", {
			editSession: true,
			session: session,
			date: date,
		});
	});
});

app.post("/edit/:id", function (req, res) {
	Session.findById(req.params.id, function (err, session) {
		console.log(session);
		session.latitude = parseFloat(req.body.latitude).toFixed(10);
		session.longitude = parseFloat(req.body.longitude).toFixed(10);
		session.date = req.body.date;
		session.objects = req.body.objects;
		session.save(function (err) {
			if (err) {
				console.log(err);
				return;
			}
			else {
				res.header("Content-Type", "text/html");
				res.redirect("/");
			}
		});
	});
});

app.delete("/sessions/:id", function (req, res) {
	let query = { _id: req.params.id };

	Session.findById(req.params._id, function () {
		Session.remove(query, function (err) {
			if (err) {
				console.log(err);
			}
			else {
				res.header("Content-Type", "text/html");
				res.redirect("/");
			}
		});
	});
});

const port = process.argv[2];

//start server
app.listen(port, function () {
	console.log("Server started on port " + port);
});
//bowserify TODO
// module.exports =

