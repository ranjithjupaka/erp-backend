const mongoose = require('mongoose')

const VendorSchema = new mongoose.Schema(
  {
    vendorName: { type: String, required: true },
    vendorPhone: { type: String, default : '' },
    vendorEmail: { type: String, default: '' },
    updated: Date,
  },
  { timestamps: true }
)

const Vendor = mongoose.model('Vendor', VendorSchema)

module.exports = { Vendor }
