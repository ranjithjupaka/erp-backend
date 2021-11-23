const mongoose = require("mongoose");
const PurchaseSchema = new mongoose.Schema(
  {
    quote: {
      type: String,
      default : "",
    },
    purchase_type: {
      type: String,
      default : "",
    },
    purchase_price: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default : 0,
    },
    gst: {
      type: Number,
      default : 0,
    },
    total: Number,
    availability: {
      type: String,
    },
    estimated_delivery :  Date,
    vendor_email: {
      type: String,
      default: "",
    },
    vendor_mode: {
      type: String,
      default: "email",
    },
    vendor_name: {
      type: String,
    },
    vendor_phone: {
      type: String,
      default: "",
    },
    purchase_quote_date: Date,
  },
  { timestamps: true }
);

const Purchase_detail = mongoose.model("Purchase_detail", PurchaseSchema);

module.exports = { Purchase_detail };
