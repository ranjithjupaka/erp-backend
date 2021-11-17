const { Enquiry } = require("../models/Enquiry");
const { Item } = require("../models/Item");
const { Purchase_detail } = require("../models/Purchase_detail");
const { Sales_detail } = require("../models/Sales_detail");






exports.listSearch = (req, res) => {

const searchField=req.query.id;
Purchase_detail.find({
  vendor_email:{$regex:searchField,$options:'$i'}
}).then(data=>{
  res.json(data)
})
}

//updating sales details only
exports.updateSells = (req, res) => {
  console.log(req.body);
  console.log(req.body._id);
  Sales_detail.findOneAndUpdate(
    { _id: req.body._id },
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

//getting all details
exports.listpurchaseandSales = (req, res) => {
  Enquiry.find()
    .sort({ updatedAt: -1 })
    .populate({
      path: "items",
      populate:[        
        {path : 'purchase_refId'},
        {path : 'sales_refId'},
        {path : 'alternateItem',
         model:'Item',
           populate:[
           {path:'purchase_refId'},
           {path:'sales_refId'}
           ]
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
