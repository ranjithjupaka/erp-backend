const { Enquiry } = require("../models/Enquiry");
const { Item } = require("../models/Item");
const { Purchase_detail } = require("../models/Purchase_detail");
const { Sales_detail } = require("../models/Sales_detail");


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

exports.listpurchaseandSales = (req, res) => {
  Enquiry.find()
    .sort({ updatedAt: -1 })
    .populate({
      path: "items",
      populate: ("purchase_refId sales_refId")
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
