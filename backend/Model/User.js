const { Schema, default: mongoose } = require("mongoose");
const Label = require("./Labels");

const UserSchema = new Schema({
  username: {
    type: String,
    default: `${new Date().getTime()}${Math.floor(Math.random() * 10 ** 10)}`,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  labels: [{ type: Schema.ObjectId, ref: Label }],
});

module.exports = mongoose.model("User", UserSchema);
