const mongoose = require('mongoose');

const NameData = mongoose.Schema({
  UserID: String,
  LastName: String
})

module.exports = mongoose.model("NameData", NameData)