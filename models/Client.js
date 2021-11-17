const mongoose = require('mongoose')

const ClientSchema = new mongoose.Schema(
  {
    sno: { type: Number,unique:true},
    client_id: { type: String, length: 10, required: true },
    contact_id: { type: String, length: 12, required: true },
    quotation_email: { type: String, minlength: 13, required: true },
    friendly_companyName: { type: String, required: true },
    client_fullName: { type: String, required: true },
    company_printName: { type: String, required: true },
    full_address: { type: String, required: true },
    updated: Date,
  },
  { timestamps: true }
)

const Client = mongoose.model('Client', ClientSchema)

module.exports = { Client }
