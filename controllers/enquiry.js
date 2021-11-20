const { Enquiry } = require("../models/Enquiry");
const { Item } = require("../models/Item");
const {Purchase_detail}=require('../models/Purchase_detail')
const {Sales_detail}=require('../models/Sales_detail')


exports.EnquiryById = (req, res, next, id) => {
  Enquiry.findById(id).exec((err, enquiry) => {
    if (err || !enquiry) {
      return res.status(400).json({
        error: 'Enquiry not found',
      })
    }
    req.enquiry = enquiry
    next()
  })
}

exports.itemById = (req, res, next, id) => {
  console.log(id);
  Item.findById(id).exec((err, item) => {
    if (err || !item) {
      return res.status(400).json({
        error: 'item not found',
      })
    }
    req.item = item
    console.log(item);
    next()
  })
}

exports.altItemById = (req, res, next, id) => {
  console.log(id);
  Item.findById(id).exec((err, item) => {
    if (err || !item) {
      return res.status(400).json({
        error: 'item not found',
      })
    }
    req.alt = item
    console.log(item);
    next()
  })
}


exports.createSell=(req,res,next)=>{
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
        msg : "Failed to create.",
        success : false,
      })
    }
    // purchase_ref = data._id
    req.sell_ref = data._id
    next()
  
  })
}

exports.createBulkSell=(req,res,next)=>{
   
   const sellDefault = [];
   const items = req.body.items
   for(let i in items){
        sellDefault.push({
          selling_type: 'NA',
          selling_price: 0,
          selling_discount: 0,
          selling_gst: 0,
          selling_total: 0,
          status: 1,
          comment: 'NA',
        })
   }
   console.log(sellDefault);
   try {
     Sales_detail.insertMany(sellDefault).then((data) => {
       req.sell_refs = data.map((sell) => sell._id)
       console.log(req.sell_refs,'sell refs')
       next()
     })
   } catch (error) {
     res.status(400).json({ error: error })
   } 
}

  exports.createPurchase=(req,res,next)=>{
    
    const default_ref=req.sell_ref;
    console.log(default_ref);
    const purchaseDefault={
      quote:"", 
      purchase_type:"",
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
          msg : "Failed to create.",
          success : false
        })
      }
      // purchase_ref = data._id
      req.purchase_ref = data._id
      req.sell_ref=default_ref;
      next()
    
    })
  }

  exports.createBulkPurchase = (req, res, next) => {
    const default_refs = req.sell_refs
    const purchaseDefault = [];
    for(let i in default_refs){
      purchaseDefault.push({
        quote: '',
        purchase_type: '',
        purchase_price: 0,
        discount: 0,
        gst: 0,
        total: 0,
        availability: '',
        vendor_name: '',
        purchase_quote_date: '',
      })
    }
    console.log(purchaseDefault)
    try {
      Purchase_detail.insertMany(purchaseDefault).then((data) => {
        req.purchase_refs = data.map((pur) => pur._id)
        console.log(req.purchase_refs,'purchase refs')
        next()
      })
    } catch (error) {
      res.status(400).json({ error: error })
    } 

  }


exports.createItem = (req, res, next) => {
  console.log(req.sell_ref);
  console.log(req.purchase_ref);

    const itemdata={
      item_description: req.body.item.item_description,
      model: req.body.item.model,
      brand:req.body.item.brand,
      quantity:req.body.item.quantity,
      unit: req.body.item.unit,
      purchase_refId:req.purchase_ref,
      sales_refId:req.sell_ref,
    }


    const item = new Item(itemdata)
  // const item = new Item(req.body.item)
  item.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: error,
        msg : "Failed to create.",
        success : false,
      })
    }
    req.itemId = data._id
    next()
  })
}

exports.bulkCreateItem = (req, res,next) => {
   
  const items = req.body.items;
  const purchase_refs = req.purchase_refs;
  const sell_refs = req.sell_refs;

  items.forEach((item,i) => {
     item.purchase_refId = purchase_refs[i];
     item.sales_refId = sell_refs[i];
  });

   console.log(items ,'items')
    try {
      Item.insertMany(items).then((data) => {
       
        req.itemIds = data.map((item) => item._id);
        console.log(req.itemIds);
        next()
      })
     
    } catch (error) {
      res.status(400).json({error:error})
    }
    
}

exports.createEnquiry = (req, res,next) => {
  const user = req.user;
  const enquiry = new Enquiry({
    unique_id: req.body.unique_id,
    email_time: req.body.email_time,
    client_email: req.body.client_email,
    client_company: req.body.client_company,
    client_name: req.body.client_name,
    client_no: req.body.client_no,
    client_rfqno: req.body.client_rfqno,
    sell_person: req.body.sell_person,
    priority: req.body.priority,
    items: [req.itemId],
    sales_person: user._id,
    purchase_person: req.body.purchase_person,
  })
  enquiry.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: error,
        msg : "Failed to create.",
        success : false,
      })
    }
    console.log(data);
    enquiryId = data._id
    next()
    // res.status(200).json({ msg: 'success', data: data })
  })
}

exports.createBulkItemEnquiry = (req, res, next) => {
  const user = req.user
  const enquiry = new Enquiry({
    unique_id: req.body.unique_id,
    email_time: req.body.email_time,
    client_email: req.body.client_email,
    client_company: req.body.client_company,
    client_name: req.body.client_name,
    client_no: req.body.client_no,
    client_rfqno: req.body.client_rfqno,
    sell_person: req.body.sell_person,
    priority: req.body.priority,
    items: [...req.itemIds],
    sales_person: user._id,
    purchase_person: req.body.purchase_person,
  })
  enquiry.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: error,
      })
    }
    console.log(data)
    enquiryId = data._id
    next()
    // res.status(200).json({ msg: 'success', data: data })
  })
}

exports.readEnquiry = (req, res) => {
  console.log(req.enquiry);
    res.status(200).json({msg:'success',data:req.enquiry})
}

// exports.update = (req, res) => {
//   Query.findOneAndUpdate(
//     { _id: req.query._id },
//     { $set: req.body },
//     { new: true },
//     (err, query) => {
//       if (err) {
//         return res.status(400).json({
//           error: 'query update failed',
//         })
//       }
//       res.json(query)
//     }
//   )
// }

exports.listEnquiries = (req, res) => {
  let sortBy = req.query.sort ? req.query.sort : 'unique_id';
  let order = req.query.order ? parseInt(req.query.order) : 1;

   Enquiry.find()
    .sort([[sortBy, order]])
    .populate({
      path: "items",
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
     .populate('sales_person')
     .exec((err, queries) => {
       if (err) {
         console.log(err)
         return res.status(400).json({
           error: err,
         })
       }

       res.json(queries)
     })
}

// exports.priorityEnquiries = (req,res) => {
//    let sortBy = req.query.sort ? req.query.sort : 'unique_id'
//    let order = req.query.order ? parseInt(req.query.order) : 1
//    const priorities = []

//    if (req.query.top === 'true') {
//      priorities.push({ priority: 'Top' })
//    } 
//    if (req.query.normal === 'true') {
//      priorities.push({ priority: 'Normal' })
//    } 
//    if (req.query.urgent === 'true') {
//      priorities.push({ priority: 'Urgent' })
//    }
//  console.log(req.query.top, req.query.normal,priorities)
//    Enquiry.find({$and:priorities})
//      .sort([[sortBy, order]])
//      .populate({
//        path: 'items',
//        populate: {
//          path: 'purchase_refId',
//        },
//      })
//      .exec((err, queries) => {
//        if (err) {
//          console.log(err)
//          return res.status(400).json({
//            error: err,
//          })
//        }

//        res.json(queries)
//      })
// }

exports.addItem = (req,res) => {
   const enquiry = req.enquiry ;
   Enquiry.findOneAndUpdate(
     { _id: enquiry._id },
     { $push: { items: req.itemId } },
     { new: true },
     (error, data) => {
       if (error) {
         return res.status(400).json({
           error: 'sorry updating Items for this order not sucessful',
           msg : "Failed to create.",
        success : false,
         })
       }
       return res.status(200).json({ message: 'Item Created Successfully.', data: data, success : true })
     }
   )
}
exports.removeAlternateRef = (req,res,next) => {
  Item.remove(
    { _id : req.item._id },
    { $pull: { alternateItem: req.alt._id } },
    (err, deletedItem) => {
      if (err) {
        return res.status(400).json({
          error: err,
        })
      }
      next()
    }
  )
}
exports.removeAlternateItem = (req,res,next) => {
  const alt = req.alt
  Item.remove(
    { _id : alt._id },
    (err, deletedItem) => {
      if (err) {
        return res.status(400).json({
          error: err,
          msg : "Failed to Delete Item.",
        success : false
        })
      }
    }
  )
  Purchase_detail.remove(
    {_id : alt.purchase_refId},
    (err, deletedItem) => {
      if (err) {
        return res.status(400).json({
          error: err,
          msg : "Failed to Delete Item.",
        success : false
        })
      }
    })
  Sales_detail.remove(
    {_id : alt.sales_refId},
    (err, deletedItem) => {
      if (err) {
        return res.status(400).json({
          error: err,
          msg : "Failed to Delete Enquiry.",
        success : false
        })
      }
    })
  
  return res.status(200).json({
    message : "Item Deleted Succesfully",
    success : true
  })
}

exports.bulkAddItem = (req, res) => {
   const enquiry = req.enquiry
   Enquiry.findOneAndUpdate(
     { _id: enquiry._id },
     { $push: { items: req.itemIds } },
     { new: true },
     (error, data) => {
       if (error) {
         return res.status(400).json({
           error: 'sorry adding Items for this Enquiry not sucessful',
         })
       }
       res.status(200).json({ msg: 'success', data: data })
     }
   )
  // console.log(req.body.items)
  // try {
  //   Item.insertMany(req.body.items).then((data) => {
  //     req.itemIds = data.map((item) => item._id)
  //     console.log(req.itemIds)
  //     res.status(200).json({ msg: 'success', data: data })
  //   })
  // } catch (error) {
  //   res.status(400).json({ error: error })
  // }
}

exports.removeItem = (req, res) => {
  let item = req.item
  let enquiry = req.enquiry;
   
  Enquiry.findOneAndUpdate(
    { _id: enquiry._id },
    { $pull: { items: item._id } },
    { new: true },
    (error, data) => {
      if (error) {
        return res.status(400).json({
          error: 'sorry removing Items for this order not sucessful',
          msg : "Failed to delete Item.",
          success : false,
        })
      }
    }
  );

  item.remove((err, deletedItem) => {
    if (err) {
      return res.status(400).json({
        error: err,
        msg : "Failed to delete Item.",
        success : false
      })
    }

    return res.json({
      deletedItem,
      message: 'Item deleted sucessfully',
      success : true
    })
  })
}


exports.updateItem = (req, res) => {
 
  const item = req.item ;

 Item.updateOne({ _id: item._id }, { $set: req.body }, (error, data) => {
   if (error) {
     return res.status(400).json({
       error: 'sorry updating items for this query not sucessful',
       msg : 'Failed to update Item',
        success : false,
     })
   }
   console.log(data)
   return res.status(200).json({ message: 'Item Updated Successfully.',data:data, success : true })
 })
}

exports.updateAlternativeItem = (req, res) => {
 
  const item = req.body ;

 Item.updateOne({ _id: item._id }, { $set: req.body }, (error, data) => {
   if (error) {
     return res.status(400).json({
       error: 'sorry updating items for this query not sucessful',
       msg : "Failed to update Alternate Item.",
       success : false
     })
   }
   console.log(data)
   return res.status(200).json({ message: 'Item Updated Successfully.',data:data, success : true })
 })
}

exports.removeEnquiry = (req, res) => {
  let enquiry = req.enquiry;
  console.log(enquiry.items)
  Item.deleteMany({_id : {$in:enquiry.items }}).exec((err) => {
    if(err) 
    {
      return res.status(400).json({
        error: err,
        msg : "Failed to Delete Enquiry.",
        success : false
      })
    }
  });

  enquiry.remove((err, deletedQuery) => {
    if (err) {
      return res.status(400).json({
        error: err,
        msg : "Failed to Delete Enquiry.",
        success : false
      })
    }

    return res.json({
      deletedQuery,
      message: 'Enquiry deleted sucessfully',
      success : true
    })
  })
}

exports.listSearch = (req, res) => {
  const field = req.query.field ? req.query.field:'client_email'
  try {
    Enquiry.aggregate([
      {
        $search: {
          autocomplete: {
            query: `${req.query.term}`,
            path: field,
          },
        },
      },
      {
        $lookup: {
          from: 'items',
          localField: 'items',
          foreignField: '_id',
          as: 'items',
        },
      },
    ]).exec((error, data) => {
      if (error) {
        return res.status(400).json({
          error: error,
        })
      }
      console.log(data)
      res.status(200).send(data)
    })
  } catch (e) {
    res.status(500).send({ message: e.message })
  }
}


// exports.listBySearch = (req, res) => {
//   let order = req.body.order ? parseInt(req.body.order):1
//   let sortBy = req.body.sortBy ? req.body.sortBy : '_id'
//   let limit = req.body.limit ? parseInt(req.body.limit) : 100
//   let skip = parseInt(req.body.skip)
//   let findArgs = {}

//   // console.log(order, sortBy, limit, skip, req.body.filters);
//   // console.log("findArgs", findArgs);

//   for (let key in req.body.filters) {
//     if (req.body.filters[key].length > 0) {
//       if (key === 'price') {
//         // gte -  greater than price [0-10]
//         // lte - less than
//         findArgs[key] = {
//           $gte: req.body.filters[key][0],
//           $lte: req.body.filters[key][1],
//         }
//       } else {
//         findArgs[key] = req.body.filters[key]
//       }
//     }
//   }

//   Query.find(findArgs)
//     .sort({sortBy:order})
//     .skip(skip)
//     .limit(limit)
//     .exec((err, data) => {
//       if (err) {
//         return res.status(400).json({
//           error: 'Queries  not found',
//         })
//       }
//       res.json({
//         size: data.length,
//         data,
//       })
//     })
// }

// const query = {}
// if (req.query.search) {
//   query.name = { $regex: req.query.search, $options: 'i' }
//   if (req.query.category && req.query.category != 'All') {
//     query.category = req.query.category
//   }
// }

// Query.find(query, (err, products) => {
//   if (err) {
//     return res.status(400).json({
//       error: errorHandler(err),
//     })
//   }
//   console.log(products)
//   return res.json(products)
// })



// exports.getEnquiries = async (req, res) => {
//   let payload = req.body.payloady.trim()
//   let search = await Query.find({
//     client_name: { $regex: new RegExp('^' + payload + '.*', 'i') },
//   }).exec()
//   search = search.slice(0, 10)
//   res.send({ payload: search })
// }
