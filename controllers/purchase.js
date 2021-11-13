const { Enquiry } = require("../models/Enquiry");
const { Item } = require("../models/Item");
const { Purchase_detail } = require("../models/Purchase_detail");
const { Sales_detail } = require("../models/Sales_detail");


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
      purchase_quote_date:req.body.purchaseItem.purchase_quote_date,
    }

    const purchase=new Purchase_detail(purchaseDefault);
    purchase.save((error, data) => {
      if (error) {
        return res.status(400).json({
          error: error,
        })
      }
      req.purchase_ref = data._id
      req.sell_ref=default_ref;
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
         })
       }
       res.status(200).json({ msg: 'success', data: data })
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
      quote:"NA", 
      purchase_type:"Same",
      purchase_price: 0,
      discount: 0,
      gst: 0,
      total: 0,
      availability:"NA",
      // vendor_email:"NA",
      vendor_name:"NA",
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
        });
      }
      console.log(data);
      res.status(200).json({ msg: "purchase Person name updated" });
    }
  );
};
exports.updatepurchasing = (req, res) => {
 
  console.log(req.body);
  console.log(req.body._id);
  Purchase_detail.findOneAndUpdate(
    { _id: req.body._id},
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return res.status(400).json({
          error: "sorry updating items for thhis query not sucessful",
        });
      }
      console.log(data);
      res.status(200).json({ msg: "success" });
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
