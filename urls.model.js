var mongoose = require("mongoose");

var urlsSchema = new mongoose.Schema({
  longURL: {
    type: String,
    required: [true, "LongURL is Required"],
  },
  shortId: {
    type: String,
  },
});

var urlsModel = mongoose.model("urls", urlsSchema);

module.exports = urlsModel;
