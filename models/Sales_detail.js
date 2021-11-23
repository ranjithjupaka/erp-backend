const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema(
  {
    selling_type: {
      type: String,
    },
    selling_price: {
      type: Number,
    },
    selling_discount: {
      type: Number,
    },
    selling_gst: {
      type: Number,
    },
    selling_total: {
      type: Number,
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

