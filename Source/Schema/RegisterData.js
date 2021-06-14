const mongoose = require('mongoose');

const RegisterData = mongoose.Schema({
  AdminID: String,
  Man: Number,
  Woman: Number,
  Total: Number
})

module.exports = mongoose.model("RegisterData", RegisterData)