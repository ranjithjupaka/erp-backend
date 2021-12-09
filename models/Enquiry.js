const mongoose = require('mongoose')
const { Item } = require('./Item')


const EnquirySchema = new mongoose.Schema(
  {
    unique_id: {
      unique: true,
      type: String,
      required: true,
      trim:true
    },
    email_time: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    client_email: {
      type: String,
      required: true,
    },
    client_company: {
      type: String,
      required: true,
    },
    client_name: {
      type: String,
      required: true,
    },
    inRecycleBin: {
      type: Boolean,
      default:false,
    },
    client_no: {
      type: String,
      required: true,
    },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    client_rfqno: {
      type: String,
      default:'',
    },
    sales_person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    purchase_person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updated: Date,
  },
  { timestamps: true }
)

const Enquiry = mongoose.model('Enquiry', EnquirySchema)

module.exports = { Enquiry }
