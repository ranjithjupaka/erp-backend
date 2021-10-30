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
      })
    }
    // purchase_ref = data._id
    req.sell_ref = data._id
    next()
  
  })
}

  exports.createPurchase=(req,res,next)=>{
    
    const default_ref=req.sell_ref;
    console.log(default_ref);
    const purchaseDefault={
      quote:"NA", 
      purchase_type:"NA",
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
      })
    }
    req.itemId = data._id
    // console.log(req.itemId);
    next()
  })
}

exports.createEnquiry = (req, res) => {
  
  const enquiry = new Enquiry({
      unique_id: req.body.unique_id,
      email_time: req.body.email_time,
      client_email: req.body.client_email,
      client_company:req.body.client_company,
      client_name: req.body.client_name,
      client_no: req.body.client_no,
      client_rfqno: req.body.client_rfqno,
      priority:req.body.priority,
      items:[req.itemId]
  })
  enquiry.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: error,
      })
    }
    res.status(200).json({ msg: 'success', data: data })
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
      populate : {
        path : 'purchase_refId'
      }
     })
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
         })
       }
       res.status(200).json({ msg: 'success', data: data })
     }
   )
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
        })
      }
    }
  );

  item.remove((err, deletedItem) => {
    if (err) {
      return res.status(400).json({
        error: err,
      })
    }

    res.json({
      deletedItem,
      message: 'Item deleted sucessfully',
    })
  })
}


exports.updateItem = (req, res) => {
 
  const item = req.item ;

 Item.updateOne({ _id: item._id }, { $set: req.body }, (error, data) => {
   if (error) {
     return res.status(400).json({
       error: 'sorry updating items for this query not sucessful',
     })
   }
   console.log(data)
   res.status(200).json({ msg: 'success',data:data })
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
      })
    }
  });

  enquiry.remove((err, deletedQuery) => {
    if (err) {
      return res.status(400).json({
        error: err,
      })
    }

    res.json({
      deletedQuery,
      message: 'Enquiry deleted sucessfully',
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
