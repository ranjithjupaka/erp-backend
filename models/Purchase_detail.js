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
    vendor_email: {
      type: String,
    },
    vendor_name: {
      type: String,
    },
    purchase_quote_date: Date,
  },
  { timestamps: true }
);

const Purchase_detail = mongoose.model("Purchase_detail", PurchaseSchema);

module.exports = { Purchase_detail };
