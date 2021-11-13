const mongoose = require("mongoose");
const PurchaseSchema = new mongoose.Schema(
  {
    quote: {
      type: String,
      required: true,
    },
    purchase_type: {
      type: String,
      required: true,
    },
    purchase_price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    gst: {
      type: Number,
      required: true,
    },
    total: Number,
    availability: {
      type: String,
      required: true,
    },
    estimated_delivery : {
      type:  Date,
    },
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
