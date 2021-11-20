const { User } = require("../models/users");


exports.enquires_filled = (req,res,next) => {
  user = req.user;
  User.updateOne({ _id: user._id }, { $inc: { enquiries_filled : 1} }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'Updating enquires filled is failed ',
        msg : "Failed to create.",
        success : false,
      })
    }
    console.log("Updating enquires filled is Sucess");
    next()
})
}

exports.pending_enquiry = (req, res, next) => {
  userId = req.body.purchase_person
  User.updateOne({ _id: userId }, { $inc: { pending_enquiries: 1 } }).exec(
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: 'Updating enquires filled is failed ',
          msg : "Failed to create.",
        success : false,
        })
      }
      console.log('Updating enquires filled is Sucess')
      next()
    }
  )
}

