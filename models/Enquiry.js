const mongoose = require('mongoose')
const { Item } = require('./Item')


const EnquirySchema = new mongoose.Schema(
  {
    unique_id: {
      unique: true,
      type: String,
      required:true
    },
    email_time: {
      type: String,
      minlength: 17,
    },
    client_email: {
      unique: true,
      type: String,
      minlength: 15,
    },
    client_company: {
      type: String,
      required:true,
      minlength: 1,
    },
    client_name: {
      type: String,
      required: true,
    },
    client_no: {
      type: String,
      minlength: 10,
    },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item'}],
    client_rfqno: {
      type: String,
      required: true,
    },
    updated: Date,
  },
  { timestamps: true }
)

const Enquiry = mongoose.model('Enquiry', EnquirySchema)

module.exports = { Enquiry }