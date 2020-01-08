const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const CartItemSchema = new mongoose.Schema(
  {
    // product: { type: ObjectId, ref: "Product" },
    name: String,
    price: Number,
    count: Number,
    link: String,
    image1: String,
    source:String,
    image:Array,
    description: String,
    image2: String,
    image3: String,
    image4: String,
    image5: String,
    image6: String,
    image7: String,
    image8: String,
    image9: String,
    image10: String
  },
  { timestamps: true }
);

const CartItem = mongoose.model("CartItem", CartItemSchema);

const OrderSchema = new mongoose.Schema(
  {
    products: [CartItemSchema],
    transaction_id: {},
    amount: { type: Number },
    address: { type: Object },
    receiptName: String,
    receiptData:String,
    status: {
      type: String,
      default: "Not processed",
      enum: ["Not processed", "Processing","Shipping","Shipped", "Delivered", "Cancelled"] // enum means string objects
    },
    receiptName:{
      type: String,

    },
    trackingNumber:{
      type: String,

    },
    receiptData:{
      type: String

    },
    updated: Date,
    user: { type: ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order, CartItem };
