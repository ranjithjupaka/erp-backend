const { Enquiry } = require("../models/Enquiry");
const { Item } = require("../models/Item");
const { Purchase_detail } = require("../models/Purchase_detail");
const { Sales_detail } = require("../models/Sales_detail");

exports.purchaseById = (req, res, next, id) => {
  console.log(id);
  req.purchase_refId = id
  next()
}

exports.createAlternateSell=(req,res,next)=>{
  const sellDefault={
    selling_type:"NA",
      selling_price:0,
      selling_discount:0,
      selling_gst:0,
      selling_total:0,
      status:1, 
      comment:"NA",
  }
  const sell=new Sales_detail(sellDefault);
  sell.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: error,
        success : false
      })
    }
    // purchase_ref = data._id
    req.sell_ref = data._id
    next()
  
  })
}

  exports.createAlternatePurchase=(req,res,next)=>{
    console.log(req.body.purchaseItem);
    const default_ref=req.sell_ref;
    console.log(default_ref);
    const purchaseDefault={
      quote:req.body.purchaseItem.quote, 
      purchase_type:req.body.purchaseItem.purchase_type,
      purchase_price:req.body.purchaseItem.purchase_price,
      discount: req.body.purchaseItem.discount,
      gst: req.body.purchaseItem.gst,
      total: req.body.purchaseItem.total,
      availability:req.body.purchaseItem.availability,
      vendor_email:req.body.purchaseItem.vendor_email,
      vendor_name:req.body.purchaseItem.vendor_name,
      vendor_mode:req.body.purchaseItem.vendor_mode,
      vendor_phone:req.body.purchaseItem.vendor_phone,
      purchase_quote_date:req.body.purchaseItem.purchase_quote_date,
    }

    const purchase=new Purchase_detail(purchaseDefault);
    purchase.save((error, data) => {
      if (error) {
        return res.status(400).json({
          error: error,
          success : false
        })
      }
      req.purchase_ref = data._id
      req.sell_ref=default_ref;
      next()
    
    })
  }
  exports.createOptionPurchase=(req,res,next)=>{
    console.log(req.body.purchaseItem);
    const purchaseDefault={
      quote:req.body.purchaseItem.quote, 
      purchase_type:req.body.purchaseItem.purchase_type,
      purchase_price:req.body.purchaseItem.purchase_price,
      discount: req.body.purchaseItem.discount,
      gst: req.body.purchaseItem.gst,
      total: req.body.purchaseItem.total,
      availability:req.body.purchaseItem.availability,
      vendor_email:req.body.purchaseItem.vendor_email,
      vendor_name:req.body.purchaseItem.vendor_name,
      vendor_mode:req.body.purchaseItem.vendor_mode,
      vendor_phone:req.body.purchaseItem.vendor_phone,
      purchase_quote_date:req.body.purchaseItem.purchase_quote_date,
    }

    const purchase=new Purchase_detail(purchaseDefault);
    purchase.save((error, data) => {
      if (error) {
        return res.status(400).json({
          error: error,
          success : false
        })
      }
      req.purchase_ref = data._id
      next()
    
    })
  }


exports.createAlternateItem = (req, res, next) => {
  console.log(req.sell_ref);
  console.log(req.purchase_ref);

    const itemdata={
      item_description: req.body.purchaseItem.item_description,
      model: req.body.purchaseItem.model,
      brand:req.body.purchaseItem.brand,
      quantity:req.body.purchaseItem.quantity,
      unit: req.body.purchaseItem.unit,
      purchase_refId:req.purchase_ref,
      sales_refId:req.sell_ref,
    }


    const item = new Item(itemdata)
  // const item = new Item(req.body.item)
  item.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: error,
        success : false
      })
    }
    req.itemId = data._id
    // console.log(req.itemId);
    next()
  })
}

exports.addAlternateItem=(req,res,next)=>{
  Item.findOneAndUpdate(
     { _id: req.body.itemId },
     { $push: { alternateItem: req.itemId } },
     { new: true },
     (error, data) => {
       if (error) {
         return res.status(400).json({
           error: 'sorry updating Items for this order not sucessful',
           success : false
         })
       }
       return res.status(200).json({ message: 'Alternative Added Successfully.', data: data, success : true })
     }
   )
}

exports.addOptionItems=(req,res)=>{
  Item.findOneAndUpdate(
    { _id: req.body.itemId },
    { $push: { optionsItem: req.purchase_ref } },
    { new: true },
    (error, data) => {
      if (error) {
        return res.status(400).json({
          error: 'sorry updating Items for this order not sucessful',
          success : false
        })
      }
      return res.status(200).json({ message: 'Option Added Successfully.', data: data, success : true })
    }
  )
}

  exports.addAlternativePurchaseItem=(req,res,next)=>{
    const purchaseDefault={
      item_description: req.body.item.item_description,
      model: req.body.item.model,
      brand:req.body.item.brand,
      quantity:req.body.item.quantity,
      unit: req.body.item.unit,
      quote:"", 
      purchase_type:"Same",
      purchase_price: 0,
      discount: 0,
      gst: 0,
      total: 0,
      availability:"",
      // vendor_email:"NA",
      vendor_name:"",
      purchase_quote_date: "",
    }

    const purchase=new Purchase_detail(purchaseDefault);
    purchase.save((error, data) => {
      if (error) {
        return res.status(400).json({
          error: error,
        })
      }
      // purchase_ref = data._id
      req.purchase_ref = data._id
      req.sell_ref=default_ref;
      next()
    
    })
  }




exports.updatepurchasePerson = (req, res) => {
 
  console.log(req.body);
  console.log(req.body.queryId);
  Enquiry.findOneAndUpdate(
    { _id: req.body.queryId},
    {
      $set: {"purchase_person":req.body.person},
    },
    (error, data) => {
      if (error) {
        return res.status(400).json({
          error: "sorry updating items for thhis query not sucessful",
          msg : "Unable to Update.",
          success : false
        });
      }
      console.log(data);
      return res.status(200).json({ message: "purchase Person name updated",success : true });
    }
  );
};
exports.updatepurchasing = (req, res) => {
 
  req.body._id = req.purchase_refId
  Purchase_detail.findOneAndUpdate(
    { _id: req.purchase_refId},
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return res.status(404).json({
          error: "sorry updating item for this query not sucessful",
          success : false
        });
      }
      console.log(data);
      return res.status(200).json({ message: "Updated Successfully.",success : true });
    }
  );
};

exports.listpurchase = (req, res) => {
  Enquiry.find()
    .sort({ updatedAt: -1 })
    .populate({
      path : 'items',
      populate : [
        {path : 'purchase_refId'},
        {path : 'alternateItem',
         model:'Item',
            populate:{
            path:'purchase_refId'
           }
      },
      {path : 'optionsItem',
         model:'Purchase_detail',}
      ]
    })
    .exec((err, queries) => {
      console.log(queries);
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: err,
        });
      }

      res.json(queries);
    });
};

exports.removeOption = (req,res) => {
  Purchase_detail.remove(
    {_id : req.purchase_refId},
    (err, deletedItem) => {
      if (err) {
        return res.status(400).json({
          error: err,
          msg : "Failed to delete Option.",
          success : false
        })
      }
    })
    return res.status(200).json({
      message : "Item Deleted Succesfully",
      success : true
    })
}