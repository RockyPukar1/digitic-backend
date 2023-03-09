const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            count: {
                type: Number
            },
            color: {
                type: String
            }
        }
    ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not processed",
        enum: ["Not Processed", "Cash on Delivery", "Processing", "Dispatched", "Cancelled", "Delivered"],
    },
    orderby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
} , {
    timeseries: true
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);