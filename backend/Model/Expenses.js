const {default: mongoose, Schema} = require("mongoose");

const expenseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
    },
    createdAt: {
        type: String,
        default: new Date().toISOString(),
    }
},)

module.exports = mongoose.model("Expenses", expenseSchema)