const { Enquiry } = require("../models/Enquiry");
const { Item } = require("../models/Item");
const { Recycle } = require("../models/Recycle");

//get all query in recycle bin
exports.listRecycleQuery = (req, res) => {
  Recycle.find()
    .sort({ updatedAt: -1 })
    .populate({
      path: "enquiry_refId",
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

//move query to recycle bin and update inRecycleBin to true
exports.moveToRecycle = (req, res) => {
  console.log(req.body.queryId);
  const recycle = new Recycle({
    enquiry_refId: req.body.queryId,
  });

  recycle.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: error,
        msg: "Failed to remove.",
        success: false,
      });
    }

    Enquiry.findOneAndUpdate(
      { _id: req.body.queryId },
      {
        $set: { inRecycleBin: true },
      },
      (error, data) => {
        if (error) {
          return res.status(400).json({
            error: "sorry error",
            success: false,
          });
        }
        return res
          .status(200)
          .json({ message: "Moved to recycle bin", success: true });
      }
    );
  });
};

//restore from recycle bin implies delete query form recycle colleciton and update inRecycleBin to flase
exports.restoreQuery = (req, res) => {
  // set inRecycle to false
  Enquiry.findOneAndUpdate(
    { _id: req.body.queryId },
    {
      $set: { inRecycleBin: false },
    },
    (error, data) => {
      if (error) {
        return res.status(400).json({
          error: "sorry error",
          success: false,
        });
      }

      //remove query from recycle collection
      Recycle.remove({ _id: req.body.recycleId }, (err, deletedItem) => {
        if (err) {
          return res.status(400).json({
            error: err,
            msg: "Failed to Delete Item.",
            success: false,
          });
        }
        return res
          .status(200)
          .json({
            message: "Restored form recycle bin successfully ",
            success: true,
          });
      });
    }
  );
};

//remove Query Permanently
exports.removeEnquiryPermanently = (req, res) => {
  let enquiry = req.params.queryId;

  Item.deleteMany({ _id: { $in: enquiry.items } }).exec((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
        msg: "Failed to Delete Enquiry.",
        success: false,
      });
    }
    Enquiry.remove({ _id: req.params.queryId },(err, deletedQuery) => {
      if (err) {
        return res.status(400).json({
          error: err,
          msg: "Failed to Delete Enquiry.",
          success: false,
        });
      }
      //remove query from recycle collection
      Recycle.remove({ _id: req.params.recycleId }, (err, deletedItem) => {
        if (err) {
          return res.status(400).json({
            error: err,
            msg: "Failed to Delete Item.",
            success: false,
          });
        }
        return res.json({
          deletedItem,
          message: "Enquiry deleted sucessfully",
          success: true,
        });
      });
    });
  });
};
