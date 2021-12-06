const mongoose = require("mongoose");
const RecycleSchema = new mongoose.Schema(
  {
    enquiry_refId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enquiry',
      },
  },
  { timestamps: true }
);

const Recycle = mongoose.model("Recycle", RecycleSchema);

module.exports = { Recycle };
