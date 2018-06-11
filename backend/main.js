var express = require("express");
var app = express();
const path = require("path");
const Session = require(path.join(__dirname, "models/Session"));

const dbClient = require("mongodb").MongoClient;
dbClient.connect("mongodb://localhost:27017/webDev", (error, db) => {
	if (error) {
		console.error(error);
		process.exit(-1);
	}
	console.log("Connected to MongoDB.");
	try {
		console.log("do smh..");
	}
	finally {
		db.close();
	}
});

//load view engine
app.use(express.static(path.join(__dirname, "..")));
// app.engine('html', engines.mustache);

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "../main.html"));
	let ses1 = new Session(120, 101, new Date(), ["1", "23"]);
});
const port = process.argv[2];

//start server
app.listen(port, function () {
	console.log("Server started on port " + port);
});
//bowserify TODO
// module.exports =

