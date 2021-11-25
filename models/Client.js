const mongoose = require('mongoose')

const ClientSchema = new mongoose.Schema(
  {
    sno: { type: Number, unique: true },
    client_id: { type: String},
    quotation_email: { type: String},
    friendly_companyName: { type: String},
    client_fullName: { type: String},
    client_Num: { type: String},
    company_printName: { type: String},
    unitName: { type: String},
    city:{type:String},
    full_address: { type: String},
    updated: Date,
  },
  { timestamps: true }
)

const Client = mongoose.model('Client', ClientSchema)

module.exports = { Client }
