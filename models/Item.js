const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema(
  {
    item_description: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      default:''
    },
    brand: {
      type: String,
      default:'',
    },
    quantity: {
      required: true,
      type: Number,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
    },
    purchase_refId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Purchase_detail',
    },
    alternateItem: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purchase_detail'}],
    optionsProduct: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item'}],
    optionsItem: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purchase_detail'}],
    sales_refId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Sales_detail',
      default:null
    },
    admin_statement:{
      type:String,
      default:""
    },
    purchase_added : {
      type : Boolean,
      default : false
    },
    quoted : {
      type : Boolean,
      default : false
    },
    updated: Date,
  },
  { timestamps: true }
)

const Item = mongoose.model('Item', ItemSchema)

module.exports = { Item, ItemSchema }
