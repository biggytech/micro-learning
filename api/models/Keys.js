const mongoose = require("mongoose");

const keySchema = new mongoose.Schema({
  _id: Number,
  publicKey: String,
  privateKey: String,
});

const Keys = mongoose.model("keys", keySchema);

module.exports = Keys;
