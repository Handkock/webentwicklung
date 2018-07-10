const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

// Article Schema
let sessionSchema = new mongoose.Schema({
	latitude: {
		type: Number,
		required: true
	},
	longitude: {
		type: Number,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	objects: {
		type: String,
		required: true
	}
});
sessionSchema.plugin(mongoosePaginate);
let Session = module.exports = mongoose.model("Session", sessionSchema);
