const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema({
  workerNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
});

const User = model("User", userSchema);

module.exports = User;
