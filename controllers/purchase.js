const { Enquiry } = require("../models/Enquiry");
const { Item } = require("../models/Item");
const { Purchase_detail } = require("../models/Purchase_detail");


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
      populate : {
        path : 'purchase_refId'
      }
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
