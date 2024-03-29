const Expenses = require("./Expenses");

const { default: mongoose, Schema } = require("mongoose");

const Label = new Schema({
  name: {
    type: String,
    required: true,
  },
  budget: {
    type: String,
    required: true,
  },
  totalExpense: {
    type: Number,
    default: 0,
  },
  expenses: [{ type: Schema.ObjectId, ref: Expenses }],
});

module.exports = mongoose.model("Label", Label);
