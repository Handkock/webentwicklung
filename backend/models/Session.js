const path = require("path");
var fs = require("fs");
var list = [];

class Session {
	constructor(logtitude, latitude, date, objects) {
		this.latitude = latitude;
		this.logtitude = logtitude;
		this.date = date;
		this.object = objects;
		fs.readFile(path.join(__dirname, "../data.json"), "utf8", function read(err, data) {
			if (err) {
				throw err;
			}
			// console.log(data);
			if (Array.isArray(data)) {
				list = JSON.parse(data);
				console.log("isArray");
			}
			else {
				list.push(data);
			}
		});
		console.log(list)
		list.push(this);
		console.log(JSON.stringify(list));
		// let json = JSON.stringify(this);
		console.log(list);
		fs.writeFile(path.join(__dirname, "../data.json"), JSON.stringify(list));
		// fs.appendFile(path.join(__dirname, "../data.json"), json);
	}
}


let mongoose = require('mongoose');

// Article Schema
let articleSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  }
});

let Article = module.exports = mongoose.model('Article', articleSchema);




module.exports = Session;
