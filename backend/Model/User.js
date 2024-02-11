const { Schema, default: mongoose } = require("mongoose");
const Label = require("./Labels");

const UserSchema = new Schema({
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