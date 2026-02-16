const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  shippingAddress1: {
    type: String,
    default: "",
  },
  shippingAddress2: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

// this method for underscore object id (_id) remove and use without underscore id like this (id)
// orderSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });

// orderSchema.set("toJSON", {
//   virtuals: true,
// });

exports.Order = mongoose.model("Order", orderSchema);
