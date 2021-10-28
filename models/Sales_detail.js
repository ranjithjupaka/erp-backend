const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema(
  {
    selling_type: {
      type: String,
      required: true,
    },
    selling_price: {
      type: Number,
      required: true,
    },
    selling_discount: {
      type: Number,
      required: true,
    },
    selling_gst: {
      type: Number,
      required: true,
    },
    selling_total: {
      type: Number,
      required: true,
    },
    status:{
      type:String
    }, 
     comment:{
      type:String
    },
  },
  { timestamps: true }
);

const Sales_detail = mongoose.model("Sales_detail", SalesSchema);

module.exports = { Sales_detail };

